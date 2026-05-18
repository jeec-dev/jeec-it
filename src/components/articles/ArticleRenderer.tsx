//blocks.map(renderArticleBlock)
import styles from "./ArticleRenderer.module.css";

type ArticleRendererProps = {
  html: string;
};

export function ArticleRenderer({ html }: ArticleRendererProps) {
  return (
    <div
      className={styles.articleRoot}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
