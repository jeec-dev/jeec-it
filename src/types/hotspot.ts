export type HotspotRelatedTrack = {
  title: string;
  href: string;
};

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
  relatedTracks?: HotspotRelatedTrack[];
  closeUpX?: number;
  closeUpY?: number;
  closeUpZoom?: number;
};
