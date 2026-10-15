import { useState, useEffect } from 'react';
import { RouterProvider, useRouter, Link } from './router/useRouter.ts';
import { ThemeProvider } from './context/ThemeContext.tsx';
import { Header } from './components/Header.tsx';
import { Footer } from './components/Footer.tsx';
import { SearchModal } from './components/SearchModal.tsx';
import { HomePage } from './pages/HomePage.tsx';
import { ArticlePage } from './pages/ArticlePage.tsx';
import { CategoryPage } from './pages/CategoryPage.tsx';
import { AboutPage } from './pages/AboutPage.tsx';
import { getArticleBySlug } from './data/articles/index.ts';
import { Film, ArrowLeft } from 'lucide-react';
import { FilmCardLoader } from './components/FilmCardLoader.tsx';
import { soundtrackEngine } from './services/soundtrackEngine.ts';

function AppContent() {
  const { path } = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);

  // Stop soundtrack when navigating away from article pages
  useEffect(() => {
    if (!path.startsWith('/articles/')) {
      soundtrackEngine.stopTheme();
    }
  }, [path]);

  // Global keyboard shortcut: Cmd+K or Ctrl+K to open search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Determine which page component to render based on URL pathname
  let pageContent = null;

  if (path === '/' || path === '') {
    pageContent = <HomePage />;
  } else if (path === '/movies') {
    pageContent = <CategoryPage category="Movies" />;
  } else if (path === '/series') {
    pageContent = <CategoryPage category="TV Series" />;
  } else if (path === '/about') {
    pageContent = <AboutPage />;
  } else if (path.startsWith('/articles/')) {
    const slug = path.replace('/articles/', '').replace(/\/$/, '');
    const article = getArticleBySlug(slug);

    if (article) {
      pageContent = <ArticlePage article={article} />;
    } else {
      // 404 for unknown article slug
      pageContent = (
        <div className="min-h-[70vh] flex items-center justify-center px-4 py-20 text-center">
          <div className="max-w-md">
            <div className="w-12 h-12 rounded-xl bg-[#161824] border border-[#C5A059]/30 flex items-center justify-center text-[#C5A059] mx-auto mb-4">
              <Film className="w-6 h-6" />
            </div>
            <h1 className="font-serif text-3xl font-bold text-[#F3F4F6] mb-2">
              Essay Not Found
            </h1>
            <p className="text-sm text-[#9CA3AF] mb-6 leading-relaxed">
              The article slug &ldquo;{slug}&rdquo; could not be located in our publication archives.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider text-[#0B0C10] bg-[#C5A059] hover:bg-[#DFBA73] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Homepage</span>
            </Link>
          </div>
        </div>
      );
    }
  } else {
    // 404 for unknown generic path
    pageContent = (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-20 text-center">
        <div className="max-w-md">
          <h1 className="font-serif text-4xl font-bold text-[#F3F4F6] mb-2">
            404
          </h1>
          <p className="text-base text-[#DFBA73] font-serif mb-2">
            Scene Not In Script
          </p>
          <p className="text-sm text-[#9CA3AF] mb-6 leading-relaxed">
            The page at &ldquo;{path}&rdquo; does not exist in the Cinefolio archives.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider text-[#0B0C10] bg-[#C5A059] hover:bg-[#DFBA73] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Homepage</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#0B0C10] text-[#E2E4E9] transition-colors duration-200">
      <FilmCardLoader />
      <Header onOpenSearch={() => setSearchOpen(true)} />
      <div className="flex-1">{pageContent}</div>
      <Footer />
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <RouterProvider>
        <AppContent />
      </RouterProvider>
    </ThemeProvider>
  );
}
