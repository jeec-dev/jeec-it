import Entry001, {
  metadata as entry001Metadata,
} from "@/content/diario-di-jay/001-il-risveglio.mdx";
import Entry002, {
  metadata as entry002Metadata,
} from "@/content/diario-di-jay/002-la-citta-sommersa.mdx";

export type DiaryEntryMetadata = {
  slug: string;
  title: string;
  excerpt: string;
  chapter: number;
};

export type DiaryEntry = {
  metadata: DiaryEntryMetadata;
  Component: React.ComponentType;
};

export const diaryEntries: DiaryEntry[] = [
  {
    metadata: entry001Metadata,
    Component: Entry001,
  },
  {
    metadata: entry002Metadata,
    Component: Entry002,
  },
].sort((a, b) => a.metadata.chapter - b.metadata.chapter);

export function getDiaryEntryBySlug(slug: string) {
  return diaryEntries.find((entry) => entry.metadata.slug === slug);
}