import { Link } from '../router/useRouter.ts';
import { Clapperboard, ArrowUp } from 'lucide-react';

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-[rgba(255,255,255,0.08)] bg-[#090A0D] text-[#9CA3AF] text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Brand & Mission Column */}
          <div className="md:col-span-5 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2.5 text-[#F3F4F6] group">
              <div className="w-8 h-8 rounded-lg border border-[#C5A059]/40 bg-[#161824] flex items-center justify-center text-[#C5A059]">
                <Clapperboard className="w-4 h-4 text-[#DFBA73]" />
              </div>
              <span className="font-serif text-xl font-bold tracking-[0.16em] text-[#F3F4F6] group-hover:text-[#DFBA73] transition-colors">
                CINEFOLIO
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-[#9CA3AF] max-w-sm">
              An independent entertainment journal featuring in-depth retrospective essays, character studies, and production analysis dedicated exclusively to Hollywood&apos;s defining movies and television series.
            </p>
            <p className="text-xs text-[#6B7280]">
              ISSN 2837-1941 · Published quarterly and archived digitally.
            </p>
          </div>

          {/* Quick Navigation Column */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#E5E7EB]">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-[#DFBA73] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/movies" className="hover:text-[#DFBA73] transition-colors">
                  Movies Archive (6 Films)
                </Link>
              </li>
              <li>
                <Link href="/series" className="hover:text-[#DFBA73] transition-colors">
                  Television Series (4 Series)
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#DFBA73] transition-colors">
                  About the Publication
                </Link>
              </li>
            </ul>
          </div>

          {/* Archival & Image Provenance Notice */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#E5E7EB]">
              Image Provenance & Fair Use
            </h4>
            <p className="text-xs text-[#6B7280] leading-relaxed">
              All visual assets featured on Cinefolio are authentic historical photographs, studio tour archives, or production sets sourced from Wikimedia Commons and public domain repositories under verified Creative Commons licenses. No synthetic or AI-generated imagery is permitted.
            </p>
            <div className="pt-2">
              <button
                onClick={scrollToTop}
                type="button"
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#C5A059] hover:text-[#DFBA73] transition-colors cursor-pointer"
              >
                <span>Back to top</span>
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Legal Bar */}
        <div className="mt-12 pt-8 border-t border-[rgba(255,255,255,0.06)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#6B7280]">
          <p>© {new Date().getFullYear()} Cinefolio. All original critical essays and editorial commentary reserved.</p>
          <p>
            Hollywood Cinema & Television Journal · Dedicated to screen literacy and preservation.
          </p>
        </div>
      </div>
    </footer>
  );
}
