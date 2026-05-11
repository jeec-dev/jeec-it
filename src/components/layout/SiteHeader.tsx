import Link from "next/link";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/musica", label: "Musica" },
  { href: "/musica/diario-di-jay", label: "Diario" },
  { href: "/eventi", label: "Eventi" },
  { href: "/bio", label: "Bio" },
  { href: "/media-kit", label: "Media Kit" },
  { href: "/contatti", label: "Contatti" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-white/10 bg-black/90 px-6 py-4 text-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between">
        <Link href="/" className="font-bold tracking-[0.3em]">
          JEEC
        </Link>

        <div className="flex flex-wrap gap-4 text-sm text-white/60">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-white">
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}