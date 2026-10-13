import { Link } from '../router/useRouter.ts';
import { useTheme } from '../context/ThemeContext.tsx';
import { ArrowRight, Film, Tv, Sparkles } from 'lucide-react';

export function Hero() {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <section
      className={`relative overflow-hidden transition-colors duration-300 ${
        isLight
          ? 'bg-[#FAF8F5] border-b border-black/8 text-[#18181B]'
          : 'bg-[#0B0C10] border-b border-[rgba(255,255,255,0.08)] text-[#E2E4E9]'
      }`}
    >
      {/* Background Photography with Measured Contrast Scrim */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src="/images/hero-hollywood.webp"
          alt="The illuminated historic facade and entrance of Grauman’s Chinese Theatre on Hollywood Boulevard at night"
          className={`w-full h-full object-cover object-center scale-105 transition-all duration-700 ease-out ${
            isLight
              ? 'opacity-20 filter contrast-[1.05] brightness-110 mix-blend-multiply'
              : 'filter brightness-[0.38] contrast-[1.1]'
          }`}
        />
        {/* Gradients to guarantee WCAG AA contrast and smooth transition */}
        <div
          className={`absolute inset-0 transition-all duration-500 ${
            isLight
              ? 'bg-gradient-to-t from-[#FAF8F5] via-[#FAF8F5]/85 to-transparent'
              : 'bg-gradient-to-t from-[#0B0C10] via-[#0B0C10]/60 to-transparent'
          }`}
        />
        <div
          className={`absolute inset-0 transition-all duration-500 ${
            isLight
              ? 'bg-gradient-to-r from-[#FAF8F5] via-[#FAF8F5]/90 to-[#FAF8F5]/25'
              : 'bg-gradient-to-r from-[#0B0C10] via-[#0B0C10]/70 to-transparent'
          }`}
        />
      </div>

      {/* Selected Element: div:nth-of-type(2) inside section:nth-of-type(1) */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
        <div className="max-w-3xl">
          {/* Subtle Editorial Kicker - Unboxed */}
          <div
            className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] mb-4 transition-colors duration-200 ${
              isLight ? 'text-[#9B7829]' : 'text-[#C5A059]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>English Movie Reviews & Screen Arts Journal</span>
          </div>

          {/* Hero Headline with text-wrap: balance */}
          <h1
            className={`font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.12] mb-6 [text-wrap:balance] transition-colors duration-200 ${
              isLight ? 'text-[#09090B]' : 'text-[#F9FAFB]'
            }`}
          >
            The Best Movies of All Time English & Landmark Masterpieces
          </h1>

          {/* Subtitle Introduction */}
          <p
            className={`text-lg sm:text-xl leading-relaxed mb-8 max-w-2xl font-light transition-colors duration-200 ${
              isLight ? 'text-[#3F3F46]' : 'text-[#D1D5DB]'
            }`}
          >
            Explore the best movies of all time english alongside the best series of all time english. Our in-depth english movie reviews interrogate the screenwriting, practical craft, moral architecture, and cultural impact that shaped modern cinema and prestige television.
          </p>

          {/* Direct Category Access & Jump Actions */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href="/movies"
              className={`inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold rounded-lg transition-all shadow-lg ${
                isLight
                  ? 'bg-[#9B7829] hover:bg-[#825E18] text-white shadow-[#9B7829]/25 hover:shadow-[#9B7829]/35'
                  : 'bg-[#C5A059] hover:bg-[#DFBA73] text-[#0B0C10] shadow-[#C5A059]/20'
              }`}
            >
              <Film className="w-4 h-4" />
              <span>Explore Best Movies of All Time</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/series"
              className={`inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold rounded-lg transition-all ${
                isLight
                  ? 'bg-white hover:bg-[#F3EFE9] text-[#18181B] border border-black/10 shadow-sm'
                  : 'bg-[#161824] hover:bg-[#202434] text-[#E5E7EB] border border-[rgba(255,255,255,0.12)]'
              }`}
            >
              <Tv
                className={`w-4 h-4 ${
                  isLight ? 'text-[#9B7829]' : 'text-[#C5A059]'
                }`}
              />
              <span>Best Series of All Time English</span>
            </Link>
          </div>

          {/* Genuine Photography Attribution Notice */}
          <div
            className={`mt-12 pt-6 border-t flex items-center gap-2 text-xs transition-colors duration-200 ${
              isLight
                ? 'border-black/10 text-[#71717A]'
                : 'border-[rgba(255,255,255,0.08)] text-[#9CA3AF]'
            }`}
          >
            <span
              className={`font-medium ${
                isLight ? 'text-[#18181B]' : 'text-[#D1D5DB]'
              }`}
            >
              Archival Plate:
            </span>
            <span>TCL Chinese Theatre (Grauman’s), Hollywood Boulevard</span>
            <span
              aria-hidden="true"
              className={isLight ? 'text-[#A1A1AA]' : 'text-[#6B7280]'}
            >
              ·
            </span>
            <span>Photograph by Kent Kanouse (CC BY 2.0 via Wikimedia Commons)</span>
          </div>
        </div>
      </div>
    </section>
  );
}
