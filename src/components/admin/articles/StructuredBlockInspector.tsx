"use client";

import {
  type ArticleEditorBlockInput,
  normalizeArticleEditorBlocks,
} from "@/lib/articles/editor-contract";

import styles from "./StructuredBlockInspector.module.css";

type StructuredBlockInspectorProps = {
  blocks: ArticleEditorBlockInput[];
  onChange: (blocks: ArticleEditorBlockInput[]) => void;
};

type CalloutTone = "note" | "warning" | "lore" | "signal";
type ImagePosition = "left" | "right";
type VideoProvider = "YOUTUBE" | "VIMEO" | "EXTERNAL";

function normalizeAndCommit(
  blocks: ArticleEditorBlockInput[],
  onChange: (blocks: ArticleEditorBlockInput[]) => void,
) {
  onChange(normalizeArticleEditorBlocks(blocks));
}

function optionalText(value: string) {
  const trimmed = value.trim();

  return trimmed.length > 0 ? trimmed : undefined;
}

export function StructuredBlockInspector({
  blocks,
  onChange,
}: StructuredBlockInspectorProps) {
  function replaceBlock(index: number, nextBlock: ArticleEditorBlockInput) {
    normalizeAndCommit(
      blocks.map((block, blockIndex) =>
        blockIndex === index ? nextBlock : block,
      ),
      onChange,
    );
  }

  function removeBlock(index: number) {
    normalizeAndCommit(
      blocks.filter((_, blockIndex) => blockIndex !== index),
      onChange,
    );
  }

  function appendBlock(block: ArticleEditorBlockInput) {
    normalizeAndCommit([...blocks, block], onChange);
  }

  function updateIsPublic(index: number, isPublic: boolean) {
    const item = blocks[index];

    if (!item) {
      return;
    }

    replaceBlock(index, {
      ...item,
      isPublic,
    });
  }

  function updateCallout(
    index: number,
    patch: {
      tone?: CalloutTone;
      title?: string;
      text?: string;
    },
  ) {
    const item = blocks[index];

    if (!item || item.block.type !== "CALLOUT") {
      return;
    }

    replaceBlock(index, {
      ...item,
      block: {
        type: "CALLOUT",
        layout: item.block.layout,
        content: {
          tone: patch.tone ?? item.block.content.tone,
          title: patch.title ?? item.block.content.title,
          text: patch.text ?? item.block.content.text,
        },
      },
    });
  }

  function updateDivider(
    index: number,
    patch: {
      label?: string;
    },
  ) {
    const item = blocks[index];

    if (!item || item.block.type !== "DIVIDER") {
      return;
    }

    replaceBlock(index, {
      ...item,
      block: {
        type: "DIVIDER",
        layout: item.block.layout,
        content: {
          label: patch.label ?? item.block.content.label,
        },
      },
    });
  }

  function hasPreviewableImageUrl(value: string | undefined) {
    return Boolean(value && value.trim().length > 0);
  }

  function updateImage(
    index: number,
    patch: {
      url?: string;
      alt?: string;
      caption?: string;
    },
  ) {
    const item = blocks[index];

    if (!item || item.block.type !== "IMAGE") {
      return;
    }

    const url = patch.url ?? item.block.content.url;
    const alt = patch.alt ?? item.block.content.alt;
    const caption = patch.caption ?? item.block.content.caption;

    replaceBlock(index, {
      ...item,
      block: {
        type: "IMAGE",
        layout: item.block.layout,
        content: {
          ...(optionalText(url ?? "") ? { url: optionalText(url ?? "") } : {}),
          alt,
          caption,
          mediaAssetId: item.block.content.mediaAssetId,
        },
      },
    });
  }

  function updateImageText(
    index: number,
    patch: {
      url?: string;
      alt?: string;
      caption?: string;
      title?: string;
      text?: string;
      imagePosition?: ImagePosition;
    },
  ) {
    const item = blocks[index];

    if (!item || item.block.type !== "IMAGE_TEXT") {
      return;
    }

    const url = patch.url ?? item.block.content.url;
    const alt = patch.alt ?? item.block.content.alt;
    const caption = patch.caption ?? item.block.content.caption;

    replaceBlock(index, {
      ...item,
      block: {
        type: "IMAGE_TEXT",
        layout: item.block.layout,
        content: {
          ...(optionalText(url ?? "") ? { url: optionalText(url ?? "") } : {}),
          alt,
          caption,
          mediaAssetId: item.block.content.mediaAssetId,
          title: patch.title ?? item.block.content.title,
          text: patch.text ?? item.block.content.text,
          imagePosition:
            patch.imagePosition ?? item.block.content.imagePosition,
        },
      },
    });
  }

  function updateVideo(
    index: number,
    patch: {
      provider?: VideoProvider;
      url?: string;
      title?: string;
      caption?: string;
    },
  ) {
    const item = blocks[index];

    if (!item || item.block.type !== "VIDEO") {
      return;
    }

    replaceBlock(index, {
      ...item,
      block: {
        type: "VIDEO",
        layout: item.block.layout,
        content: {
          provider: patch.provider ?? item.block.content.provider,
          url: patch.url ?? item.block.content.url,
          title: patch.title ?? item.block.content.title,
          caption: patch.caption ?? item.block.content.caption,
        },
      },
    });
  }

  function updateCta(
    index: number,
    patch: {
      label?: string;
      href?: string;
      description?: string;
    },
  ) {
    const item = blocks[index];

    if (!item || item.block.type !== "CTA") {
      return;
    }

    replaceBlock(index, {
      ...item,
      block: {
        type: "CTA",
        layout: item.block.layout,
        content: {
          label: patch.label ?? item.block.content.label,
          href: patch.href ?? item.block.content.href,
          description: patch.description ?? item.block.content.description,
        },
      },
    });
  }

  function updateRelatedContent(
    index: number,
    patch: {
      ownerEntityKey?: string;
      title?: string;
    },
  ) {
    const item = blocks[index];

    if (!item || item.block.type !== "RELATED_CONTENT") {
      return;
    }

    replaceBlock(index, {
      ...item,
      block: {
        type: "RELATED_CONTENT",
        layout: item.block.layout,
        content: {
          ownerEntityKey:
            patch.ownerEntityKey ?? item.block.content.ownerEntityKey,
          title: patch.title ?? item.block.content.title,
        },
      },
    });
  }

  return (
    <aside className={styles.panel}>
      <div className={styles.header}>
        <p>Structured blocks</p>
        <span>{blocks.length} blocchi speciali</span>
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          onClick={() =>
            appendBlock({
              order: blocks.length,
              isPublic: true,
              block: {
                type: "CALLOUT",
                layout: "WIDE",
                content: {
                  tone: "note",
                  title: "Nota",
                  text: "",
                },
              },
            })
          }
        >
          + Callout
        </button>

        <button
          type="button"
          onClick={() =>
            appendBlock({
              order: blocks.length,
              isPublic: true,
              block: {
                type: "DIVIDER",
                layout: "DEFAULT",
                content: {
                  label: "",
                },
              },
            })
          }
        >
          + Divider
        </button>

        <button
          type="button"
          onClick={() =>
            appendBlock({
              order: blocks.length,
              isPublic: true,
              block: {
                type: "IMAGE",
                layout: "WIDE",
                content: {
                  alt: "",
                  caption: "",
                },
              },
            })
          }
        >
          + Image
        </button>

        <button
          type="button"
          onClick={() =>
            appendBlock({
              order: blocks.length,
              isPublic: true,
              block: {
                type: "IMAGE_TEXT",
                layout: "SPLIT",
                content: {
                  alt: "",
                  caption: "",
                  title: "Nuovo blocco cinematico",
                  text: "",
                  imagePosition: "left",
                },
              },
            })
          }
        >
          + Image/Text
        </button>

        <button
          type="button"
          onClick={() =>
            appendBlock({
              order: blocks.length,
              isPublic: true,
              block: {
                type: "VIDEO",
                layout: "WIDE",
                content: {
                  url: "/",
                  title: "",
                  caption: "",
                  provider: "EXTERNAL",
                },
              },
            })
          }
        >
          + Video
        </button>

        <button
          type="button"
          onClick={() =>
            appendBlock({
              order: blocks.length,
              isPublic: true,
              block: {
                type: "CTA",
                layout: "WIDE",
                content: {
                  label: "Apri",
                  href: "/",
                  description: "",
                },
              },
            })
          }
        >
          + CTA
        </button>

        <button
          type="button"
          onClick={() =>
            appendBlock({
              order: blocks.length,
              isPublic: true,
              block: {
                type: "RELATED_CONTENT",
                layout: "WIDE",
                content: {
                  title: "",
                },
              },
            })
          }
        >
          + Related
        </button>
      </div>

      <div className={styles.list}>
        {blocks.length === 0 ? (
          <p className={styles.empty}>Nessun blocco strutturato.</p>
        ) : (
          blocks.map((item, index) => (
            <article
              key={`${item.id ?? "new"}-${item.order}-${item.block.type}-${index}`}
              className={styles.card}
            >
              <div className={styles.cardHeader}>
                <div>
                  <strong>{item.block.type}</strong>
                  <span>
                    #{item.order} · {item.block.layout}
                  </span>
                </div>

                <label className={styles.publicToggle}>
                  <input
                    type="checkbox"
                    checked={item.isPublic}
                    onChange={(event) =>
                      updateIsPublic(index, event.target.checked)
                    }
                  />
                  Public
                </label>

                <button type="button" onClick={() => removeBlock(index)}>
                  Remove
                </button>
              </div>

              {item.block.type === "CALLOUT" ? (
                <div className={styles.fields}>
                  <label>
                    Tone
                    <select
                      value={item.block.content.tone}
                      onChange={(event) =>
                        updateCallout(index, {
                          tone: event.target.value as CalloutTone,
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
                      value={item.block.content.title ?? ""}
                      onChange={(event) =>
                        updateCallout(index, {
                          title: event.target.value,
                        })
                      }
                    />
                  </label>

                  <label>
                    Text
                    <textarea
                      value={item.block.content.text}
                      onChange={(event) =>
                        updateCallout(index, {
                          text: event.target.value,
                        })
                      }
                    />
                  </label>
                </div>
              ) : null}

              {item.block.type === "DIVIDER" ? (
                <div className={styles.fields}>
                  <label>
                    Label
                    <input
                      value={item.block.content.label ?? ""}
                      onChange={(event) =>
                        updateDivider(index, {
                          label: event.target.value,
                        })
                      }
                    />
                  </label>
                </div>
              ) : null}

              {item.block.type === "IMAGE" ? (
                <div className={styles.fields}>
                  <label>
                    Image URL
                    <input
                      value={item.block.content.url ?? ""}
                      placeholder="/images/covers/example.jpg"
                      onChange={(event) =>
                        updateImage(index, {
                          url: event.target.value,
                        })
                      }
                    />
                  </label>

                  <label>
                    Alt
                    <input
                      value={item.block.content.alt ?? ""}
                      placeholder="Descrizione accessibile dell'immagine"
                      onChange={(event) =>
                        updateImage(index, {
                          alt: event.target.value,
                        })
                      }
                    />
                  </label>

                  <label>
                    Caption
                    <input
                      value={item.block.content.caption ?? ""}
                      placeholder="Didascalia opzionale"
                      onChange={(event) =>
                        updateImage(index, {
                          caption: event.target.value,
                        })
                      }
                    />
                  </label>

                  {hasPreviewableImageUrl(item.block.content.url) ? (
                    <figure className={styles.imagePreview}>
                      <div
                        className={styles.imagePreviewFrame}
                        style={{
                          backgroundImage: `url("${item.block.content.url}")`,
                        }}
                        role="img"
                        aria-label={
                          item.block.content.alt ?? "Anteprima immagine"
                        }
                      />
                      {item.block.content.caption ? (
                        <figcaption>{item.block.content.caption}</figcaption>
                      ) : null}
                    </figure>
                  ) : (
                    <p className={styles.imageHint}>
                      Inserisci un URL immagine per vedere l’anteprima. Per ora
                      puoi usare asset locali in <code>/public</code>, per
                      esempio{" "}
                      <code>/images/covers/Copertina_NEW_TQCNTHD.jpg</code>.
                    </p>
                  )}
                </div>
              ) : null}

              {item.block.type === "IMAGE_TEXT" ? (
                <div className={styles.fields}>
                  <label>
                    Title
                    <input
                      value={item.block.content.title ?? ""}
                      onChange={(event) =>
                        updateImageText(index, {
                          title: event.target.value,
                        })
                      }
                    />
                  </label>

                  <label>
                    Text
                    <textarea
                      value={item.block.content.text}
                      onChange={(event) =>
                        updateImageText(index, {
                          text: event.target.value,
                        })
                      }
                    />
                  </label>

                  <label>
                    Image position
                    <select
                      value={item.block.content.imagePosition}
                      onChange={(event) =>
                        updateImageText(index, {
                          imagePosition: event.target.value as ImagePosition,
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
                      value={item.block.content.url ?? ""}
                      onChange={(event) =>
                        updateImageText(index, {
                          url: event.target.value,
                        })
                      }
                    />
                  </label>

                  <label>
                    Alt
                    <input
                      value={item.block.content.alt ?? ""}
                      onChange={(event) =>
                        updateImageText(index, {
                          alt: event.target.value,
                        })
                      }
                    />
                  </label>

                  <label>
                    Caption
                    <input
                      value={item.block.content.caption ?? ""}
                      onChange={(event) =>
                        updateImageText(index, {
                          caption: event.target.value,
                        })
                      }
                    />
                  </label>

                  {hasPreviewableImageUrl(item.block.content.url) ? (
                    <figure className={styles.imagePreview}>
                      <div
                        className={styles.imagePreviewFrame}
                        style={{
                          backgroundImage: `url("${item.block.content.url}")`,
                        }}
                        role="img"
                        aria-label={
                          item.block.content.alt ?? "Anteprima immagine"
                        }
                      />
                      {item.block.content.caption ? (
                        <figcaption>{item.block.content.caption}</figcaption>
                      ) : null}
                    </figure>
                  ) : (
                    <p className={styles.imageHint}>
                      Inserisci un URL immagine per completare il blocco
                      cinematico.
                    </p>
                  )}
                </div>
              ) : null}

              {item.block.type === "VIDEO" ? (
                <div className={styles.fields}>
                  <label>
                    Provider
                    <select
                      value={item.block.content.provider}
                      onChange={(event) =>
                        updateVideo(index, {
                          provider: event.target.value as VideoProvider,
                        })
                      }
                    >
                      <option value="YOUTUBE">YOUTUBE</option>
                      <option value="VIMEO">VIMEO</option>
                      <option value="EXTERNAL">EXTERNAL</option>
                    </select>
                  </label>

                  <label>
                    URL
                    <input
                      value={item.block.content.url}
                      onChange={(event) =>
                        updateVideo(index, {
                          url: event.target.value,
                        })
                      }
                    />
                  </label>

                  <label>
                    Title
                    <input
                      value={item.block.content.title ?? ""}
                      onChange={(event) =>
                        updateVideo(index, {
                          title: event.target.value,
                        })
                      }
                    />
                  </label>

                  <label>
                    Caption
                    <input
                      value={item.block.content.caption ?? ""}
                      onChange={(event) =>
                        updateVideo(index, {
                          caption: event.target.value,
                        })
                      }
                    />
                  </label>
                </div>
              ) : null}

              {item.block.type === "CTA" ? (
                <div className={styles.fields}>
                  <label>
                    Label
                    <input
                      value={item.block.content.label}
                      onChange={(event) =>
                        updateCta(index, {
                          label: event.target.value,
                        })
                      }
                    />
                  </label>

                  <label>
                    Href
                    <input
                      value={item.block.content.href}
                      onChange={(event) =>
                        updateCta(index, {
                          href: event.target.value,
                        })
                      }
                    />
                  </label>

                  <label>
                    Description
                    <textarea
                      value={item.block.content.description ?? ""}
                      onChange={(event) =>
                        updateCta(index, {
                          description: event.target.value,
                        })
                      }
                    />
                  </label>
                </div>
              ) : null}

              {item.block.type === "RELATED_CONTENT" ? (
                <div className={styles.fields}>
                  <label>
                    Owner entity key
                    <input
                      value={item.block.content.ownerEntityKey ?? ""}
                      onChange={(event) =>
                        updateRelatedContent(index, {
                          ownerEntityKey: event.target.value,
                        })
                      }
                    />
                  </label>

                  <label>
                    Title
                    <input
                      value={item.block.content.title ?? ""}
                      onChange={(event) =>
                        updateRelatedContent(index, {
                          title: event.target.value,
                        })
                      }
                    />
                  </label>
                </div>
              ) : null}
            </article>
          ))
        )}
      </div>
    </aside>
  );
}
