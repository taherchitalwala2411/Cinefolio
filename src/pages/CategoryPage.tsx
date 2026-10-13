import { Category } from '../data/types.ts';
import { getArticlesByCategory } from '../data/articles/index.ts';
import { ArticleCard } from '../components/ArticleCard.tsx';
import { SEOHead } from '../components/SEOHead.tsx';
import { Link } from '../router/useRouter.ts';
import { Film, Tv, ChevronRight } from 'lucide-react';

interface CategoryPageProps {
  category: Category;
}

export function CategoryPage({ category }: CategoryPageProps) {
  const articles = getArticlesByCategory(category);
  const isMovies = category === 'Movies';

  const title = isMovies
    ? 'Best Movies of All Time English: Reviews & Retrospectives'
    : 'Best Series of All Time English: Television Retrospectives';

  const description = isMovies
    ? 'Explore comprehensive English movie reviews on the best movies of all time English, including The Dark Knight, Titanic, The Lord of the Rings, and Jurassic Park.'
    : 'Exhaustive critical studies exploring the best series of all time English, including Game of Thrones, Breaking Bad, Stranger Things, and Friends.';

  const totalWords = articles.reduce((acc, curr) => acc + curr.wordCount, 0);

  return (
    <>
      <SEOHead
        title={`${title} — Cinefolio`}
        description={description}
        canonicalUrl={`https://cinefolio.org/${isMovies ? 'movies' : 'series'}`}
        breadcrumb={[
          { name: 'Home', url: 'https://cinefolio.org/' },
          { name: category, url: `https://cinefolio.org/${isMovies ? 'movies' : 'series'}` }
        ]}
      />

      <div className="min-h-screen bg-[#0B0C10] pb-24">
        {/* Header Hero Banner */}
        <header className="border-b border-[rgba(255,255,255,0.08)] bg-[#0E1017] py-14 sm:py-18">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumbs" className="flex items-center gap-2 text-xs text-[#9CA3AF] mb-4">
              <Link href="/" className="hover:text-white transition-colors">
                Home
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-[#6B7280]" />
              <span className="text-[#DFBA73] font-medium">{category}</span>
            </nav>

            <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#C5A059] mb-3">
              {isMovies ? <Film className="w-4 h-4" /> : <Tv className="w-4 h-4" />}
              <span>Curated Department</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#F9FAFB] tracking-tight mb-4">
              {isMovies ? 'Best Movies of All Time English' : 'Best Series of All Time English'}
            </h1>

            <p className="text-base sm:text-lg text-[#9CA3AF] max-w-2xl leading-relaxed font-light mb-8">
              {isMovies
                ? 'Comprehensive English movie reviews on the best movies of all time English, analyzing visionary directing, technical breakthroughs, and storytelling accomplishments.'
                : 'In-depth retrospective studies exploring the best series of all time English, dissecting character transformations, writers’ rooms, and prestige television milestones.'}
            </p>

            {/* Department Metric Badges - Unboxed zero-pill text */}
            <div className="flex items-center gap-4 text-xs text-[#9CA3AF] pt-4 border-t border-[rgba(255,255,255,0.06)] flex-wrap">
              <span>
                <strong className="text-[#F3F4F6] font-semibold">{articles.length}</strong> {isMovies ? 'Films Analyzed' : 'Series Analyzed'}
              </span>
              <span aria-hidden="true" className="text-[#6B7280]">·</span>
              <span>
                <strong className="text-[#F3F4F6] font-semibold tabular-nums">{totalWords.toLocaleString()}</strong> Total Words of Criticism
              </span>
              <span aria-hidden="true" className="text-[#6B7280]">·</span>
              <span>
                <strong className="text-[#F3F4F6] font-semibold">100%</strong> Verified Archival Photography
              </span>
            </div>
          </div>
        </header>

        {/* Articles Grid */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </main>
      </div>
    </>
  );
}
