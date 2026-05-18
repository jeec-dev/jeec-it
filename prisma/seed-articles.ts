import { config as loadEnv } from "dotenv";
import {
  $Enums,
  type Prisma,
  type PrismaClient,
} from "../src/generated/prisma";
import { renderArticleBlocksToHtml } from "../src/lib/articles/render-html";

loadEnv({ path: ".env" });
loadEnv({ path: ".env.local", override: true });

let db: PrismaClient;

type ArticleSeedBlock = {
  type: $Enums.ArticleBlockType;
  layout: $Enums.ArticleBlockLayout;
  content: Prisma.InputJsonObject;
};

type ArticleSeed = {
  slug: string;
  title: string;
  chapter: string;
  date: string;
  displayDate: string;
  narrativeDate: string;
  coverUrl: string;
  excerpt: string;
  linkedTrackSlug: string;
  linkedTrackTitle: string;
  blocks: ArticleSeedBlock[];
};

const articleSeeds: ArticleSeed[] = [
  {
    slug: "dentro-una-fantasy",
    title: "Dentro Una Fantasy",
    chapter: "Capitolo 1",
    date: "2023-03-17",
    displayDate: "17 marzo 2023",
    narrativeDate: "17 marzo 1954",
    coverUrl: "/images/covers/dentro-una-fantasy.jpg",
    linkedTrackSlug: "dentro-una-fantasy",
    linkedTrackTitle: "Dentro Una Fantasy",
    excerpt:
      "Jay vive una routine immutabile nel 1954, finché un incidente inspiegabile lo strappa dalla sua epoca.",
    blocks: [
      {
        type: $Enums.ArticleBlockType.HEADING,
        layout: $Enums.ArticleBlockLayout.DEFAULT,
        content: { level: 2, text: "Dentro Una Fantasy" },
      },
      {
        type: $Enums.ArticleBlockType.PARAGRAPH,
        layout: $Enums.ArticleBlockLayout.DEFAULT,
        content: { text: "17 marzo 1954." },
      },
      {
        type: $Enums.ArticleBlockType.PARAGRAPH,
        layout: $Enums.ArticleBlockLayout.DEFAULT,
        content: {
          text: "Mi chiamo Luigi Jay Colombo, ma da sempre tutti mi chiamano Jay.",
        },
      },
      {
        type: $Enums.ArticleBlockType.PARAGRAPH,
        layout: $Enums.ArticleBlockLayout.DEFAULT,
        content: {
          text: "Ho ventitré anni, qualche lira in tasca e una vita che sembra essersi incastrata nello stesso giorno ripetuto all’infinito. Ogni mattina mi sveglio alle sei, faccio colazione con quello che trovo, spesso pane raffermo, e mi preparo per la fabbrica.",
        },
      },
      {
        type: $Enums.ArticleBlockType.PARAGRAPH,
        layout: $Enums.ArticleBlockLayout.DEFAULT,
        content: {
          text: "Alle sette e mezza sono già al lavoro.\nAlle tredici pranzo, quasi sempre da solo.\nAlle diciotto saluto Fanfani, l’unico operaio con cui scambio qualche parola, e raggiungo la mia automobile per tornare a casa.\nAlle diciannove ceno davanti alla televisione, una novità costata più di quanto avrei dovuto spendere, ma almeno Corrado mi tiene compagnia.\nAlle venti provo a leggere qualche pagina di un libro, finché il sonno non decide al posto mio.",
        },
      },
      {
        type: $Enums.ArticleBlockType.PARAGRAPH,
        layout: $Enums.ArticleBlockLayout.DEFAULT,
        content: { text: "E così finisce un altro giorno." },
      },
      {
        type: $Enums.ArticleBlockType.PARAGRAPH,
        layout: $Enums.ArticleBlockLayout.DEFAULT,
        content: { text: "E così, pensavo, sarebbe finito anche questo." },
      },
      {
        type: $Enums.ArticleBlockType.PARAGRAPH,
        layout: $Enums.ArticleBlockLayout.DEFAULT,
        content: {
          text: "La monotonia non mi spaventava più. Anzi, aveva iniziato ad avere una forma familiare, quasi rassicurante. Ogni cosa era al proprio posto: il lavoro, la strada, la cena, la televisione, il libro, il letto. Non c’erano sorprese, e forse proprio per questo avevo smesso di aspettarmene.",
        },
      },
      {
        type: $Enums.ArticleBlockType.PARAGRAPH,
        layout: $Enums.ArticleBlockLayout.DEFAULT,
        content: { text: "Ma quella sera qualcosa cambiò." },
      },
      {
        type: $Enums.ArticleBlockType.PARAGRAPH,
        layout: $Enums.ArticleBlockLayout.DEFAULT,
        content: {
          text: "Finito il turno, entrai in macchina e accesi l’autoradio per ascoltare le ultime notizie. La frequenza, però, era disturbata. Le voci arrivavano spezzate, coperte da un’interferenza irregolare. Provai a girare le manopole, cercando un segnale più pulito, ma il suono continuava a frammentarsi.",
        },
      },
      {
        type: $Enums.ArticleBlockType.PARAGRAPH,
        layout: $Enums.ArticleBlockLayout.DEFAULT,
        content: {
          text: "Per un istante abbassai lo sguardo.\n\nPoi sentii un boato.",
        },
      },
      {
        type: $Enums.ArticleBlockType.PARAGRAPH,
        layout: $Enums.ArticleBlockLayout.DEFAULT,
        content: {
          text: "Subito dopo, un fischio acuto mi attraversò la testa. Tutto intorno a me sembrò piegarsi, come se il mondo avesse perso consistenza. Quando riaprii gli occhi, ero ancora vivo, ma non ero più dove avrei dovuto essere.",
        },
      },
      {
        type: $Enums.ArticleBlockType.PARAGRAPH,
        layout: $Enums.ArticleBlockLayout.DEFAULT,
        content: {
          text: "Uscii dalla macchina fumante con le gambe instabili e il sangue che mi colava dalla fronte. Cercai di capire se avessi coinvolto qualcuno nell’incidente, ma davanti a me non c’erano altre automobili, né strada, né case.",
        },
      },
      {
        type: $Enums.ArticleBlockType.PARAGRAPH,
        layout: $Enums.ArticleBlockLayout.DEFAULT,
        content: { text: "Avevo colpito un albero." },
      },
      {
        type: $Enums.ArticleBlockType.PARAGRAPH,
        layout: $Enums.ArticleBlockLayout.DEFAULT,
        content: {
          text: "Il problema era che fino a pochi secondi prima stavo guidando su una strada cittadina. Adesso mi trovavo in mezzo a una pianura, su un sentiero sterrato, con l’auto accartocciata contro un tronco.",
        },
      },
      {
        type: $Enums.ArticleBlockType.QUOTE,
        layout: $Enums.ArticleBlockLayout.DEFAULT,
        content: {
          text: "Non mi ero soltanto perso. Ero uscito dal mio mondo.",
          cite: "Jay",
        },
      },
    ],
  },
  {
    slug: "da-domani",
    title: "Da Domani",
    chapter: "Capitolo 2",
    date: "2023-06-16",
    displayDate: "16 giugno 2023",
    narrativeDate: "17 marzo 2023",
    coverUrl: "/images/covers/da-domani.jpg",
    linkedTrackSlug: "da-domani",
    linkedTrackTitle: "Da domani",
    excerpt:
      "Jay arriva in un quartiere che non riconosce e incontra Alba, la prima persona del futuro a fermarsi davanti a lui.",
    blocks: [
      {
        type: $Enums.ArticleBlockType.HEADING,
        layout: $Enums.ArticleBlockLayout.DEFAULT,
        content: { level: 2, text: "Da Domani" },
      },
      {
        type: $Enums.ArticleBlockType.PARAGRAPH,
        layout: $Enums.ArticleBlockLayout.DEFAULT,
        content: {
          text: "Dopo aver camminato per un tempo che non saprei misurare, arrivai in quello che sembrava un piccolo quartiere periferico di una grande città.",
        },
      },
      {
        type: $Enums.ArticleBlockType.PARAGRAPH,
        layout: $Enums.ArticleBlockLayout.DEFAULT,
        content: {
          text: "All’inizio pensai di essere solo confuso. L’incidente mi aveva lasciato stordito, sanguinante, forse incapace di ragionare con lucidità. Ma più guardavo ciò che avevo intorno, più diventava difficile credere che fosse solo colpa del colpo alla testa.",
        },
      },
      {
        type: $Enums.ArticleBlockType.PARAGRAPH,
        layout: $Enums.ArticleBlockLayout.DEFAULT,
        content: {
          text: "Gli edifici erano diversi. Le vetrine sembravano più grandi, più luminose. I cartelli stradali avevano forme e colori che non riconoscevo. Le automobili scorrevano lungo la strada con linee morbide, lucide, quasi irreali. Perfino gli abiti delle persone mi sembravano fuori posto, come costumi venuti da una rappresentazione teatrale che nessuno mi aveva spiegato.",
        },
      },
      {
        type: $Enums.ArticleBlockType.PARAGRAPH,
        layout: $Enums.ArticleBlockLayout.DEFAULT,
        content: {
          text: "Poi qualcuno mi toccò una spalla.\n\nMi voltai di scatto.\n\nDavanti a me c’era una ragazza. Aveva uno sguardo curioso, forse preoccupato, forse solo sorpreso dal modo in cui ero vestito e dalle condizioni del mio viso.",
        },
      },
      {
        type: $Enums.ArticleBlockType.QUOTE,
        layout: $Enums.ArticleBlockLayout.DEFAULT,
        content: {
          text: "Tutto bene?",
          cite: "Alba",
        },
      },
      {
        type: $Enums.ArticleBlockType.PARAGRAPH,
        layout: $Enums.ArticleBlockLayout.DEFAULT,
        content: {
          text: "La sua voce mi riportò per un attimo al presente.\n\n«Sì, madame. Non faccia caso a me, sono solo di passaggio.»\n\nLei aggrottò la fronte.\n\n«Mi hai chiamata madame?»",
        },
      },
      {
        type: $Enums.ArticleBlockType.PARAGRAPH,
        layout: $Enums.ArticleBlockLayout.DEFAULT,
        content: {
          text: "La ragazza mi osservò meglio. Non sembrava convinta.\n\n«Okay… comunque sembri messo male. Sicuro di stare bene?»",
        },
      },
      {
        type: $Enums.ArticleBlockType.PARAGRAPH,
        layout: $Enums.ArticleBlockLayout.DEFAULT,
        content: {
          text: "Provai a spiegarle dell’incidente, dell’auto, dell’albero, del fatto che avrei raggiunto l’ospedale più vicino a piedi se solo mi avesse indicato la direzione. Le parole, però, uscivano da me come se appartenessero a un altro tempo, e forse era proprio così.",
        },
      },
      {
        type: $Enums.ArticleBlockType.PARAGRAPH,
        layout: $Enums.ArticleBlockLayout.DEFAULT,
        content: {
          text: "Lei mi interruppe.\n\n«Chiamami Alba. Solo Alba.»\n\nFu così che conobbi Alba.",
        },
      },
      {
        type: $Enums.ArticleBlockType.QUOTE,
        layout: $Enums.ArticleBlockLayout.DEFAULT,
        content: {
          text: "Forse non ero finito in un altro luogo. Forse ero finito in un altro tempo.",
          cite: "Jay",
        },
      },
    ],
  },
  {
    slug: "sentoleiche",
    title: "Sentoleiche",
    chapter: "Capitolo 3",
    date: "2023-10-27",
    displayDate: "27 ottobre 2023",
    narrativeDate: "17 marzo 2023 / estate 2023",
    coverUrl: "/images/covers/sentoleiche.jpg",
    linkedTrackSlug: "sentoleiche",
    linkedTrackTitle: "Sentoleiche",
    excerpt:
      "Jay scopre di essere nel 2023, trova rifugio in Alba e poi fugge nel bosco quando anche quel legame si spezza.",
    blocks: [
      {
        type: $Enums.ArticleBlockType.HEADING,
        layout: $Enums.ArticleBlockLayout.DEFAULT,
        content: { level: 2, text: "Sentoleiche" },
      },
      {
        type: $Enums.ArticleBlockType.PARAGRAPH,
        layout: $Enums.ArticleBlockLayout.DEFAULT,
        content: {
          text: "Dopo il primo incontro con Alba, iniziai a capire che il mondo attorno a me non mi apparteneva più.",
        },
      },
      {
        type: $Enums.ArticleBlockType.PARAGRAPH,
        layout: $Enums.ArticleBlockLayout.DEFAULT,
        content: {
          text: "Mi ero allontanato da lei e dal suono delle sirene dell’ambulanza con la convinzione di poter trovare una spiegazione da solo. Non volevo essere aiutato, non volevo essere interrogato, non volevo che qualcuno decidesse al posto mio cosa fare di quell’uomo ferito comparso dal nulla.",
        },
      },
      {
        type: $Enums.ArticleBlockType.PARAGRAPH,
        layout: $Enums.ArticleBlockLayout.DEFAULT,
        content: {
          text: "Camminai finché mi ritrovai davanti a un’edicola.\n\nI giornali erano esposti in fila, ordinati, pieni di nomi e immagini che non riconoscevo. Ne presi uno quasi per istinto, come se la carta stampata potesse restituirmi un punto fermo. Poi lessi la data.",
        },
      },
      {
        type: $Enums.ArticleBlockType.QUOTE,
        layout: $Enums.ArticleBlockLayout.DEFAULT,
        content: {
          text: "17 marzo 2023.",
          cite: "Il giornale",
        },
      },
      {
        type: $Enums.ArticleBlockType.PARAGRAPH,
        layout: $Enums.ArticleBlockLayout.DEFAULT,
        content: {
          text: "Rimasi senza fiato.\n\n2023?\n\nProvai a convincermi che ci fosse un errore. Una burla. Un’allucinazione. Forse l’incidente mi aveva lasciato in coma e tutto ciò che vedevo era soltanto il prodotto di una mente ferita.",
        },
      },
      {
        type: $Enums.ArticleBlockType.PARAGRAPH,
        layout: $Enums.ArticleBlockLayout.DEFAULT,
        content: {
          text: "La più assurda.\n\nAvevo attraversato quasi settant’anni.",
        },
      },
      {
        type: $Enums.ArticleBlockType.PARAGRAPH,
        layout: $Enums.ArticleBlockLayout.DEFAULT,
        content: {
          text: "Alba mi portò a casa sua. Nei mesi successivi mi accolse, mi aiutò a capire quel tempo impossibile, mi insegnò parole, gesti, abitudini e oggetti che all’inizio mi sembravano magia. Diventammo amici. Poi qualcosa di più.",
        },
      },
      {
        type: $Enums.ArticleBlockType.PARAGRAPH,
        layout: $Enums.ArticleBlockLayout.DEFAULT,
        content: {
          text: "Per un po’ mi illusi che lei potesse essere la costante del mio viaggio nel futuro.\n\nMi sbagliavo.",
        },
      },
      {
        type: $Enums.ArticleBlockType.PARAGRAPH,
        layout: $Enums.ArticleBlockLayout.DEFAULT,
        content: {
          text: "Alla fine dell’estate, Alba mi disse che il nostro rapporto era arrivato alla sua conclusione. Sarebbe partita presto per il Marocco. Disse che non ci saremmo più rivisti.",
        },
      },
      {
        type: $Enums.ArticleBlockType.PARAGRAPH,
        layout: $Enums.ArticleBlockLayout.DEFAULT,
        content: {
          text: "Attraversai il quartiere fino al confine. Poi presi il sentiero sterrato. Passai accanto alla mia automobile, ancora ferma contro l’albero come una prova lasciata lì dal tempo. Continuai oltre la campagna, senza una meta precisa, finché gli alberi diventarono più fitti e mi ritrovai dentro un bosco.",
        },
      },
      {
        type: $Enums.ArticleBlockType.QUOTE,
        layout: $Enums.ArticleBlockLayout.DEFAULT,
        content: {
          text: "Per la prima volta da quando ero arrivato nel futuro, non mi sentii soltanto perduto nel tempo. Mi sentii perduto davvero.",
          cite: "Jay",
        },
      },
    ],
  },
];

async function upsertMediaAsset(input: {
  url: string;
  alt: string;
  caption?: string;
}) {
  const existing = await db.mediaAsset.findFirst({
    where: {
      url: input.url,
      type: $Enums.MediaAssetType.IMAGE,
      provider: $Enums.MediaAssetProvider.LOCAL,
    },
  });

  if (existing) {
    return db.mediaAsset.update({
      where: {
        id: existing.id,
      },
      data: {
        alt: input.alt,
        caption: input.caption,
      },
    });
  }

  return db.mediaAsset.create({
    data: {
      type: $Enums.MediaAssetType.IMAGE,
      provider: $Enums.MediaAssetProvider.LOCAL,
      url: input.url,
      alt: input.alt,
      caption: input.caption,
    },
  });
}

async function upsertArticleKindDefinition() {
  await db.contentEntityKindDefinition.upsert({
    where: {
      type_key: {
        type: $Enums.ContentEntityType.ARTICLE,
        key: "DIARY_ENTRY",
      },
    },
    update: {
      label: "Diario di Jay",
      isEnabled: true,
    },
    create: {
      type: $Enums.ContentEntityType.ARTICLE,
      key: "DIARY_ENTRY",
      label: "Diario di Jay",
      isEnabled: true,
    },
  });
}

async function upsertRelatedContentSection(input: {
  relatedContentId: string;
  key: string;
}) {
  const existing = await db.relatedContentSection.findFirst({
    where: {
      relatedContentId: input.relatedContentId,
      key: input.key,
    },
    select: {
      id: true,
    },
  });

  const data = {
    title: "Dal Diario di Jay",
    description:
      "Capitoli narrativi collegati a questa parte del catalogo musicale.",
    layout: $Enums.RelatedContentLayout.RAIL,
    relationType: $Enums.ContentRelationType.RELATED,
    targetType: $Enums.ContentEntityType.ARTICLE,
    targetKindKey: "DIARY_ENTRY",
    maxItems: 6,
    priority: 60,
    order: 30,
    isPublic: true,
  };

  if (existing) {
    return db.relatedContentSection.update({
      where: {
        id: existing.id,
      },
      data,
    });
  }

  return db.relatedContentSection.create({
    data: {
      relatedContentId: input.relatedContentId,
      key: input.key,
      ...data,
    },
  });
}

async function ensureRelatedContentBlock(
  ownerEntityId: string,
  ownerTitle: string,
) {
  const existing = await db.relatedContent.findUnique({
    where: {
      ownerEntityId,
    },
  });

  if (existing) {
    await upsertRelatedContentSection({
      relatedContentId: existing.id,
      key: "diary-lore",
    });

    return existing;
  }

  const block = await db.relatedContent.create({
    data: {
      ownerEntityId,
      title: `Intorno a ${ownerTitle}`,
      description:
        "Contenuti narrativi, musicali e visuali collegati a questo elemento.",
      sourceMode: $Enums.RelatedContentSourceMode.AUTO,
    },
  });

  await upsertRelatedContentSection({
    relatedContentId: block.id,
    key: "diary-lore",
  });

  return block;
}

async function upsertRelation(input: {
  sourceEntityId: string;
  targetEntityId: string;
  priority: number;
  order: number;
  reason: string;
}) {
  const existing = await db.contentRelation.findFirst({
    where: {
      sourceEntityId: input.sourceEntityId,
      targetEntityId: input.targetEntityId,
      type: $Enums.ContentRelationType.RELATED,
    },
    select: {
      id: true,
    },
  });

  const data = {
    status: $Enums.ContentRelationStatus.APPROVED,
    isPublic: true,
    isFeatured: false,
    priority: input.priority,
    order: input.order,
    source: $Enums.ContentRelationSource.SEED,
    reason: input.reason,
  };

  if (existing) {
    return db.contentRelation.update({
      where: {
        id: existing.id,
      },
      data,
    });
  }

  return db.contentRelation.create({
    data: {
      sourceEntityId: input.sourceEntityId,
      targetEntityId: input.targetEntityId,
      type: $Enums.ContentRelationType.RELATED,
      ...data,
    },
  });
}

async function linkArticleToMusic(
  articleEntityId: string,
  seed: ArticleSeed,
  order: number,
) {
  const track = await db.track.findFirst({
    where: {
      slug: seed.linkedTrackSlug,
    },
    include: {
      release: true,
    },
    orderBy: {
      publishedAt: "desc",
    },
  });

  const release = await db.release.findFirst({
    where: {
      slug: seed.linkedTrackSlug,
    },
  });

  const targetKeys = new Set<string>();

  if (track) {
    targetKeys.add(`music:track:${track.id}`);
    targetKeys.add(`music:release:${track.releaseId}`);
  }

  if (release) {
    targetKeys.add(`music:release:${release.id}`);
  }

  for (const key of targetKeys) {
    const musicEntity = await db.contentEntity.findUnique({
      where: {
        key,
      },
    });

    if (!musicEntity) {
      continue;
    }

    await ensureRelatedContentBlock(musicEntity.id, musicEntity.title);

    await upsertRelation({
      sourceEntityId: musicEntity.id,
      targetEntityId: articleEntityId,
      priority: 75,
      order,
      reason: `Articolo del Diario collegato a ${seed.linkedTrackTitle}.`,
    });

    await upsertRelation({
      sourceEntityId: articleEntityId,
      targetEntityId: musicEntity.id,
      priority: 75,
      order,
      reason: `Collegamento musicale dell’articolo ${seed.title}.`,
    });
  }
}

async function seedArticle(seed: ArticleSeed, order: number) {
  const coverAsset = await upsertMediaAsset({
    url: seed.coverUrl,
    alt: `Cover di ${seed.title}`,
    caption: seed.title,
  });

  const blocksForHtml = seed.blocks.map((block) => ({
    ...block,
    content:
      block.type === $Enums.ArticleBlockType.IMAGE
        ? { ...block.content, assetId: coverAsset.id }
        : block.content,
  }));

  const mediaById = new Map([[coverAsset.id, coverAsset]]);
  const renderedHtml = renderArticleBlocksToHtml(blocksForHtml, mediaById);
  const publishedAt = new Date(`${seed.date}T00:00:00.000Z`);

  const article = await db.article.upsert({
    where: {
      slug: seed.slug,
    },
    update: {
      kind: $Enums.ArticleKind.DIARY_ENTRY,
      title: seed.title,
      subtitle: seed.chapter,
      excerpt: seed.excerpt,
      status: $Enums.ArticleStatus.PUBLISHED,
      coverAssetId: coverAsset.id,
      renderedHtml,
      renderedAt: new Date(),
      contentVersion: 1,
      metadata: {
        chapter: seed.chapter,
        displayDate: seed.displayDate,
        narrativeDate: seed.narrativeDate,
        linkedTrackSlug: seed.linkedTrackSlug,
        linkedTrackTitle: seed.linkedTrackTitle,
      },
      publishedAt,
    },
    create: {
      kind: $Enums.ArticleKind.DIARY_ENTRY,
      slug: seed.slug,
      title: seed.title,
      subtitle: seed.chapter,
      excerpt: seed.excerpt,
      status: $Enums.ArticleStatus.PUBLISHED,
      coverAssetId: coverAsset.id,
      renderedHtml,
      renderedAt: new Date(),
      contentVersion: 1,
      metadata: {
        chapter: seed.chapter,
        displayDate: seed.displayDate,
        narrativeDate: seed.narrativeDate,
        linkedTrackSlug: seed.linkedTrackSlug,
        linkedTrackTitle: seed.linkedTrackTitle,
      },
      publishedAt,
    },
  });

  await db.articleContentBlock.deleteMany({
    where: {
      articleId: article.id,
    },
  });

  await db.articleContentBlock.createMany({
    data: blocksForHtml.map((block, blockIndex) => ({
      articleId: article.id,
      type: block.type,
      layout: block.layout,
      order: blockIndex + 1,
      content: block.content,
      isPublic: true,
    })),
  });

  const articleEntity = await db.contentEntity.upsert({
    where: {
      key: `article:${article.id}`,
    },
    update: {
      type: $Enums.ContentEntityType.ARTICLE,
      kindKey: "DIARY_ENTRY",
      targetId: article.id,
      title: seed.title,
      description: seed.excerpt,
      href: `/diario-di-jay/${seed.slug}`,
      imageUrl: coverAsset.url,
      status: $Enums.ContentEntityStatus.PUBLISHED,
      publishedAt,
      metadata: {
        slug: seed.slug,
        kind: "DIARY_ENTRY",
        chapter: seed.chapter,
      },
    },
    create: {
      key: `article:${article.id}`,
      type: $Enums.ContentEntityType.ARTICLE,
      kindKey: "DIARY_ENTRY",
      targetId: article.id,
      title: seed.title,
      description: seed.excerpt,
      href: `/diario-di-jay/${seed.slug}`,
      imageUrl: coverAsset.url,
      status: $Enums.ContentEntityStatus.PUBLISHED,
      publishedAt,
      metadata: {
        slug: seed.slug,
        kind: "DIARY_ENTRY",
        chapter: seed.chapter,
      },
    },
  });

  await linkArticleToMusic(articleEntity.id, seed, order);
}

async function main() {
  const dbModule = await import("../src/lib/db");
  db = dbModule.db;

  await upsertArticleKindDefinition();

  for (let index = 0; index < articleSeeds.length; index += 1) {
    await seedArticle(articleSeeds[index], index + 1);
  }

  await db.$disconnect();

  console.log("Article seed completed.");
}

main().catch(async (error) => {
  console.error(error);

  if (db) {
    await db.$disconnect();
  }

  process.exit(1);
});
