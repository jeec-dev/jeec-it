import Link from "next/link";
import styles from "./Footer.module.css";

const footerNav = [
  { label: "Home", href: "/" },
  { label: "Musica", href: "/musica" },
  { label: "Diario di Jay", href: "/musica/diario-di-jay" },
  { label: "Eventi", href: "/eventi" },
  { label: "Bio", href: "/bio" },
  { label: "Media Kit", href: "/media-kit" },
  { label: "Contatti", href: "/contatti" },
];

const socialLinks = [
  {
    label: "Spotify",
    href: "https://open.spotify.com/artist/3m21RYc8hGmj86j7758WEI",
  },
  { label: "YouTube", href: "https://www.youtube.com/" },
  { label: "Instagram", href: "https://www.instagram.com/" },
  { label: "SoundCloud", href: "https://soundcloud.com/sonojeec" },
  { label: "X", href: "https://twitter.com/" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.glow} aria-hidden="true" />

      <div className={styles.inner}>
        <section className={styles.brandBlock}>
          <Link
            href="/"
            className={styles.logo}
            aria-label="Vai alla home di JeeC"
          >
            JeeC
          </Link>

          <p className={styles.tagline}>
            Un universo musicale tra Pop, Hip-Hop, memoria e immaginazione.
          </p>

          <p className={styles.microcopy}>
            Esplora le release, il Diario di Jay, gli eventi live e i frammenti
            nascosti del progetto NEW.
          </p>
        </section>

        <nav className={styles.column} aria-label="Navigazione footer">
          <h2 className={styles.heading}>Esplora</h2>
          <ul className={styles.linkList}>
            {footerNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav
          className={styles.column}
          aria-label="Social e piattaforme musicali"
        >
          <h2 className={styles.heading}>Ascolta / Segui</h2>
          <ul className={styles.linkList}>
            {socialLinks.map((item) => (
              <li key={item.label}>
                <a href={item.href} target="_blank" rel="noreferrer">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <section className={styles.column}>
          <h2 className={styles.heading}>Legal</h2>
          <ul className={styles.linkList}>
            <li>
              <Link href="/privacy">Privacy Policy</Link>
            </li>
            <li>
              <Link href="/termini">Termini di servizio</Link>
            </li>
          </ul>
        </section>
      </div>

      <div className={styles.bottomBar}>
        <span>© {year} JeeC. All rights reserved.</span>
        <span className={styles.signal}>
          SIGNAL ACTIVE · NEW UNIVERSE ONLINE
        </span>
      </div>
    </footer>
  );
}
