import { SEOHead } from '../components/SEOHead.tsx';
import { Link } from '../router/useRouter.ts';
import { Clapperboard, ChevronRight, ShieldCheck, BookOpen, Compass, Award } from 'lucide-react';

export function AboutPage() {
  return (
    <>
      <SEOHead
        title="About Cinefolio — The Hollywood Cinema & Television Journal"
        description="Learn about Cinefolio's editorial mission, our dedication to deep-dive retrospective film criticism, and our rigorous standards for archival photography and analysis."
        canonicalUrl="https://cinefolio.org/about"
        breadcrumb={[
          { name: 'Home', url: 'https://cinefolio.org/' },
          { name: 'About', url: 'https://cinefolio.org/about' }
        ]}
      />

      <div className="min-h-screen bg-[#0B0C10] pb-24">
        {/* Header Hero */}
        <header className="border-b border-[rgba(255,255,255,0.08)] bg-[#0E1017] py-14 sm:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav aria-label="Breadcrumbs" className="flex items-center gap-2 text-xs text-[#9CA3AF] mb-4">
              <Link href="/" className="hover:text-white transition-colors">
                Home
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-[#6B7280]" />
              <span className="text-[#DFBA73] font-medium">About</span>
            </nav>

            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#C5A059] mb-3">
              <Compass className="w-4 h-4" />
              <span>Editorial Manifesto</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#F9FAFB] tracking-tight mb-4">
              About Cinefolio
            </h1>

            <p className="text-lg text-[#DFBA73] font-light leading-relaxed">
              An independent entertainment journal committed to long-form critical inquiry, historical context, and the artistic preservation of American screen storytelling.
            </p>
          </div>
        </header>

        {/* Content Body */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
          <div className="space-y-12">
            {/* Section 1: Our Purpose */}
            <section className="bg-[#12141C] border border-[rgba(255,255,255,0.08)] rounded-xl p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded bg-[#1A1D2A] border border-[#C5A059]/30 flex items-center justify-center text-[#C5A059]">
                  <BookOpen className="w-4 h-4" />
                </div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#F3F4F6]">
                  Our Purpose & Scope
                </h2>
              </div>
              <p className="text-sm sm:text-base text-[#D1D5DB] leading-relaxed mb-4">
                In an era dominated by rapid-fire social commentary, algorithmic listicles, and disposable reactions, Cinefolio was founded to champion contemplative, long-form retrospective film and television journalism. We explore Hollywood productions not merely as commercial consumer products, but as complex cultural artifacts that reflect, challenge, and shape human psychology and historical memory.
              </p>
              <p className="text-sm sm:text-base text-[#D1D5DB] leading-relaxed">
                Our publication covers ten monumental Hollywood benchmarks spanning modern cinema and prestige serialized television. Each retrospective is designed as a standalone monograph—averaging approximately 2,000 words—interrogating narrative architecture, thematic depth, practical craftsmanship, and lasting cultural resonance.
              </p>
            </section>

            {/* Section 2: Core Pillars */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#12141C] border border-[rgba(255,255,255,0.08)] rounded-xl p-6">
                <div className="flex items-center gap-2.5 mb-3 text-[#DFBA73]">
                  <Award className="w-4 h-4 text-[#C5A059]" />
                  <h3 className="font-serif font-bold text-base text-[#F3F4F6]">
                    Narrative Rigor
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-[#9CA3AF] leading-relaxed">
                  We analyze character trajectories, screenwriting decisions, moral dilemmas, and thematic subtext. Our essays investigate why stories work, how tension is sustained, and what structural choices enable certain narratives to achieve timeless emotional resonance.
                </p>
              </div>

              <div className="bg-[#12141C] border border-[rgba(255,255,255,0.08)] rounded-xl p-6">
                <div className="flex items-center gap-2.5 mb-3 text-[#DFBA73]">
                  <Clapperboard className="w-4 h-4 text-[#C5A059]" />
                  <h3 className="font-serif font-bold text-base text-[#F3F4F6]">
                    Production Craft
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-[#9CA3AF] leading-relaxed">
                  We celebrate the physical and technical craft of filmmaking—from full-scale mechanical animatronics and 70mm IMAX camera rigs to hand-forged armor, location acoustics, and symphonic leitmotif scores that define modern screen artistry.
                </p>
              </div>
            </section>

            {/* Section 3: Archival Image Integrity */}
            <section className="bg-[#12141C] border border-[rgba(255,255,255,0.08)] rounded-xl p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded bg-[#1A1D2A] border border-[#C5A059]/30 flex items-center justify-center text-[#C5A059]">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#F3F4F6]">
                  Archival Photography Standard
                </h2>
              </div>
              <p className="text-sm sm:text-base text-[#D1D5DB] leading-relaxed mb-4">
                Cinefolio enforces a strict visual authenticity charter: every photograph featured on this website is an authentic production still, historic location photograph, studio tour set, or press conference record sourced from verified public domain repositories or Wikimedia Commons under Creative Commons licensing.
              </p>
              <p className="text-xs sm:text-sm text-[#9CA3AF] leading-relaxed">
                We strictly prohibit AI-generated imagery, synthetic deepfakes, and unrelated stock photography. Every asset is optimized to deliver museum-grade resolution while respecting rigorous performance boundaries (with every delivered image file strictly under 400 KB).
              </p>
            </section>

            {/* Return Link */}
            <div className="pt-4 text-center">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-xs font-semibold uppercase tracking-wider text-[#0B0C10] bg-[#C5A059] hover:bg-[#DFBA73] transition-colors"
              >
                <span>Explore the Complete Canon Archive</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
