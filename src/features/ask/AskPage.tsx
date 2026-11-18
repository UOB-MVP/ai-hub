import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bot, Send, ShieldCheck, Sparkles, User as UserIcon } from 'lucide-react';
import { PageHero } from '@/components/ui';
import { useContent } from '@/core/ContentContext';
import { usePlatform } from '@/core/PlatformContext';
import type { AiApp, LearningContent } from '@/core/types';
import './ask.css';

const STOPWORDS = new Set(['the', 'a', 'an', 'is', 'are', 'was', 'were', 'how', 'what', 'when', 'where', 'why', 'to', 'of', 'for', 'in', 'on', 'and', 'or', 'do', 'does', 'can', 'i', 'my', 'me', 'you', 'your']);

function tokenize(text: string): string[] {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter((w) => w.length > 2 && !STOPWORDS.has(w));
}

type Candidate = { kind: 'learning'; item: LearningContent } | { kind: 'app'; item: AiApp };

function bestMatch(query: string, learning: LearningContent[], apps: AiApp[]): { candidate: Candidate; score: number } | null {
  const qTokens = new Set(tokenize(query));
  if (!qTokens.size) return null;
  let best: { candidate: Candidate; score: number } | null = null;
  const consider = (candidate: Candidate, haystackText: string) => {
    const overlap = tokenize(haystackText).filter((w) => qTokens.has(w)).length;
    if (overlap > 0 && (!best || overlap > best.score)) best = { candidate, score: overlap };
  };
  for (const item of learning) consider({ kind: 'learning', item }, `${item.title} ${item.summary} ${item.body ?? ''} ${item.tags.join(' ')}`);
  for (const item of apps) consider({ kind: 'app', item }, `${item.name} ${item.tagline} ${item.description} ${item.tags.join(' ')}`);
  return best;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  source?: { title: string; link: string };
  uncertain?: boolean;
}

export function AskPage() {
  const { items } = useContent();
  const { publishedApps } = usePlatform();
  const published = items.filter((i) => i.status === 'published');
  const [messages, setMessages] = useState<Message[]>([
    { id: 'm-0', role: 'assistant', text: "Ask me anything about AI Hub apps, tips, prompts or news. I only answer from published AI Hub content and I'll say so when I can't find a confident answer." },
  ]);
  const [input, setInput] = useState('');

  const ask = () => {
    const q = input.trim();
    if (!q) return;
    const match = bestMatch(q, published, publishedApps);
    const userMsg: Message = { id: `m-${Date.now()}-u`, role: 'user', text: q };
    const reply: Message = match
      ? match.candidate.kind === 'learning'
        ? { id: `m-${Date.now()}-a`, role: 'assistant', text: match.candidate.item.body ?? match.candidate.item.summary, source: { title: match.candidate.item.title, link: '/learn' } }
        : { id: `m-${Date.now()}-a`, role: 'assistant', text: match.candidate.item.description, source: { title: match.candidate.item.name, link: '/discover' } }
      : { id: `m-${Date.now()}-a`, role: 'assistant', text: "I don't have enough approved AI Hub content to answer that confidently. Try rephrasing, or browse Discover and Learn for related apps and resources.", uncertain: true };
    setMessages((prev) => [...prev, userMsg, reply]);
    setInput('');
  };

  return (
    <>
      <PageHero eyebrow="Ask Me Anything" title="Ask AI Hub" description="Answers are grounded in published AI Hub apps and Learn content only, with a source you can check. If no approved content supports an answer, I'll tell you rather than guess." />
      <div className="card ask-panel">
        <div className="ask-thread">
          {messages.map((m) => (
            <div key={m.id} className={`ask-msg ${m.role}`}>
              <span className="ask-avatar">{m.role === 'user' ? <UserIcon size={16} /> : <Bot size={16} />}</span>
              <div className="ask-bubble">
                {m.role === 'assistant' && (
                  <span className={`ask-disclosure ${m.uncertain ? 'uncertain' : ''}`}><Sparkles size={12} />AI-generated{m.uncertain ? ' · uncertain' : ''}</span>
                )}
                <p>{m.text}</p>
                {m.source && (
                  <Link to={m.source.link} className="ask-source"><ShieldCheck size={13} />Source: {m.source.title}</Link>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="ask-input row">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && ask()}
            placeholder="e.g. How do I summarise a long document?"
          />
          <button className="btn btn-primary" onClick={ask} disabled={!input.trim()} aria-label="Send"><Send size={16} /></button>
        </div>
      </div>
    </>
  );
}
