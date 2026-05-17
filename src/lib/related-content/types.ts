import type {
  ContentEntityType,
  RelatedContentLayout,
  RelatedContentSourceMode,
} from "@/generated/prisma";

export type RelatedTargetEntity = {
  id: string;
  key: string;
  type: ContentEntityType;
  kindKey: string;
  title: string;
  description: string | null;
  href: string | null;
  imageUrl: string | null;
  publishedAt: Date | null;
};

export type RelatedCandidateSource = "manual" | "auto";

export type RelatedCandidate = {
  source: RelatedCandidateSource;
  sectionId: string;
  targetEntityId: string;
  targetEntity: RelatedTargetEntity;
  isPinned: boolean;
  isFeatured: boolean;
  priority: number;
  overrides?: {
    title?: string | null;
    description?: string | null;
    eyebrow?: string | null;
    ctaLabel?: string | null;
    href?: string | null;
    imageUrl?: string | null;
  };
};

export type RelatedContentItemView = {
  id: string;
  source: "manual" | "auto";
  type: ContentEntityType;
  kindKey: string;
  title: string;
  description: string | null;
  eyebrow?: string | null;
  ctaLabel?: string | null;
  href: string | null;
  imageUrl?: string;
  isPinned: boolean;
  isFeatured: boolean;
  publishedAt: Date | null;
};

export type RelatedContentSectionView = {
  id: string;
  key: string;
  title: string;
  description: string | null;
  layout: RelatedContentLayout;
  items: RelatedContentItemView[];
};

export type RelatedContentBlockView = {
  id: string;
  ownerEntityKey: string;
  title: string | null;
  description: string | null;
  sourceMode: RelatedContentSourceMode;
  sections: RelatedContentSectionView[];
};
