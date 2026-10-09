import { useState } from 'react';
import { Hero } from '../components/Hero.tsx';
import { ArticleCard } from '../components/ArticleCard.tsx';
import { SEOHead } from '../components/SEOHead.tsx';
import { allArticles, getFeaturedArticles, getArticlesByCategory } from '../data/articles/index.ts';
import { Category } from '../data/types.ts';
import { Film, Tv, BookOpen, Layers } from 'lucide-react';

export function HomePage() {
  const [filter, setFilter] = useState<'All' | Category>('All');

  const featured = getFeaturedArticles();
  const filteredArticles = filter === 'All' ? allArticles : getArticlesByCategory(filter);

  return (
    <>
      <SEOHead
        title="Cinefolio — Critical Essays on Hollywood Movies & Television"
        description="An independent film journal dedicated to in-depth retrospective essays, production analysis, and critical studies of Hollywood's defining films and television series."
      />

      {/* Hero Section */}
      <Hero />

      {/* Publication Introduction Strip */}
      <section className="border-b border-[rgba(255,255,255,0.06)] bg-[#0E1017]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-[#181B26] border border-[#C5A059]/30 flex items-center justify-center text-[#C5A059] shrink-0">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-[#F3F4F6] text-base mb-1">
                  Exhaustive Long-Form Essays
                </h3>
                <p className="text-xs text-[#9CA3AF] leading-relaxed">
                  Every retrospective averages 2,000 words of deeply researched analysis covering narrative architecture, themes, and screenwriting.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-[#181B26] border border-[#C5A059]/30 flex items-center justify-center text-[#C5A059] shrink-0">
                <Film className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-[#F3F4F6] text-base mb-1">
                  Behind-the-Scenes Production Craft
                </h3>
                <p className="text-xs text-[#9CA3AF] leading-relaxed">
                  Deep dives into practical animatronics, cinematography, IMAX camera rigs, and symphonic leitmotif scores.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-[#181B26] border border-[#C5A059]/30 flex items-center justify-center text-[#C5A059] shrink-0">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-[#F3F4F6] text-base mb-1">
                  Authentic Photographic Archives
                </h3>
                <p className="text-xs text-[#9CA3AF] leading-relaxed">
                  Strictly genuine photographs, real studio sets, and verified filming locations from museum and public domain archives.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Articles Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="mb-10">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#C5A059] mb-2">
            <span>Curator&apos;s Selection</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#F9FAFB] tracking-tight">
            Featured Retrospectives
          </h2>
          <p className="text-sm text-[#9CA3AF] mt-2 max-w-xl">
            Flagship essays interrogating defining turning points in twentieth and twenty-first century screen arts.
          </p>
        </div>

        {/* Lead Featured Article */}
        <div className="mb-8">
          <ArticleCard article={featured[0]} featured={true} />
        </div>

        {/* Secondary Featured Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {featured.slice(1).map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </section>

      {/* Latest Articles Section with Interactive Filter Tabs */}
      <section className="border-t border-[rgba(255,255,255,0.08)] bg-[#0C0E14] py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#C5A059] mb-2">
                <span>The Canon Archive</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#F9FAFB] tracking-tight">
                All 10 Comprehensive Essays
              </h2>
              <p className="text-sm text-[#9CA3AF] mt-2">
                Browse our complete collection of exhaustive Hollywood movie and television retrospectives.
              </p>
            </div>

            {/* Category Segmented Control (Interactive Filter Buttons) */}
            <div className="flex items-center p-1 bg-[#151722] border border-[rgba(255,255,255,0.08)] rounded-lg shrink-0 self-start sm:self-auto">
              <button
                onClick={() => setFilter('All')}
                type="button"
                className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap cursor-pointer ${
                  filter === 'All'
                    ? 'bg-[#C5A059] text-[#0B0C10] font-semibold shadow-sm'
                    : 'text-[#9CA3AF] hover:text-[#F3F4F6]'
                }`}
              >
                All (10)
              </button>
              <button
                onClick={() => setFilter('Movies')}
                type="button"
                className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap cursor-pointer ${
                  filter === 'Movies'
                    ? 'bg-[#C5A059] text-[#0B0C10] font-semibold shadow-sm'
                    : 'text-[#9CA3AF] hover:text-[#F3F4F6]'
                }`}
              >
                <Film className="w-3.5 h-3.5" />
                <span>Movies (6)</span>
              </button>
              <button
                onClick={() => setFilter('TV Series')}
                type="button"
                className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap cursor-pointer ${
                  filter === 'TV Series'
                    ? 'bg-[#C5A059] text-[#0B0C10] font-semibold shadow-sm'
                    : 'text-[#9CA3AF] hover:text-[#F3F4F6]'
                }`}
              >
                <Tv className="w-3.5 h-3.5" />
                <span>TV Series (4)</span>
              </button>
            </div>
          </div>

          {/* Article Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
