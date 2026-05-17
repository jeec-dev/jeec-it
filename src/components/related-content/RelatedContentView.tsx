import type { RelatedContentBlockView } from "@/lib/related-content/types";
import { RelatedContentSection } from "./RelatedContentSection";
import styles from "./RelatedContent.module.css";

type RelatedContentViewProps = {
  block: RelatedContentBlockView;
};

export function RelatedContentView({ block }: RelatedContentViewProps) {
  return (
    <section className={styles.panel} aria-labelledby="related-content-title">
      <div className={styles.header}>
        <p className={styles.eyebrow}>Elementi correlati</p>

        <h2 id="related-content-title" className={styles.title}>
          {block.title ?? "Intorno a questo contenuto"}
        </h2>

        {block.description ? (
          <p className={styles.description}>{block.description}</p>
        ) : null}
      </div>

      <div className={styles.sections}>
        {block.sections.map((section) => (
          <RelatedContentSection key={section.id} section={section} />
        ))}
      </div>
    </section>
  );
}
