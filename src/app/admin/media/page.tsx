import Link from "next/link";
import { notFound } from "next/navigation";

import { getAdminMediaAssets } from "@/lib/admin/media-assets";

import styles from "./AdminMediaPage.module.css";

export const dynamic = "force-dynamic";

export default async function AdminMediaPage() {
  if (process.env.ADMIN_PREVIEW_ENABLED !== "true") {
    notFound();
  }

  const assets = await getAdminMediaAssets();

  return (
    <main className={styles.page}>
      <section className={styles.shell}>
        <div className={styles.topbar}>
          <Link href="/admin/articles">← Articles</Link>
        </div>

        <header className={styles.header}>
          <p className={styles.eyebrow}>Media library</p>
          <h1>Media assets</h1>
          <p>
            Libreria read-only degli asset già presenti nel DB. Upload, R2,
            Cloudinary e gestione avanzata restano step futuri.
          </p>
        </header>

        {assets.length === 0 ? (
          <p className={styles.empty}>Nessun media asset disponibile.</p>
        ) : (
          <section className={styles.grid}>
            {assets.map((asset) => {
              const previewUrl = asset.thumbnailUrl ?? asset.url;
              const label = asset.alt ?? asset.caption ?? asset.url;

              return (
                <article key={asset.id} className={styles.card}>
                  {asset.type === "IMAGE" ? (
                    <div
                      className={styles.preview}
                      style={{
                        backgroundImage: `url("${previewUrl}")`,
                      }}
                      role="img"
                      aria-label={label}
                    />
                  ) : (
                    <div className={styles.placeholder}>{asset.type}</div>
                  )}

                  <div className={styles.cardBody}>
                    <strong>{label}</strong>
                    <span>
                      {asset.provider} · {asset.type}
                    </span>
                    <code>{asset.id}</code>
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </section>
    </main>
  );
}
