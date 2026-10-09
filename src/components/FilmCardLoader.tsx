import { useState, useEffect, useRef } from 'react';
import { useRouter, ConnectionSpeed } from '../router/useRouter.ts';
import { useTheme } from '../context/ThemeContext.tsx';

interface FilmCardLoaderProps {
  isLoading?: boolean;
  connectionSpeed?: ConnectionSpeed;
}

// Global cached AudioContext instance to avoid re-creation overhead
let sharedAudioCtx: AudioContext | null = null;

function playFilmCardClickSound() {
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    if (!sharedAudioCtx) {
      sharedAudioCtx = new AudioContextClass();
    }
    if (sharedAudioCtx.state === 'suspended') {
      sharedAudioCtx.resume();
    }

    const ctx = sharedAudioCtx;
    const now = ctx.currentTime;

    // 1. Primary crisp wooden transient snap (fast frequency ramp down)
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(920, now);
    osc.frequency.exponentialRampToValueAtTime(130, now + 0.03);

    oscGain.gain.setValueAtTime(0.4, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

    osc.connect(oscGain);
    oscGain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.035);

    // 2. High-frequency clapper impact noise (simulating wood striking wood)
    const bufferSize = Math.floor(ctx.sampleRate * 0.018); // 18ms
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const channelData = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      channelData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.0035));
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(2600, now);
    filter.Q.setValueAtTime(4.0, now);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.3, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.018);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noise.start(now);
    noise.stop(now + 0.022);

    // 3. Wooden slate body resonance thud
    const thud = ctx.createOscillator();
    const thudGain = ctx.createGain();
    thud.type = 'sine';
    thud.frequency.setValueAtTime(320, now);
    thud.frequency.exponentialRampToValueAtTime(80, now + 0.045);

    thudGain.gain.setValueAtTime(0.25, now);
    thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

    thud.connect(thudGain);
    thudGain.connect(ctx.destination);
    thud.start(now);
    thud.stop(now + 0.05);
  } catch {
    // Graceful fallback if Web Audio is muted or restricted
  }
}

export function FilmCardLoader({
  isLoading: propLoading,
  connectionSpeed: propSpeed
}: FilmCardLoaderProps = {}) {
  const router = useRouter();
  const { theme } = useTheme();
  const isLight = theme === 'light';

  // State for top clapper stick motion: true = open, false = snapped shut (clicked)
  const [isStickOpen, setIsStickOpen] = useState(true);

  const isLoading = propLoading !== undefined ? propLoading : router.isLoading;
  const connectionSpeed = propSpeed !== undefined ? propSpeed : router.connectionSpeed;

  // Active loader condition: during navigation loading or in degraded offline / slow states
  const active = Boolean(isLoading || connectionSpeed === 'offline' || connectionSpeed === 'slow');

  const prevActiveRef = useRef(false);

  useEffect(() => {
    if (!active) {
      prevActiveRef.current = false;
      return;
    }

    // Determine clicking cycle interval based on connection speed
    const cycleInterval =
      connectionSpeed === 'slow' ? 650 : connectionSpeed === 'medium' ? 500 : 420;

    // Immediately start in open state, then snap down and play click sound
    setIsStickOpen(true);

    const initialSnapTimer = setTimeout(() => {
      setIsStickOpen(false);
      playFilmCardClickSound();
    }, 70);

    // Repeating click animation and sound while active
    const repeatInterval = setInterval(() => {
      setIsStickOpen(true);
      setTimeout(() => {
        setIsStickOpen(false);
        playFilmCardClickSound();
      }, 70);
    }, cycleInterval);

    prevActiveRef.current = true;

    return () => {
      clearTimeout(initialSnapTimer);
      clearInterval(repeatInterval);
    };
  }, [active, connectionSpeed]);

  if (!active) {
    return null;
  }

  // Color scheme constants for light & dark themes
  const borderColor = isLight ? '#9B7829' : '#C5A059';
  const cardBg = isLight ? '#FFFFFF' : '#141622';
  const slateBodyBg = isLight ? '#FAF8F5' : '#181B28';
  const stickBg = isLight ? '#1C1917' : '#0F111A';
  const stripeColor = isLight ? '#9B7829' : '#DFBA73';
  const hingeColor = isLight ? '#B38728' : '#C5A059';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none transition-all duration-200 animate-in fade-in"
      role="status"
      aria-label="Loading"
    >
      {/* Central Film Card Logo (Very small, centered, zero text) */}
      <div
        className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center p-2.5 transition-transform duration-150 transform scale-100 ${
          isLight
            ? 'bg-white/95 border border-[#9B7829]/60 shadow-xl shadow-black/15'
            : 'bg-[#12141C]/95 border border-[#C5A059]/70 shadow-2xl shadow-black/80'
        }`}
        style={{
          boxShadow: isLight
            ? '0 0 20px rgba(155, 120, 41, 0.25), 0 8px 16px -4px rgba(0, 0, 0, 0.12)'
            : '0 0 24px rgba(197, 160, 89, 0.45), 0 12px 24px -6px rgba(0, 0, 0, 0.8)'
        }}
      >
        {/* Animated Film Card Clapperboard SVG */}
        <svg
          viewBox="0 0 48 48"
          className="w-full h-full overflow-visible"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Film Card Slate Body (Bottom Base) */}
          <rect
            x="4"
            y="17"
            width="40"
            height="26"
            rx="3"
            fill={slateBodyBg}
            stroke={borderColor}
            strokeWidth="2"
          />

          {/* Slate division lines (Classic Hollywood film card slate markings) */}
          <line
            x1="8"
            y1="25"
            x2="40"
            y2="25"
            stroke={borderColor}
            strokeWidth="1.2"
            strokeOpacity="0.4"
          />
          <line
            x1="22"
            y1="25"
            x2="22"
            y2="37"
            stroke={borderColor}
            strokeWidth="1.2"
            strokeOpacity="0.3"
          />
          <line
            x1="8"
            y1="37"
            x2="40"
            y2="37"
            stroke={borderColor}
            strokeWidth="1.2"
            strokeOpacity="0.4"
          />

          {/* Bottom fixed strip of the clapper bar */}
          <rect
            x="4"
            y="13"
            width="40"
            height="5"
            rx="1.5"
            fill={stickBg}
            stroke={borderColor}
            strokeWidth="1.2"
          />
          {/* Striped accents on bottom stick */}
          <line x1="12" y1="13" x2="16" y2="18" stroke={stripeColor} strokeWidth="2.5" />
          <line x1="22" y1="13" x2="26" y2="18" stroke={stripeColor} strokeWidth="2.5" />
          <line x1="32" y1="13" x2="36" y2="18" stroke={stripeColor} strokeWidth="2.5" />

          {/* Top Moving Clapper Stick (Pivots from top-left hinge and snaps down) */}
          <g
            style={{
              transformOrigin: '5px 14px',
              transform: isStickOpen ? 'rotate(-26deg)' : 'rotate(0deg)',
              transition: isStickOpen
                ? 'transform 180ms cubic-bezier(0.2, 0.8, 0.4, 1)'
                : 'transform 65ms cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            {/* Clapper Top Arm */}
            <rect
              x="4"
              y="7"
              width="40"
              height="6.5"
              rx="1.8"
              fill={stickBg}
              stroke={borderColor}
              strokeWidth="1.4"
            />

            {/* Classic Hollywood Film Clapperboard Diagonal Chevron Stripes */}
            <line x1="10" y1="7" x2="14" y2="13.5" stroke={stripeColor} strokeWidth="2.5" strokeLinecap="round" />
            <line x1="20" y1="7" x2="24" y2="13.5" stroke={stripeColor} strokeWidth="2.5" strokeLinecap="round" />
            <line x1="30" y1="7" x2="34" y2="13.5" stroke={stripeColor} strokeWidth="2.5" strokeLinecap="round" />
            <line x1="40" y1="7" x2="42" y2="10.5" stroke={stripeColor} strokeWidth="2.5" strokeLinecap="round" />
          </g>

          {/* Left Hinge Bolt / Rivet */}
          <circle cx="5.5" cy="14" r="2.2" fill={hingeColor} stroke={cardBg} strokeWidth="1" />
          <circle cx="5.5" cy="14" r="0.8" fill={cardBg} />
        </svg>
      </div>
    </div>
  );
}
