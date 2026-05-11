export type Hotspot = {
  id: string;
  x: number;
  y: number;
  radius: number;

  title: string;
  shortLabel: string;
  content: string;

  badgeIcon: string;
  score: number;

  trackTitle: string;
  playerUrl?: string;
  href?: string;
};