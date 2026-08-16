export type SurfaceTone = 'blue' | 'green' | 'purple';

/** Icon container colors shared by dashboard cards */
export const TONE_SURFACES: Record<SurfaceTone, string> = {
  blue: 'bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400',
  green: 'bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-400',
  purple: 'bg-purple-100 text-purple-600 dark:bg-purple-950 dark:text-purple-400',
};
