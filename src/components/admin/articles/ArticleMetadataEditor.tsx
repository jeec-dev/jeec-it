"use client";

import { useState, useTransition } from "react";

import type { AdminMediaAssetListItem } from "@/lib/admin/media-assets";

import { MediaAssetPicker } from "@/components/admin/media/MediaAssetPicker";
import styles from "./ArticleMetadataEditor.module.css";

type ArticleMetadataEditorProps = {
  articleId: string;
  initialTitle: string;
  initialSubtitle: string | null;
  initialExcerpt: string | null;
  initialPublishedAt: Date | string | null;
  initialCoverAssetId: string | null;
  mediaAssets: AdminMediaAssetListItem[];
  onSave: (
    articleId: string,
    input: {
      title: string;
      subtitle: string;
      excerpt: string;
      publishedAt: string;
      coverAssetId: string;
    },
  ) => Promise<{ ok: true } | { ok: false; error: string }>;
};

function formatDateTimeLocal(value: Date | string | null) {
  if (!value) {
    return "";
  }

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const offsetMs = date.getTimezoneOffset() * 60 * 1000;
  const localDate = new Date(date.getTime() - offsetMs);

  return localDate.toISOString().slice(0, 16);
}

export function ArticleMetadataEditor({
  articleId,
  initialTitle,
  initialSubtitle,
  initialExcerpt,
  initialPublishedAt,
  initialCoverAssetId,
  mediaAssets,
  onSave,
}: ArticleMetadataEditorProps) {
  const [title, setTitle] = useState(initialTitle);
  const [subtitle, setSubtitle] = useState(initialSubtitle ?? "");
  const [excerpt, setExcerpt] = useState(initialExcerpt ?? "");
  const [publishedAt, setPublishedAt] = useState(
    formatDateTimeLocal(initialPublishedAt),
  );
  const [coverAssetId, setCoverAssetId] = useState(initialCoverAssetId ?? "");
  const [isCoverPickerOpen, setIsCoverPickerOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const selectedCover = mediaAssets.find((asset) => asset.id === coverAssetId);

  function handleSave() {
    setMessage(null);

    startTransition(async () => {
      const result = await onSave(articleId, {
        title,
        subtitle,
        excerpt,
        publishedAt,
        coverAssetId,
      });

      if (result.ok) {
        setMessage("Metadati articolo salvati.");
        return;
      }

      setMessage(result.error);
    });
  }

  return (
    <section className={styles.panel}>
      <div className={styles.header}>
        <div>
          <p>Article settings</p>
          <span>Titolo, cover e metadati editoriali dell’articolo.</span>
        </div>

        <button type="button" onClick={handleSave} disabled={isPending}>
          {isPending ? "Salvataggio..." : "Salva metadati"}
        </button>
      </div>

      {message ? <p className={styles.message}>{message}</p> : null}

      <div className={styles.fields}>
        <label>
          Title
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </label>

        <label>
          Published at
          <input
            type="datetime-local"
            value={publishedAt}
            onChange={(event) => setPublishedAt(event.target.value)}
          />
        </label>

        <label>
          Subtitle
          <input
            value={subtitle}
            onChange={(event) => setSubtitle(event.target.value)}
          />
        </label>

        <label className={styles.full}>
          Excerpt
          <textarea
            value={excerpt}
            onChange={(event) => setExcerpt(event.target.value)}
          />
        </label>
      </div>

      <div className={styles.coverPanel}>
        <div className={styles.coverHeader}>
          <div>
            <p>Cover image</p>
            <span>
              Immagine principale usata nella pagina articolo e nelle preview.
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsCoverPickerOpen((value) => !value)}
          >
            {isCoverPickerOpen ? "Chiudi picker" : "Modifica cover"}
          </button>
        </div>

        {selectedCover ? (
          <figure className={styles.coverPreview}>
            <div
              className={styles.coverFrame}
              style={{
                backgroundImage: `url("${selectedCover.thumbnailUrl ?? selectedCover.url}")`,
              }}
              role="img"
              aria-label={selectedCover.alt ?? "Cover articolo"}
            />
            <figcaption>
              {selectedCover.alt ?? selectedCover.caption ?? selectedCover.url}
            </figcaption>
          </figure>
        ) : (
          <p className={styles.emptyCover}>Nessuna cover selezionata.</p>
        )}

        {isCoverPickerOpen ? (
          <div className={styles.coverPicker}>
            <MediaAssetPicker
              assets={mediaAssets}
              selectedId={coverAssetId}
              onSelect={(asset) => {
                setCoverAssetId(asset.id);
                setIsCoverPickerOpen(false);
              }}
            />

            {coverAssetId ? (
              <button
                type="button"
                className={styles.clearCoverButton}
                onClick={() => setCoverAssetId("")}
              >
                Rimuovi cover
              </button>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}
