import type { RelatedCandidate } from "./types";

export function compareRelatedCandidates(
  a: RelatedCandidate,
  b: RelatedCandidate,
) {
  if (a.isPinned !== b.isPinned) {
    return a.isPinned ? -1 : 1;
  }

  if (a.isFeatured !== b.isFeatured) {
    return a.isFeatured ? -1 : 1;
  }

  if (a.priority !== b.priority) {
    return b.priority - a.priority;
  }

  const aPublishedAt = a.targetEntity.publishedAt?.getTime() ?? 0;
  const bPublishedAt = b.targetEntity.publishedAt?.getTime() ?? 0;

  if (aPublishedAt !== bPublishedAt) {
    return bPublishedAt - aPublishedAt;
  }

  return a.targetEntity.title.localeCompare(b.targetEntity.title);
}

export function sortAndDedupeRelatedCandidates(
  candidates: RelatedCandidate[],
  maxItems?: number | null,
) {
  const sorted = [...candidates].sort(compareRelatedCandidates);
  const seen = new Set<string>();
  const deduped: RelatedCandidate[] = [];

  for (const candidate of sorted) {
    if (seen.has(candidate.targetEntityId)) {
      continue;
    }

    seen.add(candidate.targetEntityId);
    deduped.push(candidate);

    if (maxItems && deduped.length >= maxItems) {
      break;
    }
  }

  return deduped;
}
