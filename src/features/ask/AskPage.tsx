import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bot, Send, ShieldCheck, Sparkles, User as UserIcon } from 'lucide-react';
import { PageHero } from '@/components/ui';
import { useContent } from '@/core/ContentContext';
import type { LearningContent } from '@/core/types';
import './ask.css';

const STOPWORDS = new Set(['the', 'a', 'an', 'is', 'are', 'was', 'were', 'how', 'what', 'when', 'where', 'why', 'to', 'of', 'for', 'in', 'on', 'and', 'or', 'do', 'does', 'can', 'i', 'my', 'me', 'you', 'your']);

function tokenize(text: string): string[] {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter((w) => w.length > 2 && !STOPWORDS.has(w));
}

function bestMatch(query: string, items: LearningContent[]): { item: LearningContent; score: number } | null {
  const qTokens = new Set(tokenize(query));
  if (!qTokens.size) return null;
  let best: { item: LearningContent; score: number } | null = null;
  for (const item of items) {
    const haystack = tokenize(`${item.title} ${item.summary} ${item.body ?? ''} ${item.tags.join(' ')}`);
    const overlap = haystack.filter((w) => qTokens.has(w)).length;
    if (overlap > 0 && (!best || overlap > best.score)) best = { item, score: overlap };
  }
  return best;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  source?: LearningContent;
  uncertain?: boolean;
}

export function AskPage() {
  const { items } = useContent();
  const published = items.filter((i) => i.status === 'published');
  const [messages, setMessages] = useState<Message[]>([
    { id: 'm-0', role: 'assistant', text: "Ask me anything about AI Hub apps, tips, prompts or news. I only answer from published Learn content and I'll say so when I can't find a confident answer." },
  ]);
  const [input, setInput] = useState('');

  const ask = () => {
    const q = input.trim();
    if (!q) return;
    const match = bestMatch(q, published);
    const userMsg: Message = { id: `m-${Date.now()}-u`, role: 'user', text: q };
    const reply: Message = match
      ? { id: `m-${Date.now()}-a`, role: 'assistant', text: match.item.body ?? match.item.summary, source: match.item }
      : { id: `m-${Date.now()}-a`, role: 'assistant', text: "I don't have enough approved AI Hub content to answer that confidently. Try rephrasing, or browse Learn for related tips and prompts.", uncertain: true };
    setMessages((prev) => [...prev, userMsg, reply]);
    setInput('');
  };

  return (
    <>
      <PageHero eyebrow="Ask Me Anything" title="Ask AI Hub" description="Answers are grounded in published AI Hub Learn content only, with a source you can check. If no approved content supports an answer, I'll tell you rather than guess." />
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
                  <Link to="/learning/all" className="ask-source"><ShieldCheck size={13} />Source: {m.source.title}</Link>
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
