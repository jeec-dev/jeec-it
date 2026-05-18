import type { MediaAssetProvider, MediaAssetType } from "@/generated/prisma";

import { db } from "@/lib/db";

export type AdminMediaAssetListItem = {
  id: string;
  type: MediaAssetType;
  provider: MediaAssetProvider;
  url: string;
  thumbnailUrl: string | null;
  alt: string | null;
  caption: string | null;
  width: number | null;
  height: number | null;
};

export async function getAdminMediaAssets(): Promise<AdminMediaAssetListItem[]> {
  return db.mediaAsset.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      type: true,
      provider: true,
      url: true,
      thumbnailUrl: true,
      alt: true,
      caption: true,
      width: true,
      height: true,
    },
  });
}
