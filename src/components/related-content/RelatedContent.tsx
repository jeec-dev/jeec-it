import {
  getRelatedContentForEntity,
  getRelatedContentForReleaseSlug,
  getRelatedContentForTrackSlug,
} from "@/lib/related-content/related-content";
import { RelatedContentView } from "./RelatedContentView";

type RelatedContentProps =
  | {
      ownerEntityKey: string;
      releaseSlug?: never;
      albumSlug?: never;
      trackSlug?: never;
    }
  | {
      ownerEntityKey?: never;
      releaseSlug: string;
      albumSlug?: never;
      trackSlug?: never;
    }
  | {
      ownerEntityKey?: never;
      releaseSlug?: never;
      albumSlug: string;
      trackSlug: string;
    };

export async function RelatedContent(props: RelatedContentProps) {
  const block =
    typeof props.albumSlug === "string" && typeof props.trackSlug === "string"
      ? await getRelatedContentForTrackSlug(props.albumSlug, props.trackSlug)
      : typeof props.releaseSlug === "string"
        ? await getRelatedContentForReleaseSlug(props.releaseSlug)
        : typeof props.ownerEntityKey === "string"
          ? await getRelatedContentForEntity(props.ownerEntityKey)
          : null;

  if (!block) {
    return null;
  }

  return <RelatedContentView block={block} />;
}
