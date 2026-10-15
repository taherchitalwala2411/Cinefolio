import { useState, useEffect } from 'react';
import {
  soundtrackEngine,
  ThemeSlug,
  THEME_METADATA,
  SoundtrackState
} from '../services/soundtrackEngine.ts';
import { useTheme } from '../context/ThemeContext.tsx';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Music,
  ChevronDown,
  ChevronUp,
  Sparkles
} from 'lucide-react';

interface SoundtrackPlayerProps {
  slug: string;
}

export function SoundtrackPlayer({ slug }: SoundtrackPlayerProps) {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  // Check if current article slug has an assigned soundtrack
  const isRecognizedTheme =
    slug === 'harry-potter' || slug === 'game-of-thrones' || slug === 'stranger-things';

  const [state, setState] = useState<SoundtrackState>(soundtrackEngine.getState());
  const [isMinimized, setIsMinimized] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  useEffect(() => {
    const unsubscribe = soundtrackEngine.subscribe((newState) => {
      setState(newState);
    });
    return unsubscribe;
  }, []);

  if (!isRecognizedTheme) {
    return null;
  }

  const currentSlug = slug as ThemeSlug;
  const meta = THEME_METADATA[currentSlug];
  const isPlayingThisTheme = state.currentTheme === currentSlug && state.isPlaying;

  const handleTogglePlay = () => {
    if (isPlayingThisTheme) {
      soundtrackEngine.pause();
    } else {
      soundtrackEngine.playTheme(currentSlug);
    }
  };

  const handleToggleMute = () => {
    soundtrackEngine.toggleMute();
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    soundtrackEngine.setVolume(val);
  };

  return (
    <div
      className={`fixed bottom-5 right-5 z-40 transition-all duration-300 max-w-[calc(100vw-2.5rem)] select-none ${
        isMinimized ? 'translate-y-2' : ''
      }`}
      role="region"
      aria-label="Soundtrack theme player"
    >
      {/* Minimized Bubble View */}
      {isMinimized ? (
        <button
          onClick={() => setIsMinimized(false)}
          className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-full shadow-2xl backdrop-blur-md border transition-all duration-200 hover:scale-105 ${
            isLight
              ? 'bg-[#FAF8F5]/95 text-[#1F2937] border-[#D1D5DB] hover:border-[#9B7829] shadow-[#9B7829]/10'
              : 'bg-[#12131A]/95 text-[#F3F4F6] border-[#2A2B36] hover:border-[#C5A059] shadow-black/40'
          }`}
          title="Expand soundtrack player"
        >
          <div className="relative flex items-center justify-center">
            <Music className={`w-4 h-4 ${isLight ? 'text-[#9B7829]' : 'text-[#C5A059]'}`} />
            {isPlayingThisTheme && (
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
            )}
          </div>
          <span className="text-xs font-semibold tracking-wide font-sans">
            {meta.title}
          </span>
          <ChevronUp className="w-3.5 h-3.5 opacity-60" />
        </button>
      ) : (
        /* Full Expanded Player Card */
        <div
          className={`p-3.5 sm:p-4 rounded-2xl shadow-2xl backdrop-blur-xl border transition-all duration-300 flex flex-col gap-2.5 ${
            isLight
              ? 'bg-[#FAF8F5]/95 border-[#E5E7EB] text-[#111827] shadow-[#9B7829]/10 ring-1 ring-black/5'
              : 'bg-[#111218]/95 border-[#2A2B37] text-[#F3F4F6] shadow-black/60 ring-1 ring-white/5'
          }`}
        >
          {/* Header Row: Badge & Minimize Button */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  isPlayingThisTheme
                    ? isLight
                      ? 'bg-[#9B7829]/10 text-[#9B7829] border border-[#9B7829]/30'
                      : 'bg-[#C5A059]/15 text-[#DFBA73] border border-[#C5A059]/40'
                    : isLight
                    ? 'bg-gray-100 text-gray-500 border border-gray-200'
                    : 'bg-[#1F202B] text-gray-400 border border-[#2F3040]'
                }`}
              >
                <Sparkles className="w-2.5 h-2.5" />
                Original Theme Audio
              </span>

              {/* Animated Audio Waveform Bars when playing */}
              {isPlayingThisTheme && !state.isMuted && (
                <div className="flex items-end gap-0.5 h-3 px-1">
                  <span className="w-0.5 h-full bg-[#10B981] rounded-full animate-pulse" />
                  <span className="w-0.5 h-2/3 bg-[#10B981] rounded-full animate-bounce" />
                  <span className="w-0.5 h-full bg-[#10B981] rounded-full animate-pulse" />
                  <span className="w-0.5 h-1/2 bg-[#10B981] rounded-full animate-bounce" />
                </div>
              )}
            </div>

            <button
              onClick={() => setIsMinimized(true)}
              className={`p-1 rounded-md transition-colors ${
                isLight ? 'hover:bg-gray-200/80 text-gray-500' : 'hover:bg-[#1E202B] text-gray-400'
              }`}
              title="Minimize player"
              aria-label="Minimize player"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Title & Composer Description */}
          <div className="pr-2">
            <div className="flex items-center gap-1.5">
              <h4 className="font-serif font-bold text-sm tracking-wide">
                {meta.title}
              </h4>
            </div>
            <p className={`text-xs mt-0.5 ${isLight ? 'text-gray-600' : 'text-gray-400'}`}>
              Composed by <span className="font-medium text-inherit">{meta.composer}</span>
            </p>
          </div>

          {/* Controls Bar */}
          <div className="flex items-center justify-between gap-3 pt-1 border-t border-dashed border-gray-200 dark:border-gray-800">
            {/* Play / Pause Primary Action */}
            <button
              onClick={handleTogglePlay}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200 shadow-sm active:scale-95 ${
                isPlayingThisTheme
                  ? isLight
                    ? 'bg-[#1F2937] text-white hover:bg-black'
                    : 'bg-[#F3F4F6] text-[#0B0C10] hover:bg-white'
                  : isLight
                  ? 'bg-[#9B7829] text-white hover:bg-[#836420]'
                  : 'bg-[#C5A059] text-[#0B0C10] hover:bg-[#D5B26E]'
              }`}
              title={isPlayingThisTheme ? 'Pause theme' : 'Play theme'}
            >
              {isPlayingThisTheme ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-current" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Play Theme</span>
                </>
              )}
            </button>

            {/* Volume & Mute Controls */}
            <div className="flex items-center gap-2">
              {showVolumeSlider && (
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={state.isMuted ? 0 : state.volume}
                  onChange={handleVolumeChange}
                  className="w-16 h-1.5 rounded-lg appearance-none cursor-pointer bg-gray-300 dark:bg-gray-700 accent-[#C5A059]"
                  aria-label="Soundtrack volume"
                />
              )}

              <button
                onClick={handleToggleMute}
                onMouseEnter={() => setShowVolumeSlider(true)}
                className={`p-1.5 rounded-lg transition-colors ${
                  isLight
                    ? 'hover:bg-gray-200/80 text-gray-600'
                    : 'hover:bg-[#1E202B] text-gray-300'
                }`}
                title={state.isMuted ? 'Unmute' : 'Mute'}
                aria-label={state.isMuted ? 'Unmute' : 'Mute'}
              >
                {state.isMuted || state.volume === 0 ? (
                  <VolumeX className="w-4 h-4 text-red-400" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Autoplay blocked hint if the browser policy prevented instant audio before user gesture */}
          {state.autoplayBlocked && !isPlayingThisTheme && (
            <div
              onClick={handleTogglePlay}
              className="text-[11px] text-amber-500 dark:text-amber-400 cursor-pointer flex items-center gap-1.5 pt-0.5 animate-pulse"
            >
              <span>Click anywhere or tap Play to hear theme tune</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
