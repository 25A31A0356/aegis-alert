import React from 'react';

/**
 * Scenic illustrations matching the reference design in media_1788872912261.jpg:
 * - Screen 1: Misty blue-green mountain peak hero card ("In seasons guide")
 * - Screen 2: Split scenic route ticket backgrounds (Alpine Green, Sky Mist Blue, Peach Sunset)
 */

export const MountainHeroIllustration: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 400 320"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`w-full h-full object-cover select-none pointer-events-none ${className}`}
    preserveAspectRatio="xMidYMid slice"
  >
    <defs>
      <linearGradient id="heroSky" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#dcebf4" />
        <stop offset="50%" stopColor="#e8f2f8" />
        <stop offset="100%" stopColor="#f4f8f5" />
      </linearGradient>
      <linearGradient id="mountainMain" x1="30%" y1="10%" x2="70%" y2="100%">
        <stop offset="0%" stopColor="#436280" />
        <stop offset="40%" stopColor="#5a7e9e" />
        <stop offset="80%" stopColor="#3d5a73" />
        <stop offset="100%" stopColor="#2b4356" />
      </linearGradient>
      <linearGradient id="mountainRidgeLight" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8baec9" />
        <stop offset="50%" stopColor="#adc8dc" />
        <stop offset="100%" stopColor="#6d94b4" />
      </linearGradient>
      <linearGradient id="greenSlope" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#9fb882" />
        <stop offset="50%" stopColor="#7a9a5b" />
        <stop offset="100%" stopColor="#557538" />
      </linearGradient>
      <linearGradient id="fogMist" x1="0%" y1="100%" x2="0%" y2="0%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
        <stop offset="60%" stopColor="#ffffff" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
      </linearGradient>
      <radialGradient id="sunGlow" cx="60%" cy="30%" r="50%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
      </radialGradient>
    </defs>

    {/* Sky Backdrop */}
    <rect width="400" height="320" fill="url(#heroSky)" />
    <circle cx="260" cy="90" r="120" fill="url(#sunGlow)" />

    {/* Distant Clouds & Soft Peaks */}
    <path
      d="M20 200 Q 80 140 160 170 T 300 160 Q 360 140 400 180 L 400 320 L 0 320 Z"
      fill="#bdd2e0"
      opacity="0.4"
    />

    {/* Background Mountain */}
    <path
      d="M110 240 L 190 70 L 250 180 L 320 130 L 380 260 L 400 320 L 50 320 Z"
      fill="#6b8fae"
      opacity="0.5"
    />

    {/* Main Dramatic Mountain Peak (Screen 1 Reference) */}
    <path
      d="M130 290 L 220 50 L 265 140 L 305 280 L 370 320 L 80 320 Z"
      fill="url(#mountainMain)"
    />

    {/* Mountain Sunlit Facet / Ridge */}
    <path
      d="M220 50 L 175 160 L 155 240 L 130 290 L 220 50 Z"
      fill="url(#mountainRidgeLight)"
      opacity="0.85"
    />

    {/* Snow and Light Highlights on Peak */}
    <path
      d="M220 50 L 228 90 L 215 110 L 220 50 Z"
      fill="#ffffff"
      opacity="0.75"
    />

    {/* Foreground Verdant Hills & Green Slopes */}
    <path
      d="M0 240 Q 90 200 180 230 Q 270 260 400 210 L 400 320 L 0 320 Z"
      fill="url(#greenSlope)"
      opacity="0.7"
    />

    <path
      d="M-20 280 Q 120 240 240 270 Q 340 250 420 280 L 420 320 L -20 320 Z"
      fill="url(#greenSlope)"
    />

    {/* Ambient Fog / Mist Fade at Base */}
    <rect y="160" width="400" height="160" fill="url(#fogMist)" />
  </svg>
);

/**
 * Route Ticket 1: Alpine Green & Castle Mountain Scenic Split
 */
export const TicketAlpineScenicSvg: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 400 130"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`w-full h-full object-cover select-none pointer-events-none ${className}`}
    preserveAspectRatio="xMidYMid slice"
  >
    <defs>
      <linearGradient id="alpineSky" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#eaf3ee" />
        <stop offset="50%" stopColor="#f2f8f4" />
        <stop offset="100%" stopColor="#e6f2eb" />
      </linearGradient>
      <linearGradient id="leftPeak" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#6e8f77" />
        <stop offset="100%" stopColor="#43634c" />
      </linearGradient>
      <linearGradient id="rightPeak" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8ea873" />
        <stop offset="100%" stopColor="#5c7a42" />
      </linearGradient>
    </defs>

    {/* Sky Base */}
    <rect width="400" height="130" fill="url(#alpineSky)" />

    {/* Left Scenic Slopes */}
    <path d="M-20 130 L 70 20 L 180 130 Z" fill="url(#leftPeak)" opacity="0.35" />
    <path d="M20 130 L 110 35 L 195 130 Z" fill="url(#leftPeak)" opacity="0.5" />

    {/* Center Castle / Tower Silhouette in mist */}
    <rect x="185" y="45" width="14" height="40" fill="#698570" opacity="0.4" rx="2" />
    <polygon points="183,45 192,30 201,45" fill="#58725f" opacity="0.5" />
    <rect x="203" y="55" width="10" height="30" fill="#698570" opacity="0.35" rx="1" />

    {/* Right Scenic Slopes & Fortress */}
    <path d="M200 130 L 290 15 L 420 130 Z" fill="url(#rightPeak)" opacity="0.4" />
    <path d="M240 130 L 330 30 L 420 130 Z" fill="url(#rightPeak)" opacity="0.55" />

    {/* Soft Mist Center Gradient */}
    <circle cx="200" cy="65" r="50" fill="#ffffff" opacity="0.75" />
  </svg>
);

/**
 * Route Ticket 2: Sky Mist Blue & Hot Air Balloon / Towers
 */
export const TicketSkyScenicSvg: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 400 130"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`w-full h-full object-cover select-none pointer-events-none ${className}`}
    preserveAspectRatio="xMidYMid slice"
  >
    <defs>
      <linearGradient id="skyBlueGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#e8f2f9" />
        <stop offset="50%" stopColor="#f5f9fc" />
        <stop offset="100%" stopColor="#e4eff7" />
      </linearGradient>
      <linearGradient id="towerBlue" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#7ba5c7" />
        <stop offset="100%" stopColor="#4f7a9d" />
      </linearGradient>
    </defs>

    {/* Sky Base */}
    <rect width="400" height="130" fill="url(#skyBlueGrad)" />

    {/* Hot Air Balloon on Left Center (Screen 2 Mockup) */}
    <ellipse cx="140" cy="55" rx="14" ry="18" fill="#a4c4de" opacity="0.6" />
    <path d="M130 65 L 140 78 L 150 65 Z" fill="#8cb1ce" opacity="0.6" />
    <rect x="138" y="80" width="4" height="3" fill="#658aa8" opacity="0.6" />

    {/* Soft Distant Clouds */}
    <circle cx="90" cy="40" r="28" fill="#ffffff" opacity="0.65" />
    <circle cx="120" cy="35" r="22" fill="#ffffff" opacity="0.75" />
    <circle cx="180" cy="45" r="35" fill="#ffffff" opacity="0.8" />

    {/* Right Tower & Architecture Silhouette */}
    <rect x="270" y="30" width="18" height="80" fill="url(#towerBlue)" opacity="0.4" rx="2" />
    <polygon points="268,30 279,10 290,30" fill="url(#towerBlue)" opacity="0.5" />
    <rect x="294" y="50" width="12" height="60" fill="url(#towerBlue)" opacity="0.3" rx="1" />

    {/* Soft Sun Glow */}
    <circle cx="200" cy="55" r="45" fill="#ffffff" opacity="0.7" />
  </svg>
);

/**
 * Route Ticket 3: Sunset Peach Horizon & Bridges
 */
export const TicketSunsetScenicSvg: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 400 130"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`w-full h-full object-cover select-none pointer-events-none ${className}`}
    preserveAspectRatio="xMidYMid slice"
  >
    <defs>
      <linearGradient id="sunsetPeach" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#faece3" />
        <stop offset="50%" stopColor="#fdf5ef" />
        <stop offset="100%" stopColor="#f8e5da" />
      </linearGradient>
      <linearGradient id="peachBridge" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#d9997d" />
        <stop offset="100%" stopColor="#b67355" />
      </linearGradient>
    </defs>

    {/* Sky Base */}
    <rect width="400" height="130" fill="url(#sunsetPeach)" />

    {/* Distant Birds / Elements in Sunset */}
    <path d="M120 30 Q 125 25 130 30 Q 135 25 140 30" stroke="#b08169" strokeWidth="1.2" fill="none" opacity="0.5" />
    <path d="M145 22 Q 148 18 152 22 Q 156 18 160 22" stroke="#b08169" strokeWidth="1.2" fill="none" opacity="0.5" />

    {/* Left Arch Bridge Silhouette */}
    <path
      d="M-10 110 Q 60 70 140 110 L 140 130 L -10 130 Z"
      fill="url(#peachBridge)"
      opacity="0.3"
    />
    <path
      d="M50 115 Q 130 75 210 115 L 210 130 L 50 130 Z"
      fill="url(#peachBridge)"
      opacity="0.35"
    />

    {/* Right Horizon Structure */}
    <ellipse cx="310" cy="85" rx="35" ry="12" fill="#c98263" opacity="0.35" />
    <rect x="295" y="60" width="30" height="25" fill="#c98263" opacity="0.3" rx="2" />
    <polygon points="290,60 310,40 330,60" fill="#b0694a" opacity="0.4" />

    {/* Warm Glow Center */}
    <circle cx="200" cy="65" r="45" fill="#ffffff" opacity="0.7" />
  </svg>
);
