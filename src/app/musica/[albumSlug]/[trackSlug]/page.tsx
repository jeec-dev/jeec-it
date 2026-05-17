import Link from "next/link";
import { notFound } from "next/navigation";
import styles from "./TrackDetail.module.css";
import {
  getCatalogTrackPageData,
  getCatalogTrackStaticParams,
} from "@/lib/music/catalog";
import { ListeningPanel } from "@/components/music/ListeningPanel";
import { LyricsPanel } from "@/components/music/LyricsPanel";
import { RelatedContent } from "@/components/related-content/RelatedContent";

type TrackPageProps = {
  params: Promise<{
    albumSlug: string;
    trackSlug: string;
  }>;
};

export async function generateStaticParams() {
  return getCatalogTrackStaticParams();
}

export default async function TrackPage({ params }: TrackPageProps) {
  const { albumSlug, trackSlug } = await params;
  const data = await getCatalogTrackPageData(albumSlug, trackSlug);

  if (!data) {
    notFound();
  }

  const { album, track, listeningLinks } = data;

  return (
    <main className={styles.page}>
      <div className={styles.inner}>
        <Link href={`/musica/${album.slug}`} className={styles.backLink}>
          ← Torna a {album.title}
        </Link>

        <section className={styles.contentGrid}>
          <div className={styles.mainColumn}>
            <LyricsPanel track={track} />
          </div>

          <aside className={styles.sideColumn}>
            <ListeningPanel links={listeningLinks} />
          </aside>
        </section>

        <RelatedContent albumSlug={album.slug} trackSlug={track.slug} />
      </div>
    </main>
  );
}
