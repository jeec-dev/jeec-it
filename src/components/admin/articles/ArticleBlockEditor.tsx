"use client";

import dynamic from "next/dynamic";

import type { ArticleBlockEditorProps } from "./ArticleBlockEditor.types";
import styles from "./ArticleBlockEditor.module.css";

const ArticleBlockEditorClient = dynamic(
  () =>
    import("./ArticleBlockEditorClient").then(
      (module) => module.ArticleBlockEditorClient,
    ),
  {
    ssr: false,
    loading: () => (
      <section className={styles.editorShell}>
        <div className={styles.editorFrame}>
          <div className={styles.loadingState}>Inizializzazione editor...</div>
        </div>
      </section>
    ),
  },
);

export function ArticleBlockEditor(props: ArticleBlockEditorProps) {
  return <ArticleBlockEditorClient {...props} />;
}
