"use client";

import type { AdminMediaAssetListItem } from "@/lib/admin/media-assets";

import styles from "./MediaAssetPicker.module.css";

type MediaAssetPickerProps = {
  assets: AdminMediaAssetListItem[];
  selectedId?: string;
  onSelect: (asset: AdminMediaAssetListItem) => void;
};

function getPreviewUrl(asset: AdminMediaAssetListItem) {
  return asset.thumbnailUrl ?? asset.url;
}

export function MediaAssetPicker({
  assets,
  selectedId,
  onSelect,
}: MediaAssetPickerProps) {
  if (assets.length === 0) {
    return <p className={styles.empty}>Nessun media asset disponibile.</p>;
  }

  return (
    <div className={styles.grid}>
      {assets.map((asset) => {
        const isImage = asset.type === "IMAGE";
        const label = asset.alt ?? asset.caption ?? asset.url;

        return (
          <button
            key={asset.id}
            type="button"
            className={styles.assetButton}
            data-selected={asset.id === selectedId}
            onClick={() => onSelect(asset)}
          >
            {isImage ? (
              <span
                className={styles.preview}
                style={{
                  backgroundImage: `url("${getPreviewUrl(asset)}")`,
                }}
                role="img"
                aria-label={label}
              />
            ) : (
              <span className={styles.placeholder}>{asset.type}</span>
            )}

            <strong>{label}</strong>
            <small>
              {asset.provider} · {asset.type}
            </small>
          </button>
        );
      })}
    </div>
  );
}
