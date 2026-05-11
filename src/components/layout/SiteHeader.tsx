import Link from "next/link";
import styles from "./SiteHeader.module.css";

const navItems = [
  { href: "/", label: "Home", primary: true },
  { href: "/musica", label: "Musica", primary: true },
  { href: "/musica/diario-di-jay", label: "Diario" },
  { href: "/eventi", label: "Eventi" },
  { href: "/bio", label: "Bio" },
  { href: "/media-kit", label: "Media Kit" },
  { href: "/contatti", label: "Contatti" },
];

export function SiteHeader() {
  return (
    <header className={styles.header}>
      <nav className={styles.nav} aria-label="Navigazione principale">
        <div className={styles.brandRow}>
          <Link href="/" className={styles.brand} aria-label="JEEC home">
            <span className={styles.brandMark}>J</span>

            <span className={styles.brandText}>
              <span className={styles.brandName}>JEEC</span>
              <span className={styles.brandSubtitle}>Arcade Transmission</span>
            </span>
          </Link>

          <div className={styles.status} aria-hidden="true">
            <span className={styles.statusDot} />
            NEW online
          </div>
        </div>

        <div className={styles.links}>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={styles.link}
              data-primary={item.primary ? "true" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
