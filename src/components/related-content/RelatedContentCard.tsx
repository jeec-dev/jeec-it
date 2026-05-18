import Link from "next/link";
import Image from "next/image";
import type { RelatedContentItemView } from "@/lib/related-content/types";
import styles from "./RelatedContent.module.css";

type RelatedContentCardProps = {
  item: RelatedContentItemView;
  layout: string;
};

function isExternalHref(href: string) {
  return href.startsWith("http://") || href.startsWith("https://");
}

function getTypeLabel(item: RelatedContentItemView) {
  if (item.eyebrow) {
    return item.eyebrow;
  }

  if (item.type === "MUSIC" && item.kindKey === "TRACK") {
    return "Traccia";
  }

  if (item.type === "MUSIC" && item.kindKey === "RELEASE") {
    return "Release";
  }

  if (item.type === "EXPERIENCE") {
    return "Esperienza";
  }

  if (item.type === "ARTICLE") {
    return "Articolo";
  }

  if (item.type === "VIDEO") {
    return "Video";
  }

  if (item.type === "EVENT") {
    return "Evento";
  }

  if (item.type === "COMMERCE") {
    return "Store";
  }

  if (item.type === "EXTERNAL") {
    return "Link";
  }

  return item.type;
}

function getDefaultCta(item: RelatedContentItemView) {
  if (item.ctaLabel) {
    return item.ctaLabel;
  }

  if (!item.href) {
    return "In arrivo";
  }

  if (isExternalHref(item.href)) {
    return "Apri link";
  }

  if (item.type === "MUSIC" && item.kindKey === "TRACK") {
    return "Apri traccia";
  }

  if (item.type === "MUSIC" && item.kindKey === "RELEASE") {
    return "Apri release";
  }

  if (item.type === "EXPERIENCE") {
    return "Avvia esperienza";
  }

  return "Esplora";
}

function CardInner({ item }: { item: RelatedContentItemView }) {
  return (
    <>
      {item.imageUrl ? (
        <span className={styles.imageFrame}>
          <Image
            src={item.imageUrl}
            alt=""
            fill
            sizes="(min-width: 1024px) 18rem, (min-width: 768px) 14rem, 90vw"
            className={styles.image}
          />
        </span>
      ) : null}

      <div className={styles.cardBody}>
        <span className={styles.cardEyebrow}>{getTypeLabel(item)}</span>

        <strong>{item.title}</strong>

        {item.description ? <p>{item.description}</p> : null}

        <span className={styles.cardFooter}>
          {item.isPinned ? <span className={styles.flag}>Pinned</span> : null}
          {item.isFeatured ? (
            <span className={styles.flag}>Featured</span>
          ) : null}
          <span className={styles.cardCta}>{getDefaultCta(item)} →</span>
        </span>
      </div>
    </>
  );
}

export function RelatedContentCard({ item, layout }: RelatedContentCardProps) {
  const className = `${styles.card} ${item.imageUrl ? styles.withImage : ""}`;

  if (!item.href) {
    return (
      <article
        className={className}
        data-type={item.type.toLowerCase()}
        data-kind={item.kindKey.toLowerCase()}
        data-layout={layout.toLowerCase()}
      >
        <CardInner item={item} />
      </article>
    );
  }

  if (isExternalHref(item.href)) {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noreferrer"
        className={className}
        data-type={item.type.toLowerCase()}
        data-kind={item.kindKey.toLowerCase()}
        data-layout={layout.toLowerCase()}
      >
        <CardInner item={item} />
      </a>
    );
  }

  return (
    <Link
      href={item.href}
      className={className}
      data-type={item.type.toLowerCase()}
      data-kind={item.kindKey.toLowerCase()}
      data-layout={layout.toLowerCase()}
    >
      <CardInner item={item} />
    </Link>
  );
}
