import { useState, useEffect } from 'react';
import { Article } from '../data/types.ts';
import { getRelatedArticles } from '../data/articles/index.ts';
import { SEOHead } from '../components/SEOHead.tsx';
import { ArticleCard } from '../components/ArticleCard.tsx';
import { Link } from '../router/useRouter.ts';
import {
  ChevronRight,
  Clock,
  Calendar,
  AlertTriangle,
  ArrowLeft,
  Share2,
  Check,
  Film,
  Tv,
  List,
  ExternalLink
} from 'lucide-react';

function renderRichParagraph(text: string) {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  if (!linkRegex.test(text)) {
    return text;
  }
  linkRegex.lastIndex = 0;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = linkRegex.exec(text)) !== null) {
    const [fullMatch, anchorText, url] = match;
    const matchIndex = match.index;

    if (matchIndex > lastIndex) {
      parts.push(text.substring(lastIndex, matchIndex));
    }

    const isInternal = url.startsWith('/');
    if (isInternal) {
      parts.push(
        <Link
          key={`${matchIndex}-${url}`}
          href={url}
          className="text-[#DFBA73] hover:text-[#FFF8E7] underline decoration-[#C5A059]/60 hover:decoration-[#DFBA73] underline-offset-4 font-medium transition-colors"
        >
          {anchorText}
        </Link>
      );
    } else {
      parts.push(
        <a
          key={`${matchIndex}-${url}`}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#DFBA73] hover:text-[#FFF8E7] underline decoration-[#C5A059]/60 hover:decoration-[#DFBA73] underline-offset-4 font-medium transition-colors inline-flex items-center gap-0.5"
        >
          <span>{anchorText}</span>
          <ExternalLink className="w-3 h-3 inline-block ml-0.5 opacity-80" aria-hidden="true" />
        </a>
      );
    }

    lastIndex = matchIndex + fullMatch.length;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts;
}

interface ArticlePageProps {
  article: Article;
}

export function ArticlePage({ article }: ArticlePageProps) {
  const [activeSection, setActiveSection] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [tocOpen, setTocOpen] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);

  const related = getRelatedArticles(article.slug, 3);

  // Track reading completion progress (0% - 100%)
  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (scrollHeight > 0) {
        const progress = Math.min(100, Math.max(0, (scrollTop / scrollHeight) * 100));
        setReadingProgress(progress);
      }
    };

    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);
    updateProgress();

    return () => {
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
    };
  }, [article.slug]);

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const headings = article.tableOfContents.map((item) => document.getElementById(item.id));
      const scrollPos = window.scrollY + 180;

      for (let i = headings.length - 1; i >= 0; i--) {
        const el = headings[i];
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(article.tableOfContents[i].id);
          return;
        }
      }
      if (article.tableOfContents.length > 0) {
        setActiveSection(article.tableOfContents[0].id);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [article]);

  const handleShare = async () => {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const categoryRoute = article.category === 'Movies' ? '/movies' : '/series';

  const breadcrumbs = [
    { name: 'Home', url: 'https://cinefolio.org/' },
    { name: article.category, url: `https://cinefolio.org${categoryRoute}` },
    { name: article.title, url: `https://cinefolio.org/articles/${article.slug}` }
  ];

  return (
    <>
      {/* Subtle, fixed-position reading progress bar at top of viewport */}
      <div
        className="fixed top-0 left-0 right-0 h-[3px] bg-black/40 z-50 pointer-events-none"
        role="progressbar"
        aria-valuenow={Math.round(readingProgress)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Article completion progress"
      >
        <div
          className="h-full bg-gradient-to-r from-[#B38728] via-[#C5A059] to-[#DFBA73] transition-all duration-75 ease-out shadow-[0_0_8px_rgba(197,160,89,0.7)]"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      <SEOHead
        title={article.seoTitle || `${article.title} — Cinefolio`}
        description={article.seoDescription || article.description}
        canonicalUrl={`https://cinefolio.org/articles/${article.slug}`}
        type="article"
        article={article}
        breadcrumb={breadcrumbs}
      />

      <article className="min-h-screen bg-[#0B0C10] pb-24">
        {/* Article Header & Title Block */}
        <header className="border-b border-[rgba(255,255,255,0.06)] bg-[#0E1017] pt-8 pb-12 sm:pb-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb Navigation Trail */}
            <nav aria-label="Breadcrumbs" className="flex items-center gap-2 text-xs text-[#9CA3AF] mb-6 flex-wrap">
              <Link href="/" className="hover:text-[#F3F4F6] transition-colors">
                Home
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-[#6B7280]" />
              <Link href={categoryRoute} className="hover:text-[#F3F4F6] transition-colors">
                {article.category}
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-[#6B7280]" />
              <span className="text-[#D1D5DB] truncate max-w-xs sm:max-w-md font-medium">
                {article.title}
              </span>
            </nav>

            {/* Quiet Unboxed Category & Metadata */}
            <div className="flex items-center gap-2.5 text-xs text-[#9CA3AF] mb-4 flex-wrap">
              <Link
                href={categoryRoute}
                className="font-semibold uppercase tracking-[0.2em] text-[#DFBA73] hover:text-[#FFF8E7] transition-colors flex items-center gap-1.5"
              >
                {article.category === 'Movies' ? (
                  <Film className="w-3.5 h-3.5" />
                ) : (
                  <Tv className="w-3.5 h-3.5" />
                )}
                <span>{article.category}</span>
              </Link>
              <span aria-hidden="true" className="text-[#6B7280]">·</span>
              <span className="flex items-center gap-1 text-[#9CA3AF]">
                <Calendar className="w-3.5 h-3.5" />
                <span>{article.publishedDate}</span>
              </span>
              <span aria-hidden="true" className="text-[#6B7280]">·</span>
              <span className="flex items-center gap-1 text-[#9CA3AF]">
                <Clock className="w-3.5 h-3.5" />
                <span>{article.readingTime}</span>
              </span>
              <span aria-hidden="true" className="text-[#6B7280]">·</span>
              <span className="tabular-nums font-mono text-[11px] text-[#A1A1AA]">
                {article.wordCount.toLocaleString()} words
              </span>
            </div>

            {/* Main H1 Title */}
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#F9FAFB] tracking-tight leading-[1.15] mb-4 [text-wrap:balance]">
              {article.title}
            </h1>

            {/* Compelling Subtitle */}
            <p className="text-lg sm:text-xl text-[#DFBA73] font-light leading-relaxed max-w-3xl mb-8">
              {article.subtitle}
            </p>

            {/* Share / Back Quick Action Bar */}
            <div className="flex items-center justify-between border-t border-[rgba(255,255,255,0.08)] pt-4 text-xs text-[#9CA3AF]">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#9CA3AF] hover:text-[#F3F4F6] transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Overview</span>
              </Link>

              <button
                onClick={handleShare}
                type="button"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#161824] hover:bg-[#1E2230] border border-[rgba(255,255,255,0.08)] text-[#D1D5DB] transition-colors cursor-pointer"
                title="Copy link to clipboard"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#10B981]" />
                    <span className="text-[#10B981] font-medium">Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>Share Essay</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Featured Image Section with Provenance Credit */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8 mb-12">
          <figure className="rounded-xl overflow-hidden border border-[rgba(255,255,255,0.09)] bg-[#12141C] shadow-2xl">
            <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full bg-[#181B26]">
              <img
                src={article.featuredImage}
                alt={article.imageAlt}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>
            <figcaption className="p-3.5 sm:px-5 sm:py-3 bg-[#12141C] border-t border-[rgba(255,255,255,0.06)] flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs text-[#9CA3AF]">
              <span className="font-medium text-[#D1D5DB]">{article.imageAlt}</span>
              <span className="text-[11px] text-[#6B7280]">
                {article.imageCredit}
              </span>
            </figcaption>
          </figure>
        </section>

        {/* Article Body Grid (Sidebar + Main Column) */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Sidebar: Table of Contents & Fact Sheet (Desktop Sticky) */}
            <aside className="lg:col-span-4 order-2 lg:order-1">
              {/* Mobile Table of Contents Dropdown */}
              <div className="lg:hidden mb-8 border border-[rgba(255,255,255,0.08)] bg-[#12141C] rounded-xl p-4">
                <button
                  onClick={() => setTocOpen(!tocOpen)}
                  type="button"
                  className="w-full flex items-center justify-between text-sm font-serif font-bold text-[#F3F4F6]"
                >
                  <span className="flex items-center gap-2">
                    <List className="w-4 h-4 text-[#C5A059]" />
                    <span>Table of Contents ({article.tableOfContents.length} Sections)</span>
                  </span>
                  <span className="text-xs font-sans text-[#C5A059]">
                    {tocOpen ? 'Hide' : 'Show'}
                  </span>
                </button>
                {tocOpen && (
                  <nav className="mt-4 pt-3 border-t border-[rgba(255,255,255,0.08)] space-y-2 text-xs">
                    {article.tableOfContents.map((item) => (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        onClick={() => setTocOpen(false)}
                        className={`block py-1 transition-colors leading-relaxed ${
                          activeSection === item.id
                            ? 'text-[#DFBA73] font-semibold pl-2 border-l border-[#C5A059]'
                            : 'text-[#9CA3AF] hover:text-[#F3F4F6]'
                        }`}
                      >
                        {item.title}
                      </a>
                    ))}
                  </nav>
                )}
              </div>

              {/* Desktop Sticky Sidebar */}
              <div className="hidden lg:block sticky top-28 space-y-6">
                {/* Table of Contents Container */}
                <div className="border border-[rgba(255,255,255,0.08)] bg-[#12141C] rounded-xl p-5 shadow-lg">
                  <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-[#E5E7EB] mb-4 flex items-center gap-2">
                    <List className="w-4 h-4 text-[#C5A059]" />
                    <span>Table of Contents</span>
                  </h3>
                  <nav className="space-y-1.5 text-xs">
                    {article.tableOfContents.map((item) => {
                      const isActive = activeSection === item.id;
                      return (
                        <a
                          key={item.id}
                          href={`#${item.id}`}
                          className={`block py-1.5 transition-all leading-normal rounded px-2 ${
                            isActive
                              ? 'text-[#DFBA73] font-medium bg-[#1A1D2A] border-l-2 border-[#C5A059]'
                              : 'text-[#9CA3AF] hover:text-[#F3F4F6] hover:bg-[#161824]'
                          }`}
                        >
                          {item.title}
                        </a>
                      );
                    })}
                  </nav>
                </div>

                {/* Production Fact Sheet */}
                <div className="border border-[rgba(255,255,255,0.08)] bg-[#12141C] rounded-xl p-5">
                  <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-[#E5E7EB] mb-4">
                    Production Dossier
                  </h3>
                  <dl className="space-y-3 text-xs">
                    <div>
                      <dt className="text-[#6B7280] uppercase tracking-wider font-semibold text-[10px]">
                        Director / Creator
                      </dt>
                      <dd className="text-[#D1D5DB] font-medium mt-0.5">
                        {article.factSheet.directorOrCreator}
                      </dd>
                    </div>

                    <div>
                      <dt className="text-[#6B7280] uppercase tracking-wider font-semibold text-[10px]">
                        Network / Studio
                      </dt>
                      <dd className="text-[#D1D5DB] font-medium mt-0.5">
                        {article.factSheet.networkOrStudio}
                      </dd>
                    </div>

                    <div>
                      <dt className="text-[#6B7280] uppercase tracking-wider font-semibold text-[10px]">
                        Release Window
                      </dt>
                      <dd className="text-[#D1D5DB] font-medium mt-0.5">
                        {article.factSheet.releaseYear}
                      </dd>
                    </div>

                    <div>
                      <dt className="text-[#6B7280] uppercase tracking-wider font-semibold text-[10px]">
                        Scope / Format
                      </dt>
                      <dd className="text-[#D1D5DB] font-medium mt-0.5">
                        {article.factSheet.runtimeOrSeasons}
                      </dd>
                    </div>

                    <div>
                      <dt className="text-[#6B7280] uppercase tracking-wider font-semibold text-[10px]">
                        Key Accolades
                      </dt>
                      <dd className="text-[#DFBA73] mt-0.5 leading-relaxed">
                        {article.factSheet.accolades}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </aside>

            {/* Right Column: Full Long-Form Essay */}
            <main className="lg:col-span-8 order-1 lg:order-2">
              {/* Spoiler Warning Notice */}
              <div
                role="note"
                aria-label="Spoiler Warning"
                className="mb-8 p-4 rounded-xl bg-[#1C1812] border border-[#C5A059]/30 flex items-start gap-3.5 text-xs text-[#E5E7EB]"
              >
                <AlertTriangle className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <span className="font-bold text-[#DFBA73] mr-1.5">Editorial Notice:</span>
                  {article.spoilerWarning}
                </div>
              </div>

              {/* Lead Paragraph with Elegant Styling */}
              <div className="prose-editorial mb-8">
                <p className="text-xl sm:text-2xl text-[#E5E7EB] font-serif leading-relaxed italic border-b border-[rgba(255,255,255,0.08)] pb-8">
                  &ldquo;{article.leadIntro}&rdquo;
                </p>
              </div>

              {/* Main Article Sections */}
              <div className="prose-editorial">
                {article.sections.map((section) => (
                  <section key={section.id} id={section.id} className="scroll-mt-28">
                    {section.heading && (
                      section.headingLevel === 3 ? (
                        <h3>{section.heading}</h3>
                      ) : (
                        <h2>{section.heading}</h2>
                      )
                    )}

                    {section.paragraphs.map((para, idx) => (
                      <p key={idx}>{renderRichParagraph(para)}</p>
                    ))}

                    {section.image && (
                      <figure className="my-8 rounded-xl overflow-hidden border border-[rgba(255,255,255,0.08)] bg-[#12141C]">
                        <img
                          src={section.image.src}
                          alt={section.image.alt}
                          className="w-full h-auto object-cover"
                          loading="lazy"
                        />
                        <figcaption className="p-3 text-xs text-[#9CA3AF] flex flex-col sm:flex-row justify-between gap-1 border-t border-[rgba(255,255,255,0.06)]">
                          <span>{section.image.caption}</span>
                          <span className="text-[#6B7280]">{section.image.credit}</span>
                        </figcaption>
                      </figure>
                    )}

                    {section.pullquote && (
                      <blockquote>
                        <p className="font-serif text-lg text-[#F3F4F6] not-italic">
                          {section.pullquote}
                        </p>
                      </blockquote>
                    )}
                  </section>
                ))}
              </div>

              {/* Tags Section */}
              <div className="mt-14 pt-8 border-t border-[rgba(255,255,255,0.08)]">
                <span className="text-xs uppercase tracking-wider text-[#6B7280] font-semibold block mb-3">
                  Archival Index Tags
                </span>
                <div className="flex flex-wrap gap-2 text-xs text-[#9CA3AF]">
                  {article.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded bg-[#161824] border border-[rgba(255,255,255,0.07)]"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </main>
          </div>
        </div>

        {/* Related Articles Section */}
        <section className="mt-20 pt-16 border-t border-[rgba(255,255,255,0.08)] bg-[#0C0E14]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#C5A059] block mb-1">
                  Further Reading
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#F3F4F6]">
                  Related Retrospectives in the Canon
                </h3>
              </div>
              <Link
                href={categoryRoute}
                className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-[#C5A059] hover:text-[#DFBA73] transition-colors"
              >
                <span>Browse all {article.category}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((item) => (
                <ArticleCard key={item.id} article={item} />
              ))}
            </div>
          </div>
        </section>
      </article>
    </>
  );
}
