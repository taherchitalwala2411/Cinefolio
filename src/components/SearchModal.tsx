import { useState, useEffect, useRef } from 'react';
import { useRouter } from '../router/useRouter.ts';
import { searchArticles } from '../data/articles/index.ts';
import { Article } from '../data/types.ts';
import { Search, X, ArrowRight, Film, Tv } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Article[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const { navigate } = useRouter();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setQuery('');
      setResults([]);
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    if (query.trim()) {
      setResults(searchArticles(query));
    } else {
      setResults([]);
    }
  }, [query]);

  // Keyboard shortcut (Escape to close, Cmd/Ctrl+K to open)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSelect = (slug: string) => {
    onClose();
    navigate(`/articles/${slug}`);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search articles"
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-[#12141C] border border-[rgba(255,255,255,0.12)] rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-[rgba(255,255,255,0.08)] bg-[#161824]">
          <Search className="w-5 h-5 text-[#C5A059] mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search titles, directors, actors, themes..."
            className="w-full bg-transparent text-[#F3F4F6] placeholder-[#6B7280] text-base focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              type="button"
              className="p-1 text-[#9CA3AF] hover:text-white mr-1"
              aria-label="Clear query"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            type="button"
            className="text-xs uppercase tracking-wider text-[#9CA3AF] hover:text-white px-2 py-1 rounded bg-[#0B0C10] border border-[rgba(255,255,255,0.08)]"
          >
            Esc
          </button>
        </div>

        {/* Results Area */}
        <div className="max-h-[60vh] overflow-y-auto p-3">
          {query.trim() === '' ? (
            <div className="p-8 text-center text-sm text-[#9CA3AF]">
              <p className="mb-2 font-medium text-[#D1D5DB]">Search the Hollywood Canon</p>
              <p className="text-xs text-[#6B7280]">
                Search for films, series, actors (e.g. Christian Bale, Bryan Cranston), directors (Nolan, Spielberg), or themes.
              </p>
            </div>
          ) : results.length === 0 ? (
            <div className="p-10 text-center text-sm text-[#9CA3AF]">
              <p className="text-base font-semibold text-[#F3F4F6] mb-1">No essays found</p>
              <p className="text-xs text-[#6B7280]">
                No articles matched &ldquo;{query}&rdquo;. Try searching for a different movie title, series, or keyword.
              </p>
            </div>
          ) : (
            <div className="space-y-1.5">
              <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#C5A059]">
                Found {results.length} matching {results.length === 1 ? 'essay' : 'essays'}
              </div>
              {results.map((article) => (
                <button
                  key={article.id}
                  onClick={() => handleSelect(article.slug)}
                  type="button"
                  className="w-full text-left p-3 rounded-lg hover:bg-[#1A1D2A] transition-colors flex items-center justify-between group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A059]"
                >
                  <div className="flex items-start gap-3.5 pr-4">
                    <img
                      src={article.featuredImage}
                      alt=""
                      className="w-14 h-14 object-cover rounded shrink-0 border border-[rgba(255,255,255,0.06)]"
                    />
                    <div>
                      <div className="flex items-center gap-2 text-[11px] text-[#9CA3AF] mb-1">
                        <span className="flex items-center gap-1 text-[#DFBA73] font-medium">
                          {article.category === 'Movies' ? (
                            <Film className="w-3 h-3 inline" />
                          ) : (
                            <Tv className="w-3 h-3 inline" />
                          )}
                          {article.category}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{article.readingTime}</span>
                      </div>
                      <h4 className="font-serif font-bold text-sm text-[#F3F4F6] group-hover:text-[#DFBA73] transition-colors line-clamp-1">
                        {article.title}
                      </h4>
                      <p className="text-xs text-[#9CA3AF] line-clamp-1 mt-0.5">
                        {article.description}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#C5A059] opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
