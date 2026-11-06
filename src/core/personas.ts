import type { Persona, PersonaId } from './types';

export const PERSONAS: Persona[] = [
  {
    id: 'bank-user',
    label: 'Bank User',
    tagline: 'Discover, use and learn',
    description: 'Browse the catalogue, launch apps you have access to, learn from the community and contribute tips and prompts.',
    can: { submitApps: false, manageOwnApps: false, moderateLearning: false, administerPlatform: false },
  },
  {
    id: 'learning-moderator',
    label: 'Learning Moderator',
    tagline: 'Curate and approve learning content',
    description: 'Review contributions in the queue, approve or reject with feedback, and curate featured learning.',
    can: { submitApps: false, manageOwnApps: false, moderateLearning: true, administerPlatform: false },
  },
  {
    id: 'platform-admin',
    label: 'Platform Admin',
    tagline: 'Govern the AI Hub',
    description: 'Full oversight: approve app onboarding, moderate content, and monitor platform adoption and governance.',
    can: { submitApps: true, manageOwnApps: true, moderateLearning: true, administerPlatform: true },
  },
];

export const DEFAULT_PERSONA: PersonaId = 'bank-user';
export const getPersona = (id: PersonaId) => PERSONAS.find((p) => p.id === id)!;
