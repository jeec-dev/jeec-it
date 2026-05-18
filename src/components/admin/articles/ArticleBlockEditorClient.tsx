"use client";

import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";

import { BlockNoteView } from "@blocknote/mantine";
import { SuggestionMenuController, useCreateBlockNote } from "@blocknote/react";
import { useMemo, useRef, useState, useTransition } from "react";

import {
  blockNoteToEditorBlocks,
  editorBlocksToBlockNote,
  type UnknownBlock,
} from "@/lib/articles/blocknote-adapter";

import type { ArticleBlockEditorProps } from "./ArticleBlockEditor.types";
import {
  JeecMediaAssetsProvider,
  jeecBlockNoteSchema,
} from "./JeecBlockNoteBlocks";
import { getJeecSlashMenuItems } from "./jeec-slash-menu";
import styles from "./ArticleBlockEditor.module.css";

export function ArticleBlockEditorClient({
  articleId,
  initialBlocks,
  mediaAssets = [],
  onSave,
}: ArticleBlockEditorProps) {
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const initialContent = useMemo(
    () => editorBlocksToBlockNote(initialBlocks),
    [initialBlocks],
  );

  const editor = useCreateBlockNote({
    schema: jeecBlockNoteSchema,
    initialContent,
  });

  const latestDocumentRef = useRef<UnknownBlock[]>(
    editor.document as UnknownBlock[],
  );

  function handleSave() {
    setMessage(null);

    startTransition(async () => {
      const document = latestDocumentRef.current.length
        ? latestDocumentRef.current
        : (editor.document as UnknownBlock[]);

      const blocks = blockNoteToEditorBlocks(document).map((block, index) => ({
        ...block,
        order: index,
      }));

      console.table(
        blocks.map((item) => ({
          order: item.order,
          type: item.block.type,
          content: JSON.stringify(item.block.content),
        })),
      );

      setMessage(`Salvataggio di ${blocks.length} blocchi...`);

      await onSave(articleId, blocks);
    });
  }

  return (
    <section className={styles.editorShell}>
      <div className={styles.toolbar}>
        <div>
          <p>Block editor</p>
          <span>
            Canvas unico: testo, immagini e blocchi strutturati JeeC nello
            stesso ordine editoriale.
          </span>
        </div>

        <button type="button" onClick={handleSave} disabled={isPending}>
          {isPending ? "Salvataggio..." : "Salva draft"}
        </button>
      </div>

      {message ? <p className={styles.message}>{message}</p> : null}

      <JeecMediaAssetsProvider mediaAssets={mediaAssets}>
        <div className={styles.editorFrame}>
          <BlockNoteView
            editor={editor}
            theme="dark"
            slashMenu={false}
            onChange={() => {
              latestDocumentRef.current = editor.document as UnknownBlock[];
            }}
          >
            <SuggestionMenuController
              triggerCharacter="/"
              getItems={async (query) =>
                getJeecSlashMenuItems(editor as unknown, query)
              }
            />
          </BlockNoteView>
        </div>
      </JeecMediaAssetsProvider>
    </section>
  );
}
