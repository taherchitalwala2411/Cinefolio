import { useState, useEffect } from 'react';
import { useRouter, Link } from '../router/useRouter.ts';
import { useTheme } from '../context/ThemeContext.tsx';
import { Search, Menu, X, Clapperboard, Sun, Moon } from 'lucide-react';

interface HeaderProps {
  onOpenSearch: () => void;
}

export function Header({ onOpenSearch }: HeaderProps) {
  const { path, isLoading } = useRouter();
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [path]);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Movies', href: '/movies' },
    { label: 'TV Series', href: '/series' },
    { label: 'About', href: '/about' }
  ];

  const isLinkActive = (href: string) => {
    if (href === '/') return path === '/';
    return path.startsWith(href);
  };

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 border-b ${
        isScrolled
          ? 'bg-[#0B0C10]/95 backdrop-blur-md border-[rgba(255,255,255,0.08)] shadow-lg shadow-black/40'
          : 'bg-[#0B0C10] border-[rgba(255,255,255,0.05)]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 sm:gap-8 h-20">
          {/* Zone 1: Brand wordmark (single text element in display face) */}
          <Link
            href="/"
            className="flex items-center gap-2.5 text-slate-100 group shrink-0 whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A059] rounded"
          >
            {/* The film card logo with dynamic loading state */}
            <div
              className={`w-9 h-9 rounded-lg border bg-[#161824] flex items-center justify-center text-[#C5A059] transition-all duration-300 ${
                isLoading
                  ? 'border-[#C5A059] shadow-[0_0_14px_rgba(197,160,89,0.7)] animate-pulse scale-105'
                  : 'border-[#C5A059]/40 group-hover:border-[#C5A059]'
              }`}
            >
              <Clapperboard className={`w-4.5 h-4.5 text-[#DFBA73] ${isLoading ? 'animate-bounce duration-500' : ''}`} />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-[0.18em] text-[#F3F4F6] group-hover:text-[#DFBA73] transition-colors">
                CINEFOLIO
              </span>
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#8E95A5] -mt-1 font-sans hidden sm:block">
                Journal of Screen Arts
              </span>
            </div>
          </Link>

          {/* Zone 2: 4 nav links, single-line text with subtle hover underlines */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide">
            {navLinks.map((link) => {
              const active = isLinkActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative py-1 transition-colors whitespace-nowrap shrink-0 text-sm ${
                    active
                      ? 'text-[#DFBA73] font-semibold'
                      : 'text-[#9CA3AF] hover:text-[#F3F4F6]'
                  }`}
                >
                  {link.label}
                  {active && (
                    <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[#C5A059] rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Zone 3: Actions - Search + Phone-style Light/Dark Switcher */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Phone-style Theme Switcher: Segmented Control (Desktop / Tablet) */}
            <div
              role="radiogroup"
              aria-label="Theme selection"
              className="hidden lg:flex items-center p-1 rounded-full bg-[#141722] border border-[rgba(255,255,255,0.08)] shadow-inner"
            >
              <button
                type="button"
                role="radio"
                aria-checked={theme === 'light'}
                onClick={() => setTheme('light')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  theme === 'light'
                    ? 'bg-[#C5A059] text-[#0B0C10] font-bold shadow-sm'
                    : 'text-[#9CA3AF] hover:text-[#F3F4F6]'
                }`}
                title="Switch to Light Theme"
              >
                <Sun className="w-3.5 h-3.5" />
                <span>Light</span>
              </button>
              <button
                type="button"
                role="radio"
                aria-checked={theme === 'dark'}
                onClick={() => setTheme('dark')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-[#202434] text-[#DFBA73] font-bold shadow-sm border border-[#C5A059]/40'
                    : 'text-[#9CA3AF] hover:text-[#F3F4F6]'
                }`}
                title="Switch to Dark Theme"
              >
                <Moon className="w-3.5 h-3.5" />
                <span>Dark</span>
              </button>
            </div>

            {/* Quick Toggle for medium & smaller screens */}
            <button
              type="button"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="lg:hidden p-2 text-[#DFBA73] hover:text-white bg-[#141722] hover:bg-[#1C2030] border border-[rgba(255,255,255,0.08)] rounded-lg transition-colors cursor-pointer"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Primary Action: Search */}
            <button
              onClick={onOpenSearch}
              type="button"
              className="flex items-center gap-2.5 px-3 sm:px-3.5 py-2 text-xs font-medium text-[#D1D5DB] bg-[#141722] hover:bg-[#1C2030] border border-[rgba(255,255,255,0.08)] hover:border-[#C5A059]/50 rounded-lg transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A059] whitespace-nowrap shrink-0 cursor-pointer"
              aria-label="Search articles"
            >
              <Search className="w-3.5 h-3.5 text-[#C5A059]" />
              <span className="hidden sm:inline">Search essays...</span>
              <kbd className="hidden sm:inline-block text-[10px] font-mono bg-[#0B0C10] px-1.5 py-0.5 rounded text-[#9CA3AF] border border-[rgba(255,255,255,0.08)]">
                ⌘K
              </kbd>
            </button>

            {/* Mobile menu trigger button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="md:hidden p-2 text-[#9CA3AF] hover:text-white rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A059]"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[rgba(255,255,255,0.08)] bg-[#0E1017] px-4 pt-4 pb-6 space-y-4">
          {/* Phone-style Theme Segmented Switcher inside Mobile Drawer */}
          <div className="p-3 bg-[#141622] rounded-xl border border-[rgba(255,255,255,0.08)]">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#9CA3AF] block mb-2">
              Appearance / Theme
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setTheme('light')}
                className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  theme === 'light'
                    ? 'bg-[#C5A059] text-[#0B0C10] shadow-sm'
                    : 'bg-[#181B26] text-[#9CA3AF] hover:text-white'
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
                <span>Light</span>
              </button>
              <button
                type="button"
                onClick={() => setTheme('dark')}
                className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-[#202434] text-[#DFBA73] border border-[#C5A059]/40 shadow-sm'
                    : 'bg-[#181B26] text-[#9CA3AF] hover:text-white'
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
                <span>Dark</span>
              </button>
            </div>
          </div>

          <div className="space-y-1">
            {navLinks.map((link) => {
              const active = isLinkActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2.5 rounded-lg text-base font-medium transition-colors ${
                    active
                      ? 'bg-[#181B26] text-[#DFBA73]'
                      : 'text-[#D1D5DB] hover:bg-[#141722] hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
