import Link from "next/link";
import { featuredLinks, linktreeProfile, socialLinks } from "@/data/links";
import styles from "./Links.module.css";

export const metadata = {
  title: "Links | JeeC",
  description:
    "Tutti i link ufficiali di JeeC: musica, video, eventi, Diario di Jay, media kit e contatti.",
};

function LinkButton({
  href,
  label,
  description,
  external,
  variant,
}: {
  href: string;
  label: string;
  description: string;
  external: boolean;
  variant?: string;
}) {
  const content = (
    <>
      <span className={styles.linkText}>
        <strong>{label}</strong>
        <small>{description}</small>
      </span>
      <span className={styles.linkArrow} aria-hidden="true">
        →
      </span>
    </>
  );

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className={styles.linkButton}
        data-variant={variant ?? "standard"}
      >
        {content}
      </a>
    );
  }

  return (
    <Link
      href={href}
      className={styles.linkButton}
      data-variant={variant ?? "standard"}
    >
      {content}
    </Link>
  );
}

export default function LinksPage() {
  return (
    <main className={styles.page}>
      <section className={styles.card} aria-label="Link ufficiali JeeC">
        <div className={styles.avatar} aria-hidden="true">
          J
        </div>

        <p className={styles.kicker}>Official signal</p>
        <h1 className={styles.title}>{linktreeProfile.artistName}</h1>
        <p className={styles.subtitle}>{linktreeProfile.subtitle}</p>
        <p className={styles.description}>{linktreeProfile.description}</p>

        <div className={styles.links}>
          {featuredLinks.map((item) => (
            <LinkButton
              key={item.href}
              href={item.href}
              label={item.label}
              description={item.description}
              external={item.external}
              variant={item.variant}
            />
          ))}
        </div>

        <div className={styles.socials} aria-label="Social ufficiali">
          {socialLinks.map((item) => (
            <a
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noreferrer"
            >
              {item.label}
            </a>
          ))}
        </div>

        <Link href="/" className={styles.siteLink}>
          Entra nel sito completo
        </Link>
      </section>
    </main>
  );
}
