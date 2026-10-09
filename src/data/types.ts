export type Category = 'Movies' | 'TV Series';

export interface TocItem {
  id: string;
  title: string;
  level: 2 | 3;
}

export interface ArticleSection {
  id: string;
  heading?: string;
  headingLevel?: 2 | 3;
  paragraphs: string[];
  pullquote?: string;
  image?: {
    src: string;
    alt: string;
    caption: string;
    credit: string;
  };
}

export interface ArticleFactSheet {
  directorOrCreator: string;
  leadCast: string[];
  releaseYear: string;
  networkOrStudio: string;
  runtimeOrSeasons: string;
  accolades: string;
  genre: string;
}

export interface Article {
  id: string;
  slug: string; // e.g. "game-of-thrones"
  title: string;
  subtitle: string;
  category: Category;
  description: string;
  publishedDate: string;
  readingTime: string;
  wordCount: number;
  featuredImage: string;
  imageAlt: string;
  imageCredit: string;
  imageSourceUrl: string;
  spoilerWarning: string;
  leadIntro: string;
  factSheet: ArticleFactSheet;
  tableOfContents: TocItem[];
  sections: ArticleSection[];
  tags: string[];
  seoTitle?: string;
  seoDescription?: string;
}
