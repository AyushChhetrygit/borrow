import { Package } from "lucide-react";
import type { ReactNode } from "react";

const F = "#15370D";
const S = "#728E6D";
const G = "#E5CD82";
const C = "#FFF2B4";

/** Hand-drawn brand illustrations so the prototype never depends on remote photos. */
const ART: Record<string, ReactNode> = {
  calc: (
    <g>
      <rect x="55" y="25" width="90" height="150" rx="14" fill={F} />
      <rect x="67" y="38" width="66" height="30" rx="6" fill={C} />
      <text x="127" y="61" textAnchor="end" fontSize="20" fontWeight="700" fill={F} fontFamily="monospace">128</text>
      {[0, 1, 2, 3].map((r) =>
        [0, 1, 2].map((c) => (
          <rect key={`${r}${c}`} x={67 + c * 23} y={80 + r * 22} width="18" height="16" rx="4" fill={c === 2 ? G : S} />
        ))
      )}
    </g>
  ),
  "sci-calc": (
    <g>
      <rect x="52" y="18" width="96" height="164" rx="14" fill={F} />
      <rect x="64" y="30" width="72" height="28" rx="6" fill={C} />
      <rect x="100" y="34" width="30" height="6" rx="2" fill={S} opacity=".5" />
      <text x="130" y="53" textAnchor="end" fontSize="16" fontWeight="700" fill={F} fontFamily="monospace">sin30</text>
      {[0, 1, 2, 3, 4].map((c) => (
        <rect key={c} x={64 + c * 15} y="66" width="12" height="9" rx="3" fill={G} />
      ))}
      {[0, 1, 2, 3, 4].map((r) =>
        [0, 1, 2, 3].map((c) => (
          <rect key={`${r}${c}`} x={64 + c * 18.5} y={84 + r * 19} width="15" height="14" rx="4" fill={c === 3 ? G : S} />
        ))
      )}
    </g>
  ),
  stapler: (
    <g>
      <rect x="35" y="125" width="130" height="22" rx="8" fill={S} />
      <path d="M40 125 L40 100 Q40 80 62 80 L158 92 Q168 94 168 106 L168 125 Z" fill={F} />
      <rect x="45" y="140" width="110" height="8" rx="3" fill={G} />
      <circle cx="52" cy="112" r="6" fill={G} />
    </g>
  ),
  scissors: (
    <g>
      <circle cx="68" cy="140" r="22" fill="none" stroke={F} strokeWidth="9" />
      <circle cx="132" cy="140" r="22" fill="none" stroke={S} strokeWidth="9" />
      <path d="M78 120 L128 30 L138 38 L96 128 Z" fill="#c9d3c6" stroke={F} strokeWidth="3" strokeLinejoin="round" />
      <path d="M122 120 L72 30 L62 38 L104 128 Z" fill="#e6ebe4" stroke={F} strokeWidth="3" strokeLinejoin="round" />
      <circle cx="100" cy="106" r="5" fill={G} stroke={F} strokeWidth="2" />
    </g>
  ),
  cutter: (
    <g transform="rotate(-25 100 100)">
      <rect x="30" y="80" width="105" height="40" rx="10" fill={F} />
      <rect x="40" y="90" width="55" height="20" rx="5" fill={G} />
      <path d="M135 84 L178 100 L135 116 Z" fill="#dfe5dc" stroke={F} strokeWidth="3" strokeLinejoin="round" />
      <circle cx="112" cy="100" r="6" fill={S} />
    </g>
  ),
  brushes: (
    <g>
      {[
        { x: 60, c: F, t: S },
        { x: 100, c: S, t: G },
        { x: 140, c: G, t: F },
      ].map((b, i) => (
        <g key={i} transform={`rotate(${(i - 1) * 12} ${b.x} 100)`}>
          <rect x={b.x - 6} y="95" width="12" height="85" rx="6" fill={b.c} />
          <rect x={b.x - 8} y="78" width="16" height="22" rx="3" fill="#c9d3c6" />
          <path d={`M${b.x - 8} 78 Q${b.x} 30 ${b.x + 8} 78 Z`} fill={b.t} />
        </g>
      ))}
    </g>
  ),
  cable: (
    <g>
      <path d="M45 60 C 160 40, 170 100, 100 110 S 40 160, 150 150" fill="none" stroke={F} strokeWidth="9" strokeLinecap="round" />
      <rect x="25" y="48" width="30" height="24" rx="5" fill={S} />
      <rect x="19" y="54" width="10" height="12" rx="2" fill={G} />
      <rect x="146" y="138" width="32" height="24" rx="5" fill={S} />
      <rect x="174" y="145" width="10" height="10" rx="2" fill={G} />
    </g>
  ),
  powerbank: (
    <g>
      <rect x="50" y="35" width="100" height="135" rx="18" fill={F} />
      <rect x="62" y="48" width="76" height="8" rx="4" fill={S} />
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={66 + i * 17} y="80" width="12" height="18" rx="3" fill={i < 3 ? G : S} />
      ))}
      <path d="M108 120 L96 140 H104 L98 158 L114 134 H106 Z" fill={C} />
      <rect x="88" y="26" width="24" height="12" rx="3" fill={S} />
    </g>
  ),
  hdmi: (
    <g>
      <path d="M52 85 C 90 85, 90 140, 148 140" fill="none" stroke={F} strokeWidth="9" strokeLinecap="round" />
      <path d="M22 70 H62 V100 H22 Z" fill={S} />
      <path d="M22 70 H62 V90 L56 100 H22 Z" fill={S} />
      <rect x="28" y="78" width="28" height="8" rx="2" fill={G} />
      <path d="M142 125 H182 V155 H142 Z" fill={S} />
      <rect x="148" y="133" width="28" height="8" rx="2" fill={G} />
    </g>
  ),
  extension: (
    <g>
      <rect x="35" y="65" width="130" height="50" rx="12" fill={F} />
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <rect x={46 + i * 30} y="76" width="22" height="28" rx="5" fill={C} />
          <rect x={52 + i * 30} y="84" width="3" height="8" rx="1" fill={F} />
          <rect x={60 + i * 30} y="84" width="3" height="8" rx="1" fill={F} />
        </g>
      ))}
      <circle cx="152" cy="73" r="2.5" fill={G} />
      <path d="M100 115 C 100 150, 60 140, 50 170" fill="none" stroke={S} strokeWidth="7" strokeLinecap="round" />
    </g>
  ),
  mic: (
    <g>
      <rect x="88" y="30" width="24" height="82" rx="12" fill={F} />
      <rect x="94" y="38" width="12" height="45" rx="6" fill={C} />
      <path d="M70 88 Q70 126 100 126 Q130 126 130 88 M100 126 V158 M78 158 H122" fill="none" stroke={S} strokeWidth="8" strokeLinecap="round" />
      <path d="M100 158 C145 158 150 175 168 168" fill="none" stroke={F} strokeWidth="6" strokeLinecap="round" />
      <circle cx="174" cy="166" r="8" fill={G} />
    </g>
  ),
  speaker: (
    <g>
      <rect x="47" y="30" width="106" height="142" rx="20" fill={F} />
      <circle cx="100" cy="84" r="29" fill={S} />
      <circle cx="100" cy="84" r="13" fill={C} />
      <circle cx="100" cy="137" r="15" fill={G} />
      <circle cx="100" cy="137" r="5" fill={F} />
    </g>
  ),
  umbrella: (
    <g>
      <path d="M25 100 A75 70 0 0 1 175 100 Q160 88 150 100 Q137 88 125 100 Q112 88 100 100 Q88 88 75 100 Q62 88 50 100 Q38 88 25 100 Z" fill={F} />
      <path d="M100 30 Q70 50 75 100 M100 30 Q130 50 125 100" fill="none" stroke={G} strokeWidth="4" />
      <rect x="97" y="100" width="6" height="62" fill={S} />
      <path d="M100 162 Q100 182 82 178" fill="none" stroke={S} strokeWidth="7" strokeLinecap="round" />
      <circle cx="100" cy="28" r="4" fill={G} />
    </g>
  ),
  raincoat: (
    <g>
      <path d="M70 65 Q76 28 100 28 Q124 28 130 65 L162 92 L146 174 H54 L38 92 Z" fill={F} />
      <path d="M83 66 Q83 43 100 43 Q117 43 117 66" fill="none" stroke={C} strokeWidth="7" strokeLinecap="round" />
      <path d="M100 70 V170 M66 104 L48 144 M134 104 L152 144" fill="none" stroke={S} strokeWidth="7" strokeLinecap="round" />
      <circle cx="100" cy="98" r="4" fill={G} />
    </g>
  ),
  racket: (
    <g>
      <rect x="92" y="125" width="16" height="55" rx="6" fill={G} />
      <rect x="90" y="120" width="20" height="14" rx="3" fill={S} />
      <ellipse cx="100" cy="82" rx="52" ry="55" fill={F} />
      <ellipse cx="100" cy="82" rx="41" ry="44" fill={S} />
      <circle cx="162" cy="48" r="11" fill={C} stroke={G} strokeWidth="2" />
    </g>
  ),
  volleyball: (
    <g>
      <circle cx="100" cy="100" r="66" fill={C} stroke={F} strokeWidth="6" />
      <path d="M49 58 Q100 79 100 100 Q100 128 147 143 M151 57 Q116 76 100 100 Q79 128 51 142 M100 34 Q122 64 118 86" fill="none" stroke={S} strokeWidth="7" strokeLinecap="round" />
    </g>
  ),
  basketball: (
    <g>
      <circle cx="100" cy="100" r="66" fill="#dd7b29" stroke={F} strokeWidth="6" />
      <path d="M34 100 H166 M100 34 V166 M53 53 Q100 82 147 53 M53 147 Q100 118 147 147" fill="none" stroke={F} strokeWidth="6" strokeLinecap="round" />
    </g>
  ),
  tennis: (
    <g transform="rotate(24 100 100)">
      <rect x="92" y="120" width="16" height="63" rx="6" fill={G} />
      <ellipse cx="100" cy="75" rx="48" ry="57" fill="none" stroke={F} strokeWidth="12" />
      <path d="M63 55 H137 M54 75 H146 M63 95 H137 M80 24 V126 M100 18 V132 M120 24 V126" stroke={S} strokeWidth="3" />
      <circle cx="160" cy="55" r="13" fill={C} stroke={G} strokeWidth="3" />
    </g>
  ),
  cricket: (
    <g>
      <path d="M70 35 L122 69 L100 119 L48 86 Z" fill={G} stroke={F} strokeWidth="5" />
      <path d="M100 119 L134 171" stroke={F} strokeWidth="14" strokeLinecap="round" />
      <path d="M143 62 V145 M158 62 V145 M173 62 V145 M136 67 H180 M136 142 H180" stroke={S} strokeWidth="6" strokeLinecap="round" />
      <circle cx="50" cy="154" r="15" fill="#a54232" stroke={F} strokeWidth="3" />
      <path d="M41 146 Q50 154 59 146 M41 162 Q50 154 59 162" fill="none" stroke={C} strokeWidth="2" />
    </g>
  ),
  chess: (
    <g>
      {[0, 1, 2, 3].map((r) =>
        [0, 1, 2, 3].map((c) => (
          <rect key={`${r}${c}`} x={30 + c * 35} y={100 + r * 20} width="35" height="20" fill={(r + c) % 2 ? F : C} />
        ))
      )}
      <rect x="30" y="100" width="140" height="80" fill="none" stroke={F} strokeWidth="3" />
      <path d="M100 30 V42 M94 36 H106" stroke={F} strokeWidth="4" strokeLinecap="round" />
      <path d="M85 92 Q85 55 100 48 Q115 55 115 92 Z" fill={S} />
      <rect x="78" y="90" width="44" height="10" rx="4" fill={F} />
    </g>
  ),
  cards: (
    <g>
      <rect x="40" y="40" width="85" height="120" rx="10" fill="#fff" stroke={F} strokeWidth="3" transform="rotate(-12 80 100)" />
      <text x="52" y="75" fontSize="22" fontWeight="700" fill={S} transform="rotate(-12 80 100)">A</text>
      <rect x="75" y="38" width="85" height="120" rx="10" fill="#fff" stroke={F} strokeWidth="3" transform="rotate(10 120 100)" />
      <text x="88" y="72" fontSize="22" fontWeight="700" fill={F} transform="rotate(10 120 100)">K</text>
      <path d="M118 112 C 98 92, 112 78, 118 92 C 124 78, 138 92, 118 112 Z" fill={F} transform="rotate(10 120 100)" />
      <circle cx="105" cy="122" r="0" fill={G} />
    </g>
  ),
  boardgame: (
    <g>
      <rect x="35" y="55" width="130" height="100" rx="10" fill={F} />
      <rect x="35" y="55" width="130" height="22" rx="10" fill={S} />
      <rect x="47" y="90" width="50" height="50" rx="6" fill={C} />
      <circle cx="62" cy="105" r="4" fill={F} />
      <circle cx="82" cy="125" r="4" fill={F} />
      <circle cx="72" cy="115" r="4" fill={F} />
      <circle cx="132" cy="108" r="14" fill={G} />
      <circle cx="132" cy="108" r="6" fill={F} />
      <rect x="110" y="128" width="40" height="8" rx="4" fill={G} />
    </g>
  ),
  generic: (
    <g>
      <rect x="45" y="60" width="110" height="90" rx="12" fill={F} />
      <rect x="45" y="60" width="110" height="24" rx="12" fill={S} />
      <rect x="85" y="95" width="30" height="8" rx="4" fill={G} />
    </g>
  ),
};

export function ProductArt({ art, className = "" }: { art: string; className?: string }) {
  const node = ART[art];
  return (
    <svg viewBox="0 0 200 200" className={className} role="img" aria-hidden="true">
      {node ?? ART.generic}
    </svg>
  );
}

/** Shows the admin-provided image if present (falls back to illustration if it fails to load). */
import { useState, useEffect } from "react";

export function ProductImage({
  image,
  art,
  alt,
  className = "",
}: {
  image: string;
  art: string;
  alt: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [image]);

  if (image && !failed) {
    return (
      <img
        src={image}
        alt={alt}
        loading="lazy"
        onError={() => setFailed(true)}
        className={`h-full w-full object-cover ${className}`}
      />
    );
  }
  return (
    <div className={`flex h-full w-full items-center justify-center bg-cream/50 ${className}`}>
      {ART[art] || !art ? (
        <ProductArt art={art} className="h-[88%] w-[88%]" />
      ) : (
        <Package className="h-1/2 w-1/2 text-sage" />
      )}
    </div>
  );
}
