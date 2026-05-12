"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./SiteHeader.module.css";

const navItems = [
  { href: "/", label: "Home", exact: true },
  { href: "/musica", label: "Musica" },
  { href: "/diario-di-jay", label: "Diario" },
  { href: "/eventi", label: "Eventi" },
  { href: "/bio", label: "Bio" },
  { href: "/media-kit", label: "Media Kit" },
  { href: "/contatti", label: "Contatti" },
];

function isActivePath(pathname: string, href: string, exact?: boolean) {
  if (exact) {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className={styles.header}>
      <nav className={styles.nav} aria-label="Navigazione principale">
        <div className={styles.brandRow}>
          <Link
            href="/"
            className={styles.brand}
            aria-label="Vai alla home di JeeC"
          >
            <span className={styles.brandMark}>J</span>

            <span className={styles.brandText}>
              <span className={styles.brandName}>JEEC</span>
              <span className={styles.brandSubtitle}>Transmission</span>
            </span>
          </Link>

          <Link
            href="/"
            className={styles.experienceCta}
            aria-label="Gioca l'esperienza interattiva NEW"
          >
            <span className={styles.statusDot} aria-hidden="true" />
            Play NEW
          </Link>
        </div>

        <div className={styles.links}>
          {navItems.map((item) => {
            const isActive = isActivePath(pathname, item.href, item.exact);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={styles.link}
                data-active={isActive ? "true" : undefined}
                aria-current={isActive ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
