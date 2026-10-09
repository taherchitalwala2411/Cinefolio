import { useState } from 'react';
import { Article } from '../data/types.ts';
import { Link } from '../router/useRouter.ts';
import { ArrowUpRight } from 'lucide-react';

interface ArticleCardProps {
  article: Article;
  featured?: boolean;
}

export function ArticleCard({ article, featured = false }: ArticleCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <article
      className={`group relative flex flex-col bg-[#12141C] border border-[rgba(255,255,255,0.07)] hover:border-[#C5A059]/40 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-black/50 ${
        featured ? 'md:grid md:grid-cols-12 md:gap-8' : ''
      }`}
    >
      {/* Clickable Card Overlay */}
      <Link
        href={`/articles/${article.slug}`}
        className="absolute inset-0 z-10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A059] rounded-xl"
        ariaLabel={`Read essay: ${article.title}`}
      >
        <span className="sr-only">Read article: {article.title}</span>
      </Link>

      {/* Image container */}
      <div
        className={`relative overflow-hidden bg-[#181B26] ${
          featured ? 'md:col-span-7 h-72 sm:h-96 md:h-full min-h-[300px]' : 'aspect-[16/10] w-full'
        }`}
      >
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 animate-pulse bg-[#1A1D2A]" />
        )}

        <img
          src={article.featuredImage}
          alt={article.imageAlt}
          loading="lazy"
          referrerPolicy="no-referrer"
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
          className={`w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Subtle Vignette Gradient for Depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#12141C] via-transparent to-transparent opacity-60" />

        {/* Category kicker overlay tag (Clean unboxed text) */}
        <div className="absolute top-3.5 left-4 z-20">
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#DFBA73] drop-shadow-md">
            {article.category}
          </span>
        </div>
      </div>

      {/* Content container */}
      <div
        className={`flex flex-col flex-1 p-5 sm:p-6 justify-between ${
          featured ? 'md:col-span-5 md:py-8 md:pr-8 md:pl-2' : ''
        }`}
      >
        <div>
          {/* Metadata line: Zero-pill discipline with typographical separators */}
          <div className="flex items-center gap-2 text-xs text-[#9CA3AF] mb-2.5 flex-wrap">
            <span>{article.publishedDate}</span>
            <span aria-hidden="true" className="text-[#6B7280]">·</span>
            <span>{article.readingTime}</span>
            <span aria-hidden="true" className="text-[#6B7280]">·</span>
            <span className="tabular-nums font-mono text-[11px] text-[#A1A1AA]">
              {article.wordCount.toLocaleString()} words
            </span>
          </div>

          {/* Heading */}
          <h3
            className={`font-serif font-bold text-[#F3F4F6] group-hover:text-[#DFBA73] transition-colors leading-snug tracking-tight mb-2.5 ${
              featured ? 'text-2xl sm:text-3xl lg:text-4xl' : 'text-xl sm:text-2xl'
            }`}
          >
            {article.title}
          </h3>

          {/* Subtitle / Description */}
          <p className="text-sm text-[#9CA3AF] line-clamp-3 leading-relaxed mb-4">
            {article.description}
          </p>
        </div>

        {/* Bottom Action Indicator */}
        <div className="pt-3 border-t border-[rgba(255,255,255,0.06)] flex items-center justify-between text-xs font-semibold text-[#C5A059] group-hover:text-[#DFBA73] transition-colors">
          <span className="uppercase tracking-widest text-[11px]">Read Full Essay</span>
          <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </div>
      </div>
    </article>
  );
}
