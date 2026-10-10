/* تصاویر برداری محصولات (جایگزین موقت عکس واقعی) */
(function () {
  const S = (inner, vb = "0 0 200 200") =>
    `<svg viewBox="${vb}" xmlns="http://www.w3.org/2000/svg" fill="none" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;
  const p = "var(--primary)", a = "var(--accent)", g = "#cfd8e3", d = "#5b6b7f";

  const ICONS = {
    trocar: S(`<rect x="88" y="20" width="24" height="120" rx="6" fill="#eaf4ff" stroke="${p}" stroke-width="4"/>
      <path d="M88 140 L100 182 L112 140" fill="${g}" stroke="${d}" stroke-width="4"/>
      <rect x="66" y="20" width="68" height="34" rx="10" fill="${p}"/><rect x="128" y="30" width="26" height="12" rx="4" fill="${a}"/>
      <circle cx="100" cy="37" r="7" fill="#fff"/>`),
    needle: S(`<rect x="70" y="18" width="60" height="40" rx="12" fill="${p}"/><circle cx="100" cy="38" r="9" fill="${a}"/>
      <rect x="95" y="58" width="10" height="110" rx="3" fill="#e6ecf3" stroke="${d}" stroke-width="3"/>
      <path d="M95 168 L100 186 L105 168" fill="${d}"/>`),
    grasper: S(`<path d="M40 150 C40 120 60 110 78 118 L92 132" stroke="${p}" stroke-width="10" fill="none"/>
      <path d="M58 168 C70 150 86 148 100 140" stroke="${p}" stroke-width="10" fill="none"/>
      <rect x="92" y="96" width="12" height="70" rx="5" transform="rotate(45 98 131)" fill="${g}" stroke="${d}" stroke-width="3"/>
      <line x1="104" y1="122" x2="160" y2="66" stroke="${d}" stroke-width="8"/>
      <path d="M158 68 L176 36 M160 66 L186 52" stroke="${a}" stroke-width="7"/>`),
    scissors: S(`<circle cx="52" cy="150" r="18" stroke="${p}" stroke-width="9"/><circle cx="82" cy="170" r="18" stroke="${p}" stroke-width="9"/>
      <line x1="66" y1="138" x2="160" y2="44" stroke="${d}" stroke-width="7"/>
      <path d="M160 44 Q176 30 184 22 M156 50 Q178 46 188 42" stroke="${a}" stroke-width="6"/>`),
    suction: S(`<rect x="40" y="60" width="50" height="80" rx="14" fill="${p}"/><circle cx="65" cy="85" r="8" fill="${a}"/><circle cx="65" cy="115" r="8" fill="#fff"/>
      <line x1="90" y1="100" x2="186" y2="100" stroke="${d}" stroke-width="8"/>
      <path d="M50 140 C40 170 20 170 14 186 M80 140 C80 170 70 176 60 190" stroke="${g}" stroke-width="6"/>`),
    bag: S(`<path d="M60 70 Q100 40 140 70 L130 160 Q100 180 70 160 Z" fill="#eaf4ff" stroke="${p}" stroke-width="4"/>
      <path d="M60 70 Q100 90 140 70" stroke="${a}" stroke-width="4"/><line x1="100" y1="20" x2="100" y2="62" stroke="${d}" stroke-width="7"/>`),
    scalpel: S(`<rect x="30" y="84" width="80" height="32" rx="14" fill="${p}"/><rect x="44" y="94" width="20" height="12" rx="4" fill="${a}"/>
      <line x1="110" y1="100" x2="168" y2="100" stroke="${d}" stroke-width="8"/>
      <path d="M168 92 L190 100 L168 108 Z" fill="${a}"/><path d="M30 100 C14 110 14 150 30 170" stroke="${g}" stroke-width="5"/>`),
    clip: S(`<path d="M70 40 L100 150 L130 40" stroke="${p}" stroke-width="14" fill="none"/>
      <path d="M60 160 Q100 190 140 160" stroke="${a}" stroke-width="10" fill="none"/>
      <rect x="86" y="140" width="28" height="20" rx="6" fill="${p}"/>`),
    stapler: S(`<rect x="20" y="110" width="70" height="44" rx="14" fill="${p}"/><path d="M40 154 L32 186 L64 186 L60 154" fill="${p}"/>
      <rect x="90" y="122" width="70" height="14" rx="5" fill="${g}" stroke="${d}" stroke-width="3"/>
      <rect x="150" y="114" width="40" height="12" rx="3" fill="${a}"/><rect x="150" y="132" width="40" height="12" rx="3" fill="${d}"/>
      <circle cx="54" cy="128" r="8" fill="#fff"/>`),
    cartridge: S(`<rect x="30" y="80" width="140" height="40" rx="8" fill="${a}"/>
      ${[0,1,2,3,4,5,6,7].map(i=>`<rect x="${42+i*16}" y="92" width="8" height="16" rx="2" fill="#fff"/>`).join("")}
      <rect x="30" y="126" width="140" height="14" rx="5" fill="${p}"/>`),
    circular: S(`<rect x="20" y="86" width="60" height="38" rx="12" fill="${p}"/><path d="M36 124 L30 170 L58 170 L56 124" fill="${p}"/>
      <rect x="80" y="98" width="70" height="14" rx="5" fill="${g}" stroke="${d}" stroke-width="3"/>
      <circle cx="166" cy="105" r="24" fill="#eaf4ff" stroke="${a}" stroke-width="8"/><circle cx="166" cy="105" r="6" fill="${d}"/>`),
    skin: S(`<path d="M40 130 L40 80 Q40 60 60 60 L150 60 Q170 60 170 80 L170 100 L120 100 L110 140 Z" fill="${p}"/>
      <rect x="100" y="140" width="20" height="10" rx="2" fill="${d}"/><path d="M120 100 L170 100 L160 130 L120 130" fill="${a}"/>
      <path d="M40 170 L180 170" stroke="${g}" stroke-width="5"/><path d="M90 170 v-8 h20 v8 M130 170 v-8 h20 v8" stroke="${d}" stroke-width="4"/>`),
    mesh: S(`<rect x="34" y="34" width="132" height="132" rx="10" fill="#eef6ff" stroke="${p}" stroke-width="4"/>
      ${[1,2,3,4,5,6,7].map(i=>`<line x1="${34+i*16.5}" y1="34" x2="${34+i*16.5}" y2="166" stroke="${p}" stroke-width="1.6" opacity=".6"/><line x1="34" y1="${34+i*16.5}" x2="166" y2="${34+i*16.5}" stroke="${p}" stroke-width="1.6" opacity=".6"/>`).join("")}
      <path d="M34 34 L166 166 M166 34 L34 166" stroke="${a}" stroke-width="1.2" opacity=".5"/>`),
    pencil: S(`<rect x="40" y="82" width="110" height="36" rx="16" fill="${p}" transform="rotate(-30 95 100)"/>
      <rect x="84" y="80" width="16" height="10" rx="3" fill="${a}" transform="rotate(-30 95 100)"/><rect x="104" y="80" width="16" height="10" rx="3" fill="#fff" transform="rotate(-30 95 100)"/>
      <line x1="140" y1="72" x2="176" y2="52" stroke="${d}" stroke-width="5"/>
      <path d="M48 128 C30 150 40 176 20 190" stroke="${g}" stroke-width="5"/>`),
    plate: S(`<rect x="40" y="50" width="120" height="100" rx="20" fill="#eaf4ff" stroke="${p}" stroke-width="4"/>
      <rect x="56" y="66" width="40" height="68" rx="10" fill="${g}"/><rect x="104" y="66" width="40" height="68" rx="10" fill="${g}"/>
      <path d="M100 150 L100 186" stroke="${d}" stroke-width="6"/>`),
    ecg: S(`<circle cx="100" cy="100" r="62" fill="#eaf4ff" stroke="${p}" stroke-width="4"/><circle cx="100" cy="100" r="26" fill="${g}"/>
      <path d="M30 100 H70 L80 76 L94 128 L106 86 L114 100 H170" stroke="${a}" stroke-width="5"/>`),
    spo2: S(`<path d="M50 70 Q50 50 72 50 L150 50 Q170 50 170 70 L170 100 L50 100 Z" fill="${p}"/>
      <path d="M50 100 L170 100 L170 120 Q170 140 150 140 L72 140 Q50 140 50 120 Z" fill="#eaf4ff" stroke="${p}" stroke-width="4"/>
      <circle cx="140" cy="75" r="7" fill="${a}"/><path d="M50 120 C20 130 30 170 14 190" stroke="${d}" stroke-width="5"/>`),
    cuff: S(`<rect x="30" y="60" width="140" height="70" rx="12" fill="${p}"/><rect x="40" y="70" width="40" height="50" rx="6" fill="${a}" opacity=".8"/>
      <path d="M120 130 C120 160 100 170 80 186 M140 130 C140 164 130 176 120 190" stroke="${d}" stroke-width="5"/>`),
    endo: S(`<path d="M30 40 C80 40 60 120 110 120 S170 160 180 180" stroke="${p}" stroke-width="7"/>
      <rect x="14" y="26" width="40" height="28" rx="8" fill="${p}"/>
      <path d="M176 176 L190 164 M176 176 L192 186" stroke="${a}" stroke-width="5"/>`),
    cover: S(`<path d="M60 30 L140 30 L150 180 L50 180 Z" fill="#eaf4ff" stroke="${p}" stroke-width="4" opacity=".9"/>
      <path d="M70 60 L130 60 M68 90 L132 90 M66 120 L134 120 M64 150 L136 150" stroke="${p}" stroke-width="2" opacity=".35"/>
      <rect x="80" y="20" width="40" height="18" rx="5" fill="${a}"/>`),
    shield: S(`<path d="M100 20 L168 46 V100 C168 146 134 172 100 184 C66 172 32 146 32 100 V46 Z" fill="#eaf4ff" stroke="${p}" stroke-width="6"/>
      <path d="M70 102 L92 124 L134 80" stroke="${a}" stroke-width="10"/>`)
  };
  window.ICONS = ICONS;
  window.icon = name => ICONS[name] || ICONS.shield;
})();
