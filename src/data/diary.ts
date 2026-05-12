export type DiaryEntry = {
  slug: string;
  chapter: string;
  title: string;
  date: string;
  displayDate: string;
  excerpt: string;
  linkedTrackSlug?: string;
  linkedTrackTitle?: string;
  cover?: string;
};

export const diaryEntries: DiaryEntry[] = [
  {
    slug: "dentro-una-fantasy",
    chapter: "Capitolo 1",
    title: "Dentro Una Fantasy",
    date: "2023-03-17",
    displayDate: "17 marzo 2023",
    linkedTrackSlug: "dentro-una-fantasy",
    linkedTrackTitle: "Dentro Una Fantasy",
    cover: "/images/covers/Copertina_DENTRO_UNA_FANTASY.jpg",
    excerpt:
      "Nel 1954, Luigi Jay Colombo vive una routine immutabile. Dopo un incidente inspiegabile, si ritrova lontano dalla sua epoca e inizia a cercare risposte.",
  },
  {
    slug: "da-domani",
    chapter: "Capitolo 2",
    title: "Da Domani",
    date: "2023-06-16",
    displayDate: "16 giugno 2023",
    linkedTrackSlug: "da-domani",
    linkedTrackTitle: "Da domani",
    cover: "/images/covers/Copertina_DA_DOMANI.jpg",
    excerpt:
      "Jay arriva in un quartiere che non riconosce: luci, automobili, vestiti e abitudini sembrano appartenere a un futuro impossibile. Qui incontra Alba.",
  },
  {
    slug: "sentoleiche",
    chapter: "Capitolo 3",
    title: "Sentoleiche",
    date: "2023-10-27",
    displayDate: "27 ottobre 2023",
    linkedTrackSlug: "sentoleiche",
    linkedTrackTitle: "Sentoleiche",
    cover: "/images/covers/Copertina_SENTOLEICHE.jpg",
    excerpt:
      "Dopo il primo incontro con Alba, Jay scopre di essere nel 2023. Il legame con lei sembra salvarlo, ma la perdita lo spinge a fuggire fino a perdersi nel bosco.",
  },
];

export const orderedDiaryEntries = [...diaryEntries].sort(
  (firstEntry, secondEntry) =>
    new Date(firstEntry.date).getTime() - new Date(secondEntry.date).getTime(),
);
