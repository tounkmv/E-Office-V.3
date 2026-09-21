import React, { useState } from 'react';

interface LaoEmblemProps {
  className?: string;
  size?: number;
  variant?: 'default' | 'glow' | 'medallion' | 'badge';
  showHalo?: boolean;
}

export const LaoEmblem: React.FC<LaoEmblemProps> = ({ 
  className = '', 
  size = 56,
  variant = 'default',
  showHalo = false
}) => {
  const [imgError, setImgError] = useState(false);

  // High-fidelity official vector SVG asset
  const emblemAssetUrl = '/assets/emblem_of_laos.svg';

  // Inner Emblem Content
  const renderEmblem = () => {
    if (!imgError) {
      return (
        <img
          src={emblemAssetUrl}
          alt="ກາໝາຍຊາດ ສາທາລະນະລັດ ປະຊາທິປະໄຕ ປະຊາຊົນລາວ"
          width={size}
          height={size}
          className={`object-contain transition-transform duration-300 drop-shadow-sm select-none ${className}`}
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
          style={{ width: `${size}px`, height: `${size}px` }}
        />
      );
    }

    // Fallback vector SVG in case of asset path issue
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`shrink-0 drop-shadow-md select-none ${className}`}
        aria-label="ກາໝາຍຊາດ ສາທາລະນະລັດ ປະຊາທິປະໄຕ ປະຊາຊົນລາວ"
      >
        <defs>
          <radialGradient id="fallbackGoldGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FEF08A" />
            <stop offset="70%" stopColor="#EAB308" />
            <stop offset="100%" stopColor="#CA8A04" />
          </radialGradient>
          <linearGradient id="fallbackLaoRed" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#DC2626" />
            <stop offset="100%" stopColor="#991B1B" />
          </linearGradient>
          <linearGradient id="fallbackGearGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#94A3B8" />
            <stop offset="100%" stopColor="#475569" />
          </linearGradient>
          <linearGradient id="fallbackBlueSky" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#0284C7" />
          </linearGradient>
        </defs>

        <circle cx="100" cy="100" r="94" fill="#FEFCE8" stroke="#D97706" strokeWidth="3" />
        <circle cx="100" cy="100" r="86" fill="url(#fallbackBlueSky)" />

        {/* Mountain & Dam */}
        <path d="M40 135 L70 100 L95 125 L125 95 L160 135 Z" fill="#15803D" opacity="0.85" />
        <path d="M50 136 C80 130 120 130 150 136 L150 145 C120 142 80 142 50 145 Z" fill="#0284C7" />

        {/* Pha That Luang */}
        <rect x="80" y="105" width="40" height="5" rx="1" fill="#CA8A04" />
        <rect x="84" y="100" width="32" height="5" rx="1" fill="#EAB308" />
        <path d="M92 94 L97 50 C98 48 102 48 103 50 L108 94 Z" fill="url(#fallbackGoldGlow)" stroke="#B45309" strokeWidth="0.8" />
        <ellipse cx="100" cy="75" rx="8" ry="3" fill="#FEF08A" stroke="#B45309" strokeWidth="0.5" />
        <ellipse cx="100" cy="62" rx="5" ry="2" fill="#FEF08A" stroke="#B45309" strokeWidth="0.5" />

        {/* Cogwheel */}
        <circle cx="100" cy="148" r="20" fill="url(#fallbackGearGrad)" stroke="#334155" strokeWidth="1.5" />
        <circle cx="100" cy="148" r="9" fill="#F8FAFC" stroke="#334155" strokeWidth="1.5" />

        {/* Ribbons */}
        <path d="M60 170 Q100 182 140 170 L145 186 Q100 198 55 186 Z" fill="url(#fallbackLaoRed)" stroke="#FACC15" strokeWidth="1" />
        <text x="100" y="181" textAnchor="middle" fill="#FEF08A" fontSize="7" fontWeight="700">
          ສ.ປ.ປ ລາວ
        </text>
      </svg>
    );
  };

  if (variant === 'medallion') {
    return (
      <div className="relative inline-flex items-center justify-center group">
        {showHalo && (
          <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/30 to-amber-300/20 rounded-full blur-xl animate-pulse -z-10" />
        )}
        <div className="relative p-2 rounded-2xl bg-gradient-to-b from-white/20 via-white/10 to-transparent border border-white/30 shadow-xl backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-amber-400/50 hover:shadow-amber-500/20">
          {renderEmblem()}
        </div>
      </div>
    );
  }

  if (variant === 'glow') {
    return (
      <div className="relative inline-flex items-center justify-center">
        <div className="absolute -inset-2 bg-gradient-to-r from-amber-400/30 via-yellow-300/20 to-amber-500/30 rounded-full blur-md" />
        <div className="relative z-10 transition-transform duration-300 hover:scale-105">
          {renderEmblem()}
        </div>
      </div>
    );
  }

  if (variant === 'badge') {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-transparent border border-amber-400/30 shadow-xs">
        {renderEmblem()}
        <div className="flex flex-col text-left">
          <span className="text-[10px] font-bold text-amber-600 dark:text-amber-300 uppercase tracking-wide">
            ສປປ ລາວ
          </span>
          <span className="text-[11px] font-bold text-slate-800 dark:text-white leading-tight">
            ແຂວງຫົວພັນ
          </span>
        </div>
      </div>
    );
  }

  return renderEmblem();
};
