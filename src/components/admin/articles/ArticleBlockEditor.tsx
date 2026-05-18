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

import { StructuredBlockInspector } from "./StructuredBlockInspector";
import styles from "./ArticleBlockEditor.module.css";

type ArticleBlockEditorProps = {
  articleId: string;
  initialBlocks: ArticleEditorBlockInput[];
  onSave: (
    articleId: string,
    blocks: ArticleEditorBlockInput[],
  ) => Promise<void>;
};

const inlineEditorTypes = new Set(["PARAGRAPH", "HEADING", "QUOTE"]);

export function ArticleBlockEditor({
  articleId,
  initialBlocks,
  onSave,
}: ArticleBlockEditorProps) {
  const [message, setMessage] = useState<string | null>(null);
  const [structuredBlocks, setStructuredBlocks] = useState<
    ArticleEditorBlockInput[]
  >(initialBlocks.filter((item) => !inlineEditorTypes.has(item.block.type)));
  const [isPending, startTransition] = useTransition();

  const inlineBlocks = useMemo(
    () =>
      initialBlocks.filter((item) => inlineEditorTypes.has(item.block.type)),
    [initialBlocks],
  );

  const initialContent = useMemo(
    () => editorBlocksToBlockNote(inlineBlocks),
    [inlineBlocks],
  );

  const editor = useCreateBlockNote({
    initialContent,
  });

  function handleSave() {
    setMessage(null);

    startTransition(async () => {
      const textBlocks = blockNoteToEditorBlocks(editor.document);
      const mergedBlocks = [...textBlocks, ...structuredBlocks].map(
        (block, index) => ({
          ...block,
          order: index,
        }),
      );

      setMessage(`Salvataggio di ${mergedBlocks.length} blocchi...`);

      await onSave(articleId, mergedBlocks);
    });
  }

  return (
    <section className={styles.editorShell}>
      <div className={styles.toolbar}>
        <div>
          <p>Block editor</p>
          <span>Testo nel canvas, blocchi cinematici nell’inspector.</span>
        </div>

        <button type="button" onClick={handleSave} disabled={isPending}>
          {isPending ? "Salvataggio..." : "Salva draft"}
        </button>
      </div>

      {message ? <p className={styles.message}>{message}</p> : null}

      <div className={styles.editorGrid}>
        <div className={styles.editorFrame}>
          <BlockNoteView editor={editor} theme="dark" />
        </div>

        <StructuredBlockInspector
          blocks={structuredBlocks}
          onChange={setStructuredBlocks}
        />
      </div>
    </section>
  );
}
