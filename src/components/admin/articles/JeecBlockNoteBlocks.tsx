"use client";

import {
  createContext,
  type ReactNode,
  type Ref,
  useContext,
  useState,
} from "react";

import { MediaAssetPicker } from "@/components/admin/media/MediaAssetPicker";
import type { AdminMediaAssetListItem } from "@/lib/admin/media-assets";
import { BlockNoteSchema, defaultBlockSpecs } from "@blocknote/core";
import { createReactBlockSpec } from "@blocknote/react";

import styles from "./JeecBlockNoteBlocks.module.css";

function cleanString(value: unknown) {
  return typeof value === "string" ? value : "";
}

function toImagePosition(value: unknown): "left" | "right" {
  return value === "right" ? "right" : "left";
}

const JeecMediaAssetsContext = createContext<AdminMediaAssetListItem[]>([]);

export function JeecMediaAssetsProvider({
  mediaAssets,
  children,
}: {
  mediaAssets: AdminMediaAssetListItem[];
  children: ReactNode;
}) {
  return (
    <JeecMediaAssetsContext.Provider value={mediaAssets}>
      {children}
    </JeecMediaAssetsContext.Provider>
  );
}

function useJeecMediaAssets() {
  return useContext(JeecMediaAssetsContext);
}

function getAssetImageProps(asset: AdminMediaAssetListItem) {
  return {
    mediaAssetId: asset.id,
    url: asset.url,
    alt: asset.alt ?? "",
    caption: asset.caption ?? "",
  };
}

type JeecBlockEditorBridge = {
  updateBlock: (block: unknown, update: unknown) => void;
};

type JeecImageBlockViewProps = {
  block: {
    props: {
      mediaAssetId?: unknown;
      url?: unknown;
      alt?: unknown;
      caption?: unknown;
    };
  };
  editor: JeecBlockEditorBridge;
};

type JeecImageTextBlockViewProps = {
  block: {
    props: {
      mediaAssetId?: unknown;
      url?: unknown;
      alt?: unknown;
      caption?: unknown;
      title?: unknown;
      imagePosition?: unknown;
    };
  };
  editor: JeecBlockEditorBridge;
  contentRef: Ref<HTMLDivElement>;
};

function toTone(
  value: unknown,
): "note" | "warning" | "lore" | "signal" | undefined {
  if (typeof value !== "string") return undefined;

  const result = ["note", "warning", "lore", "signal"].find(
    (t) => t === value.trim().toLowerCase(),
  );

  if (!result) return undefined;

  switch (result) {
    case "note":
      return "note";
    case "warning":
      return "warning";
    case "lore":
      return "lore";
    case "signal":
      return "signal";
    default:
      return undefined;
  }
}

function JeecImageBlockView({ block, editor }: JeecImageBlockViewProps) {
  const url = cleanString(block.props.url);
  const alt = cleanString(block.props.alt);
  const caption = cleanString(block.props.caption);
  const mediaAssetId = cleanString(block.props.mediaAssetId);
  const mediaAssets = useJeecMediaAssets();

  const [isEditingMedia, setIsEditingMedia] = useState(() => !url);

  function updateImageProps(nextProps: {
    mediaAssetId?: string;
    url?: string;
    alt?: string;
    caption?: string;
  }) {
    editor.updateBlock(block, {
      type: "jeecImage",
      props: {
        mediaAssetId: nextProps.mediaAssetId ?? mediaAssetId,
        url: nextProps.url ?? url,
        alt: nextProps.alt ?? alt,
        caption: nextProps.caption ?? caption,
      },
    });
  }

  if (!isEditingMedia && url) {
    return (
      <section className={styles.card} contentEditable={false}>
        <div className={styles.cardHeader}>
          <strong>JeeC Image</strong>
          <span>IMAGE · blocco canonico</span>
        </div>

        <figure className={styles.canvasImagePreview}>
          <div
            className={styles.canvasImageFrame}
            style={{
              backgroundImage: `url("${url}")`,
            }}
            role="img"
            aria-label={alt || "Anteprima immagine"}
          />

          <button
            type="button"
            className={styles.editImageButton}
            onClick={() => setIsEditingMedia(true)}
          >
            Modifica immagine
          </button>

          {caption ? <figcaption>{caption}</figcaption> : null}
        </figure>
      </section>
    );
  }

  return (
    <section className={styles.card} contentEditable={false}>
      <div className={styles.cardHeader}>
        <strong>JeeC Image</strong>
        <span>IMAGE · blocco canonico</span>
      </div>

      {url ? (
        <div
          className={styles.imagePreview}
          style={{
            backgroundImage: `url("${url}")`,
          }}
          role="img"
          aria-label={alt || "Anteprima immagine"}
        />
      ) : (
        <div className={styles.emptyPreview}>Nessuna immagine selezionata</div>
      )}

      <div className={styles.fields}>
        <label>
          Image URL
          <input
            value={url}
            placeholder="/images/covers/example.jpg"
            onChange={(event) =>
              updateImageProps({
                url: event.target.value,
              })
            }
          />
        </label>

        <label>
          Alt
          <input
            value={alt}
            placeholder="Descrizione accessibile"
            onChange={(event) =>
              updateImageProps({
                alt: event.target.value,
              })
            }
          />
        </label>

        <label>
          Caption
          <input
            value={caption}
            placeholder="Didascalia opzionale"
            onChange={(event) =>
              updateImageProps({
                caption: event.target.value,
              })
            }
          />
        </label>
      </div>

      {mediaAssets.length > 0 ? (
        <div className={styles.mediaPickerPanel}>
          <p>Media picker</p>
          <MediaAssetPicker
            assets={mediaAssets}
            selectedId={mediaAssetId}
            onSelect={(asset) => updateImageProps(getAssetImageProps(asset))}
          />
        </div>
      ) : null}

      <div className={styles.mediaEditActions}>
        <button
          type="button"
          className={styles.saveMediaButton}
          disabled={!url}
          onClick={() => setIsEditingMedia(false)}
        >
          Salva immagine
        </button>
      </div>
    </section>
  );
}

export const JeecImageBlock = createReactBlockSpec(
  {
    type: "jeecImage",
    propSchema: {
      mediaAssetId: {
        default: "",
      },
      url: {
        default: "",
      },
      alt: {
        default: "",
      },
      caption: {
        default: "",
      },
    },
    content: "none",
  },
  {
    render: ({ block, editor }) => (
      <JeecImageBlockView
        block={block as JeecImageBlockViewProps["block"]}
        editor={editor as unknown as JeecBlockEditorBridge}
      />
    ),
  },
);

function JeecImageTextBlockView({
  block,
  editor,
  contentRef,
}: JeecImageTextBlockViewProps) {
  const url = cleanString(block.props.url);
  const alt = cleanString(block.props.alt);
  const caption = cleanString(block.props.caption);
  const title = cleanString(block.props.title);
  const imagePosition = toImagePosition(block.props.imagePosition);
  const mediaAssetId = cleanString(block.props.mediaAssetId);
  const mediaAssets = useJeecMediaAssets();

  const [isEditingMedia, setIsEditingMedia] = useState(() => !url);

  function updateImageTextProps(nextProps: {
    mediaAssetId?: string;
    url?: string;
    alt?: string;
    caption?: string;
    title?: string;
    imagePosition?: "left" | "right";
  }) {
    editor.updateBlock(block, {
      type: "jeecImageText",
      props: {
        mediaAssetId: nextProps.mediaAssetId ?? mediaAssetId,
        url: nextProps.url ?? url,
        alt: nextProps.alt ?? alt,
        caption: nextProps.caption ?? caption,
        title: nextProps.title ?? title,
        imagePosition: nextProps.imagePosition ?? imagePosition,
      },
    });
  }

  return (
    <section className={styles.card}>
      <div className={styles.cardHeader} contentEditable={false}>
        <strong>JeeC Image/Text</strong>
        <span>IMAGE_TEXT · blocco canonico</span>
      </div>

      <div className={styles.imageTextGrid} data-image-position={imagePosition}>
        <div contentEditable={false}>
          {!isEditingMedia && url ? (
            <figure className={styles.canvasImagePreview}>
              <div
                className={styles.canvasImageFrame}
                style={{
                  backgroundImage: `url("${url}")`,
                }}
                role="img"
                aria-label={alt || "Anteprima immagine"}
              />

              <button
                type="button"
                className={styles.editImageButton}
                onClick={() => setIsEditingMedia(true)}
              >
                Modifica immagine
              </button>

              {caption ? <figcaption>{caption}</figcaption> : null}
            </figure>
          ) : url ? (
            <div
              className={styles.imagePreview}
              style={{
                backgroundImage: `url("${url}")`,
              }}
              role="img"
              aria-label={alt || "Anteprima immagine"}
            />
          ) : (
            <div className={styles.emptyPreview}>
              Nessuna immagine selezionata
            </div>
          )}
        </div>

        <div className={styles.imageTextCopy}>
          <input
            className={styles.titleInput}
            contentEditable={false}
            value={title}
            placeholder="Titolo blocco"
            onChange={(event) =>
              updateImageTextProps({
                title: event.target.value,
              })
            }
          />

          <div
            ref={contentRef}
            className={styles.inlineContent}
            data-placeholder="Testo del blocco cinematico..."
          />
        </div>
      </div>

      {isEditingMedia || !url ? (
        <>
          <div className={styles.fields} contentEditable={false}>
            <label>
              Image position
              <select
                value={imagePosition}
                onChange={(event) =>
                  updateImageTextProps({
                    imagePosition: toImagePosition(event.target.value),
                  })
                }
              >
                <option value="left">left</option>
                <option value="right">right</option>
              </select>
            </label>

            <label>
              Image URL
              <input
                value={url}
                placeholder="/images/covers/example.jpg"
                onChange={(event) =>
                  updateImageTextProps({
                    url: event.target.value,
                  })
                }
              />
            </label>

            <label>
              Alt
              <input
                value={alt}
                onChange={(event) =>
                  updateImageTextProps({
                    alt: event.target.value,
                  })
                }
              />
            </label>

            <label>
              Caption
              <input
                value={caption}
                onChange={(event) =>
                  updateImageTextProps({
                    caption: event.target.value,
                  })
                }
              />
            </label>
          </div>

          {mediaAssets.length > 0 ? (
            <div className={styles.mediaPickerPanel} contentEditable={false}>
              <p>Media picker</p>
              <MediaAssetPicker
                assets={mediaAssets}
                selectedId={mediaAssetId}
                onSelect={(asset) =>
                  updateImageTextProps(getAssetImageProps(asset))
                }
              />
            </div>
          ) : null}

          <div className={styles.mediaEditActions} contentEditable={false}>
            <button
              type="button"
              className={styles.saveMediaButton}
              disabled={!url}
              onClick={() => setIsEditingMedia(false)}
            >
              Salva immagine
            </button>
          </div>
        </>
      ) : null}
    </section>
  );
}

export const JeecImageTextBlock = createReactBlockSpec(
  {
    type: "jeecImageText",
    propSchema: {
      mediaAssetId: {
        default: "",
      },
      url: {
        default: "",
      },
      alt: {
        default: "",
      },
      caption: {
        default: "",
      },
      title: {
        default: "",
      },
      imagePosition: {
        default: "left",
        values: ["left", "right"],
      },
    },
    content: "inline",
  },
  {
    render: ({ block, editor, contentRef }) => (
      <JeecImageTextBlockView
        block={block as JeecImageTextBlockViewProps["block"]}
        editor={editor as unknown as JeecBlockEditorBridge}
        contentRef={contentRef as Ref<HTMLDivElement>}
      />
    ),
  },
);

export const JeecCalloutBlock = createReactBlockSpec(
  {
    type: "jeecCallout",
    propSchema: {
      tone: {
        default: "note",
        values: ["note", "warning", "lore", "signal"],
      },
      title: {
        default: "",
      },
    },
    content: "inline",
  },
  {
    render: ({ block, editor, contentRef }) => {
      const tone = toTone(block.props.tone) || "note";
      const title = cleanString(block.props.title);

      return (
        <section className={styles.callout} data-tone={tone}>
          <div className={styles.cardHeader} contentEditable={false}>
            <strong>JeeC Callout</strong>
            <span>CALLOUT · {tone}</span>
          </div>

          <div className={styles.fields} contentEditable={false}>
            <label>
              Tone
              <select
                value={tone}
                onChange={(event) =>
                  editor.updateBlock(block, {
                    type: "jeecCallout",
                    props: {
                      tone: toTone(event.target.value),
                      title,
                    },
                  })
                }
              >
                <option value="note">note</option>
                <option value="warning">warning</option>
                <option value="lore">lore</option>
                <option value="signal">signal</option>
              </select>
            </label>

            <label>
              Title
              <input
                value={title}
                placeholder="Titolo opzionale"
                onChange={(event) =>
                  editor.updateBlock(block, {
                    type: "jeecCallout",
                    props: {
                      tone,
                      title: event.target.value,
                    },
                  })
                }
              />
            </label>
          </div>

          <div
            ref={contentRef}
            className={styles.inlineContent}
            data-placeholder="Testo callout..."
          />
        </section>
      );
    },
  },
);

export const JeecDividerBlock = createReactBlockSpec(
  {
    type: "jeecDivider",
    propSchema: {
      label: {
        default: "",
      },
    },
    content: "none",
  },
  {
    render: ({ block, editor }) => {
      const label = cleanString(block.props.label);

      return (
        <section className={styles.dividerBlock} contentEditable={false}>
          <div className={styles.dividerLine} />
          <input
            value={label}
            placeholder="Divider label opzionale"
            onChange={(event) =>
              editor.updateBlock(block, {
                type: "jeecDivider",
                props: {
                  label: event.target.value,
                },
              })
            }
          />
          <div className={styles.dividerLine} />
        </section>
      );
    },
  },
);

export const JeecCtaBlock = createReactBlockSpec(
  {
    type: "jeecCta",
    propSchema: {
      label: {
        default: "Apri",
      },
      href: {
        default: "/",
      },
      description: {
        default: "",
      },
    },
    content: "none",
  },
  {
    render: ({ block, editor }) => {
      const label = cleanString(block.props.label) || "Apri";
      const href = cleanString(block.props.href) || "/";
      const description = cleanString(block.props.description);

      return (
        <section className={styles.card} contentEditable={false}>
          <div className={styles.cardHeader}>
            <strong>JeeC CTA</strong>
            <span>CTA · blocco canonico</span>
          </div>

          <div className={styles.ctaPreview}>
            <strong>{label}</strong>
            <span>{href}</span>
            {description ? <p>{description}</p> : null}
          </div>

          <div className={styles.fields}>
            <label>
              Label
              <input
                value={label}
                onChange={(event) =>
                  editor.updateBlock(block, {
                    type: "jeecCta",
                    props: {
                      label: event.target.value,
                      href,
                      description,
                    },
                  })
                }
              />
            </label>

            <label>
              Href
              <input
                value={href}
                onChange={(event) =>
                  editor.updateBlock(block, {
                    type: "jeecCta",
                    props: {
                      label,
                      href: event.target.value,
                      description,
                    },
                  })
                }
              />
            </label>

            <label>
              Description
              <textarea
                value={description}
                onChange={(event) =>
                  editor.updateBlock(block, {
                    type: "jeecCta",
                    props: {
                      label,
                      href,
                      description: event.target.value,
                    },
                  })
                }
              />
            </label>
          </div>
        </section>
      );
    },
  },
);

export const JeecRelatedContentBlock = createReactBlockSpec(
  {
    type: "jeecRelatedContent",
    propSchema: {
      ownerEntityKey: {
        default: "",
      },
      title: {
        default: "",
      },
    },
    content: "none",
  },
  {
    render: ({ block, editor }) => {
      const ownerEntityKey = cleanString(block.props.ownerEntityKey);
      const title = cleanString(block.props.title);

      return (
        <section className={styles.card} contentEditable={false}>
          <div className={styles.cardHeader}>
            <strong>JeeC Related Content</strong>
            <span>RELATED_CONTENT · placeholder</span>
          </div>

          <div className={styles.fields}>
            <label>
              Owner entity key
              <input
                value={ownerEntityKey}
                placeholder="music:release:..."
                onChange={(event) =>
                  editor.updateBlock(block, {
                    type: "jeecRelatedContent",
                    props: {
                      ownerEntityKey: event.target.value,
                      title,
                    },
                  })
                }
              />
            </label>

            <label>
              Title
              <input
                value={title}
                placeholder="Titolo sezione"
                onChange={(event) =>
                  editor.updateBlock(block, {
                    type: "jeecRelatedContent",
                    props: {
                      ownerEntityKey,
                      title: event.target.value,
                    },
                  })
                }
              />
            </label>
          </div>
        </section>
      );
    },
  },
);

export const jeecBlockNoteSchema = BlockNoteSchema.create({
  blockSpecs: {
    ...defaultBlockSpecs,
    jeecImage: JeecImageBlock(),
    jeecImageText: JeecImageTextBlock(),
    jeecCallout: JeecCalloutBlock(),
    jeecDivider: JeecDividerBlock(),
    jeecCta: JeecCtaBlock(),
    jeecRelatedContent: JeecRelatedContentBlock(),
  },
});
