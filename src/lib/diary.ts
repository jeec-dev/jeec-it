import fs from "node:fs/promises";
import path from "node:path";
import { cache } from "react";

const diaryDirectory = path.join(
  process.cwd(),
  "src",
  "content",
  "diario-di-jay",
);

export type DiaryEntryMetadata = {
  slug: string;
  title: string;
  chapter: string;
  date: string;
  displayDate: string;
  narrativeDate?: string;
  excerpt: string;
  cover?: string;
  linkedTrackSlug?: string;
  linkedTrackTitle?: string;
};

export type DiaryEntry = {
  metadata: DiaryEntryMetadata;
  source: string;
};

function parseFrontmatter(source: string, fileName: string) {
  const normalizedSource = source.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n");

  const frontmatterMatch = normalizedSource.match(/^---\n([\s\S]*?)\n---\n?/);

  if (!frontmatterMatch) {
    throw new Error(`Missing frontmatter in diary MDX file: ${fileName}`);
  }

  const frontmatter = frontmatterMatch[1];
  const content = normalizedSource.slice(frontmatterMatch[0].length);

  const metadata = frontmatter
    .split("\n")
    .filter(Boolean)
    .reduce<Record<string, string>>((currentMetadata, line) => {
      const separatorIndex = line.indexOf(":");

      if (separatorIndex === -1) {
        return currentMetadata;
      }

      const key = line.slice(0, separatorIndex).trim();
      const rawValue = line.slice(separatorIndex + 1).trim();

      currentMetadata[key] = rawValue
        .replace(/^"/, "")
        .replace(/"$/, "")
        .replace(/^'/, "")
        .replace(/'$/, "");

      return currentMetadata;
    }, {});

  return {
    metadata: metadata as DiaryEntryMetadata,
    content,
  };
}

async function getDiaryFileNames() {
  const entries = await fs.readdir(diaryDirectory, {
    withFileTypes: true,
  });

  return entries
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((fileName) => fileName.endsWith(".mdx"))
    .sort();
}

export const getDiaryEntries = cache(async () => {
  const fileNames = await getDiaryFileNames();

  const entries = await Promise.all(
    fileNames.map(async (fileName) => {
      const filePath = path.join(diaryDirectory, fileName);
      const source = await fs.readFile(filePath, "utf8");
      const { metadata, content } = parseFrontmatter(source, fileName);

      return {
        metadata,
        source: content,
      };
    }),
  );

  return entries.sort(
    (firstEntry, secondEntry) =>
      new Date(firstEntry.metadata.date).getTime() -
      new Date(secondEntry.metadata.date).getTime(),
  );
});

export async function getDiaryEntry(slug: string) {
  const entries = await getDiaryEntries();

  return entries.find((entry) => entry.metadata.slug === slug);
}

export async function getAdjacentDiaryEntries(slug: string) {
  const entries = await getDiaryEntries();
  const currentIndex = entries.findIndex(
    (entry) => entry.metadata.slug === slug,
  );

  return {
    previousEntry: currentIndex > 0 ? entries[currentIndex - 1] : undefined,
    nextEntry:
      currentIndex >= 0 && currentIndex < entries.length - 1
        ? entries[currentIndex + 1]
        : undefined,
  };
}
