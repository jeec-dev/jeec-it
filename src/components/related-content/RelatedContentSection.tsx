import type { RelatedContentSectionView } from "@/lib/related-content/types";
import { RelatedContentCard } from "./RelatedContentCard";
import styles from "./RelatedContent.module.css";

type RelatedContentSectionProps = {
  section: RelatedContentSectionView;
};

export function RelatedContentSection({ section }: RelatedContentSectionProps) {
  const layout = section.layout.toLowerCase();

  return (
    <section className={styles.section} data-layout={layout}>
      <div className={styles.sectionHeader}>
        <div>
          <h3>{section.title}</h3>
        </div>

        {section.description ? <p>{section.description}</p> : null}
      </div>

      <div className={styles.items} data-layout={layout}>
        {section.items.map((item) => (
          <RelatedContentCard
            key={`${section.id}-${item.id}-${item.source}`}
            item={item}
            layout={layout}
          />
        ))}
      </div>
    </section>
  );
}
