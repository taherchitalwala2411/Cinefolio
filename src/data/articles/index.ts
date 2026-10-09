import { Article, Category } from '../types.ts';
import { gameOfThronesArticle } from './gameOfThrones.ts';
import { strangerThingsArticle } from './strangerThings.ts';
import { harryPotterArticle } from './harryPotter.ts';
import { theDarkKnightArticle } from './theDarkKnight.ts';
import { breakingBadArticle } from './breakingBad.ts';
import { lordOfTheRingsArticle } from './lordOfTheRings.ts';
import { titanicArticle } from './titanic.ts';
import { friendsArticle } from './friends.ts';
import { jurassicParkArticle } from './jurassicPark.ts';
import { shawshankRedemptionArticle } from './shawshankRedemption.ts';

export const allArticles: Article[] = [
  gameOfThronesArticle,
  strangerThingsArticle,
  harryPotterArticle,
  theDarkKnightArticle,
  breakingBadArticle,
  lordOfTheRingsArticle,
  titanicArticle,
  friendsArticle,
  jurassicParkArticle,
  shawshankRedemptionArticle
];

export function getArticleBySlug(slug: string): Article | undefined {
  return allArticles.find(article => article.slug === slug);
}

export function getArticlesByCategory(category: Category): Article[] {
  return allArticles.filter(article => article.category === category);
}

export function getFeaturedArticles(): Article[] {
  // Select 3 premier flagship essays across movies and series
  return [theDarkKnightArticle, gameOfThronesArticle, lordOfTheRingsArticle];
}

export function getRelatedArticles(currentSlug: string, limit: number = 3): Article[] {
  const current = getArticleBySlug(currentSlug);
  if (!current) return allArticles.slice(0, limit);

  // Match same category first, then others
  const sameCategory = allArticles.filter(
    a => a.slug !== currentSlug && a.category === current.category
  );
  const differentCategory = allArticles.filter(
    a => a.slug !== currentSlug && a.category !== current.category
  );

  return [...sameCategory, ...differentCategory].slice(0, limit);
}

export function searchArticles(query: string): Article[] {
  const q = query.trim().toLowerCase();
  if (!q) return allArticles;

  return allArticles.filter(article => {
    const inTitle = article.title.toLowerCase().includes(q);
    const inSubtitle = article.subtitle.toLowerCase().includes(q);
    const inDescription = article.description.toLowerCase().includes(q);
    const inTags = article.tags.some(tag => tag.toLowerCase().includes(q));
    const inDirector = article.factSheet.directorOrCreator.toLowerCase().includes(q);
    const inCast = article.factSheet.leadCast.some(c => c.toLowerCase().includes(q));
    const inContent = article.sections.some(s => 
      s.paragraphs.some(p => p.toLowerCase().includes(q))
    );

    return inTitle || inSubtitle || inDescription || inTags || inDirector || inCast || inContent;
  });
}
