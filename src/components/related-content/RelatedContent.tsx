import Link from "next/link";
import {
  getRelatedContentForEntity,
  getRelatedContentForReleaseSlug,
} from "@/lib/related-content/related-content";
import styles from "./RelatedContent.module.css";

type RelatedContentProps =
  | {
      ownerEntityKey: string;
      releaseSlug?: never;
    }
  | {
      ownerEntityKey?: never;
      releaseSlug: string;
    };

function isExternalHref(href: string) {
  return href.startsWith("http://") || href.startsWith("https://");
}

export async function RelatedContent(props: RelatedContentProps) {
  const block =
    typeof props.releaseSlug === "string"
      ? await getRelatedContentForReleaseSlug(props.releaseSlug)
      : typeof props.ownerEntityKey === "string"
        ? await getRelatedContentForEntity(props.ownerEntityKey)
        : null;

  if (!block) {
    return null;
  }

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
          <section
            key={section.id}
            className={styles.section}
            data-layout={section.layout.toLowerCase()}
          >
            <div className={styles.sectionHeader}>
              <h3>{section.title}</h3>
              {section.description ? <p>{section.description}</p> : null}
            </div>

            <div className={styles.grid}>
              {section.items.map((item) => {
                const href = item.href ?? "#";
                const external = isExternalHref(href);
                const content = (
                  <>
                    <span className={styles.cardEyebrow}>{item.eyebrow}</span>
                    <strong>{item.title}</strong>
                    {item.description ? <p>{item.description}</p> : null}
                    <span className={styles.cardCta}>{item.ctaLabel}</span>
                  </>
                );

                if (external) {
                  return (
                    <a
                      key={`${section.id}-${item.id}`}
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      className={styles.card}
                    >
                      {content}
                    </a>
                  );
                }

                return (
                  <Link
                    key={`${section.id}-${item.id}`}
                    href={href}
                    className={styles.card}
                  >
                    {content}
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}
