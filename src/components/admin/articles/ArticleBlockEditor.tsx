"use client";

import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";

import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import { useMemo, useState, useTransition } from "react";

import {
  blockNoteToEditorBlocks,
  editorBlocksToBlockNote,
} from "@/lib/articles/blocknote-adapter";
import type { ArticleEditorBlockInput } from "@/lib/articles/editor-contract";

import styles from "./ArticleBlockEditor.module.css";

type ArticleBlockEditorProps = {
  articleId: string;
  initialBlocks: ArticleEditorBlockInput[];
  onSave: (
    articleId: string,
    blocks: ArticleEditorBlockInput[],
  ) => Promise<void>;
};

export function ArticleBlockEditor({
  articleId,
  initialBlocks,
  onSave,
}: ArticleBlockEditorProps) {
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const initialContent = useMemo(
    () => editorBlocksToBlockNote(initialBlocks),
    [initialBlocks],
  );

  const editor = useCreateBlockNote({
    initialContent,
  });

  function handleSave() {
    setMessage(null);

    startTransition(async () => {
      const blocks = blockNoteToEditorBlocks(editor.document).map(
        (block, index) => ({
          ...block,
          order: index,
        }),
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
            Paragraph, heading e quote salvati come ArticleContentBlock.
          </span>
        </div>

        <button type="button" onClick={handleSave} disabled={isPending}>
          {isPending ? "Salvataggio..." : "Salva draft"}
        </button>
      </div>

      {message ? <p className={styles.message}>{message}</p> : null}

      <div className={styles.editorFrame}>
        <BlockNoteView editor={editor} theme="dark" />
      </div>
    </section>
  );
}
