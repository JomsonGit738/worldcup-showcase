export type Theme = {
  gradient: string;
  gradientFrom: string;
  gradientTo: string;
  accent: string;
  border: string;
  pattern: string;
  patternSize: string;
  decorShape: 'circle' | 'triangle' | 'square' | 'diamond' | 'hexagon' | 'wave' | 'cross' | 'dots';
};

/**
 * Fisher–Yates shuffle that returns a new array without mutating the original.
 */
export function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Generates a deterministic card ID from a seed string.
 */
export function generateCardId(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i);
    hash |= 0;
  }

  const value = Math.abs(hash) % 10000;
  return `CM-${value.toString().padStart(4, '0')}`;
}

/**
 * Returns a deterministic theme based on the provided seed string.
 * It calculates the sum of character codes, mods by 8, and selects a preset.
 */
export function getCardTheme(seed: string): Theme {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i);
    hash |= 0;
  }
  const idx = Math.abs(hash) % 8;
  const themes: Theme[] = [
    { gradient: 'from-violet-900/40 to-violet-800/10', gradientFrom: '#2d1b69', gradientTo: '#111827', accent: '#a78bfa', border: '#4c1d95', pattern: 'radial-gradient(circle, currentColor 1px, transparent 1px)', patternSize: '4px 4px', decorShape: 'circle' },
    { gradient: 'from-amber-900/40 to-amber-800/10',  gradientFrom: '#451a03', gradientTo: '#111827', accent: '#fcd34d', border: '#78350f', pattern: 'repeating-linear-gradient(45deg, currentColor 0, currentColor 1px, transparent 0, transparent 50%)', patternSize: '6px 6px', decorShape: 'triangle' },
    { gradient: 'from-cyan-900/40 to-cyan-800/10',    gradientFrom: '#083344', gradientTo: '#111827', accent: '#67e8f9', border: '#164e63', pattern: 'repeating-linear-gradient(0deg, currentColor 0, currentColor 1px, transparent 0, transparent 8px)', patternSize: '8px 8px', decorShape: 'square' },
    { gradient: 'from-rose-900/40 to-rose-800/10',    gradientFrom: '#4c0519', gradientTo: '#111827', accent: '#fb7185', border: '#881337', pattern: 'radial-gradient(circle, currentColor 1.5px, transparent 1px)', patternSize: '8px 8px', decorShape: 'diamond' },
    { gradient: 'from-emerald-900/40 to-emerald-800/10', gradientFrom: '#022c22', gradientTo: '#111827', accent: '#6ee7b7', border: '#064e3b', pattern: 'repeating-linear-gradient(90deg, currentColor 0, currentColor 1px, transparent 0, transparent 8px)', patternSize: '8px 8px', decorShape: 'hexagon' },
    { gradient: 'from-orange-900/40 to-orange-800/10', gradientFrom: '#431407', gradientTo: '#111827', accent: '#fdba74', border: '#7c2d12', pattern: 'repeating-linear-gradient(-45deg, currentColor 0, currentColor 1px, transparent 0, transparent 6px)', patternSize: '6px 6px', decorShape: 'wave' },
    { gradient: 'from-blue-900/40 to-blue-800/10',    gradientFrom: '#0c1e3d', gradientTo: '#111827', accent: '#93c5fd', border: '#1e3a5f', pattern: 'radial-gradient(circle, currentColor 1px, transparent 1px)', patternSize: '6px 6px', decorShape: 'cross' },
    { gradient: 'from-pink-900/40 to-pink-800/10',    gradientFrom: '#500724', gradientTo: '#111827', accent: '#f9a8d4', border: '#831843', pattern: 'repeating-linear-gradient(45deg, currentColor 0, currentColor 1px, transparent 0, transparent 8px)', patternSize: '8px 8px', decorShape: 'dots' },
  ];
  return themes[idx];
}

/**
 * Extracts the hostname from a URL string. Returns the raw input on error.
 */
export function getDomain(url: string): string {
  try {
    const { hostname } = new URL(url);
    return hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}
