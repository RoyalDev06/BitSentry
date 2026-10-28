interface BitSentryLogoProps {
  className?: string;
  size?: number;
  withText?: boolean;
  textSize?: "sm" | "md" | "lg" | "xl";
}

export default function BitSentryLogo({
  className = "h-8 w-8",
  size,
  withText = false,
  textSize = "md",
}: BitSentryLogoProps) {
  const dimension = size ? `${size}px` : undefined;

  const textClasses = {
    sm: "text-base",
    md: "text-lg",
    lg: "text-xl",
    xl: "text-2xl",
  }[textSize];

  return (
    <div className="inline-flex items-center gap-2.5">
      {/* Proprietary BitSentry Sentry-Shield Mark */}
      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        style={dimension ? { width: dimension, height: dimension } : undefined}
        aria-label="BitSentry Logo"
      >
        <defs>
          {/* Main Brand Gradient: Orange to Amber */}
          <linearGradient id="bsOrangeGrad" x1="8" y1="6" x2="56" y2="58" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#f7931a" />
            <stop offset="100%" stopColor="#d47e12" />
          </linearGradient>

          {/* Sentry Core Glow */}
          <linearGradient id="bsTealGrad" x1="20" y1="20" x2="44" y2="44" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#2dd4bf" />
            <stop offset="100%" stopColor="#0f766e" />
          </linearGradient>

          {/* Subtle shield plate fill */}
          <linearGradient id="bsPlateGrad" x1="32" y1="8" x2="32" y2="56" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#f7931a" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.04" />
          </linearGradient>
        </defs>

        {/* Outer Shield Plate */}
        <path
          d="M32 6L54 15.5V31C54 44.8 44.6 54.4 32 58C19.4 54.4 10 44.8 10 31V15.5L32 6Z"
          fill="url(#bsPlateGrad)"
          stroke="url(#bsOrangeGrad)"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />

        {/* Inner Sentinel Aperture / Eye of Vigilance */}
        <path
          d="M32 17L44 26.5V37.5L32 47L20 37.5V26.5L32 17Z"
          stroke="url(#bsOrangeGrad)"
          strokeWidth="2.2"
          strokeLinejoin="round"
          strokeDasharray="1 0"
          opacity="0.85"
        />

        {/* Central Sentry Node (Diamond Core) */}
        <polygon
          points="32,24 40,32 32,40 24,32"
          fill="url(#bsTealGrad)"
        />

        {/* Focus Pulse Rings / Scanning Horizon */}
        <circle cx="32" cy="32" r="3" fill="#ffffff" />
        <line x1="16" y1="32" x2="22" y2="32" stroke="#2dd4bf" strokeWidth="2" strokeLinecap="round" />
        <line x1="42" y1="32" x2="48" y2="32" stroke="#2dd4bf" strokeWidth="2" strokeLinecap="round" />
      </svg>

      {withText && (
        <span className={`font-bold tracking-tight text-brand-orange ${textClasses}`}>
          BitSentry
        </span>
      )}
    </div>
  );
}

