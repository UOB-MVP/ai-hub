import { Sparkles, Landmark, Shield, Headset, Code2, BarChart3, FileText, Mic, Search, Box, Users, Building2, HandCoins, MessageSquareText, Newspaper, Presentation, type LucideIcon } from 'lucide-react';

const ICONS: Record<string, LucideIcon> = {
  sparkles: Sparkles, landmark: Landmark, shield: Shield, headset: Headset, code: Code2,
  chart: BarChart3, users: Users, branch: Building2, recovery: HandCoins, prompt: MessageSquareText, news: Newspaper, showcase: Presentation, file: FileText, mic: Mic, search: Search,
};

export function AppIcon({ name, hue, size = 48 }: { name: string; hue: number; size?: number }) {
  const Icon = ICONS[name] ?? Box;
  return (
    <span style={{ width: size, height: size, borderRadius: size * 0.28, display: 'grid', placeItems: 'center', flexShrink: 0,
      background: `linear-gradient(135deg, hsl(${hue} 70% 94%), hsl(${hue} 80% 86%))`, color: `hsl(${hue} 70% 32%)` }}>
      <Icon size={size * 0.5} />
    </span>
  );
}
