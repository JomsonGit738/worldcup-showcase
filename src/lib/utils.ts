export type Theme = {
  gradient: string; // CSS gradient string
  accent: string; // Tailwind text/color class (e.g., 'text-indigo-400')
  border: string; // CSS color value for border (e.g., '#4F46E5')
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
 * Returns a deterministic theme based on the provided seed string.
 * It calculates the sum of character codes, mods by 8, and selects a preset.
 */
export function getCardTheme(seed: string) {
  const sum = Array.from(seed).reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const idx = sum % 8;
  const themes: Theme[] = [
    {
      gradient: 'linear-gradient(135deg, #0f172a, #1e293b)', // slate dark
      accent: 'text-sky-400',
      border: '#334155',
      decorShape: 'circle',
    },
    {
      gradient: 'linear-gradient(135deg, #1a202c, #2d3748)', // gray
      accent: 'text-emerald-400',
      border: '#2c3e50',
      decorShape: 'triangle',
    },
    {
      gradient: 'linear-gradient(135deg, #2f855a, #276749)', // green
      accent: 'text-amber-300',
      border: '#38a169',
      decorShape: 'square',
    },
    {
      gradient: 'linear-gradient(135deg, #9b2c2c, #7b341e)', // deep red
      accent: 'text-purple-300',
      border: '#c53030',
      decorShape: 'diamond',
    },
    {
      gradient: 'linear-gradient(135deg, #4a5568, #2d3748)', // cool gray
      accent: 'text-pink-300',
      border: '#2f374b',
      decorShape: 'hexagon',
    },
    {
      gradient: 'linear-gradient(135deg, #2c5282, #2a4365)', // blue
      accent: 'text-yellow-300',
      border: '#2b6cb0',
      decorShape: 'wave',
    },
    {
      gradient: 'linear-gradient(135deg, #6b46c1, #553c9a)', // purple
      accent: 'text-green-300',
      border: '#805ad5',
      decorShape: 'cross',
    },
    {
      gradient: 'linear-gradient(135deg, #d69e2e, #b7791f)', // gold
      accent: 'text-red-300',
      border: '#d69e2e',
      decorShape: 'dots',
    },
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
