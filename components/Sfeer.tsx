import type { Sfeer as SfeerNaam, CadeautjeKleuren } from '@/lib/config';
import { meng } from '@/lib/kleur';

// De illustratie langs de rand van de kaart: vlaggetjes bovenaan, een landschap onderaan.
// Alle kleuren komen uit de huisstijl, dus ook een eigen kleurenset krijgt een passende illustratie.

export const SFEER_BOVEN: SfeerNaam[] = ['vlaggetjes'];
export const heeftOnderkant = (sfeer: SfeerNaam) => sfeer !== 'geen' && !SFEER_BOVEN.includes(sfeer);
export const heeftBovenkant = (sfeer: SfeerNaam) => SFEER_BOVEN.includes(sfeer);

const HOOGTE_ONDER = 'h-[96px] sm:h-[130px]';

// ─── Onderkant ────────────────────────────────────────────────

function Den({ x, y, s, kleur, sneeuw }: { x: number; y: number; s: number; kleur: string; sneeuw: string }) {
  // Drie lagen driehoeken boven elkaar, met een sneeuwlaagje op elke punt
  const laag = (top: number, breed: number, hoog: number) => (
    <g key={top}>
      <polygon points={`${x},${y - top} ${x - breed * s},${y - top + hoog * s} ${x + breed * s},${y - top + hoog * s}`} fill={kleur} />
      <polygon points={`${x},${y - top} ${x - breed * s * 0.45},${y - top + hoog * s * 0.45} ${x + breed * s * 0.45},${y - top + hoog * s * 0.45}`} fill={sneeuw} opacity="0.92" />
    </g>
  );
  return (
    <g>
      <rect x={x - 3 * s} y={y - 6 * s} width={6 * s} height={8 * s} fill={meng(kleur, '#000000', 0.5)} />
      {laag(58 * s, 20, 26)}
      {laag(42 * s, 25, 30)}
      {laag(22 * s, 30, 34)}
    </g>
  );
}

function Dennen({ k }: { k: CadeautjeKleuren }) {
  const den = meng(k.primair, '#000000', 0.3);
  return (
    <>
      <path d="M0 130V72Q140 38 300 74T600 58T800 78V130Z" fill={meng(k.achtergrond, '#ffffff', 0.13)} />
      <path d="M0 130V96Q160 70 330 98T640 86T800 96V130Z" fill={meng(k.achtergrond, '#ffffff', 0.22)} />
      {[[70, 108, 0.9], [150, 112, 0.7], [230, 106, 1], [455, 108, 0.75], [540, 100, 1.05], [620, 110, 0.8], [715, 104, 0.95], [770, 112, 0.65]].map(([x, y, s], i) => (
        <Den key={i} x={x} y={y} s={s} kleur={den} sneeuw={k.licht} />
      ))}
      <path d="M0 130V112Q120 94 270 111T550 104T800 108V130Z" fill={k.licht} />
      <path d="M0 130V121Q200 108 400 120T800 116V130Z" fill={meng(k.licht, k.achtergrond, 0.12)} />
      {[[60, 118], [180, 124], [330, 121], [470, 124], [600, 119], [740, 124]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="2" fill="#fff" opacity="0.7" />
      ))}
    </>
  );
}

// Daken met trapgevels en verlichte raampjes
const HUIZEN = [
  { x: 0, b: 62, h: 62, g: 'trap' }, { x: 62, b: 52, h: 82, g: 'klok' }, { x: 114, b: 70, h: 56, g: 'punt' },
  { x: 184, b: 58, h: 76, g: 'trap' }, { x: 242, b: 50, h: 52, g: 'klok' }, { x: 292, b: 66, h: 88, g: 'punt' },
  { x: 358, b: 54, h: 60, g: 'trap' }, { x: 412, b: 62, h: 78, g: 'klok' }, { x: 474, b: 56, h: 54, g: 'punt' },
  { x: 530, b: 68, h: 84, g: 'trap' }, { x: 598, b: 52, h: 58, g: 'klok' }, { x: 650, b: 64, h: 74, g: 'punt' },
  { x: 714, b: 54, h: 66, g: 'trap' }, { x: 768, b: 40, h: 56, g: 'klok' },
] as const;

function Huis({ x, b, h, g, y0, kleur }: { x: number; b: number; h: number; g: string; y0: number; kleur: string }) {
  const top = y0 - h;
  const m = x + b / 2;
  let d: string;
  if (g === 'punt') d = `M${x} ${y0}V${top}L${m} ${top - 16}L${x + b} ${top}V${y0}Z`;
  else if (g === 'klok') d = `M${x} ${y0}V${top}Q${x} ${top - 14} ${m} ${top - 14}Q${x + b} ${top - 14} ${x + b} ${top}V${y0}Z`;
  else d = `M${x} ${y0}V${top - 6}H${x + b * 0.25}V${top - 12}H${x + b * 0.5}V${top - 18}H${x + b * 0.75}V${top - 12}H${x + b}V${y0}Z`;
  return <path d={d} fill={kleur} />;
}

function Daken({ k }: { k: CadeautjeKleuren }) {
  const achter = meng(k.achtergrond, '#000000', 0.25);
  const voor = meng(k.achtergrond, '#000000', 0.5);
  return (
    <>
      <circle cx="680" cy="34" r="16" fill={k.accent} opacity="0.9" />
      <circle cx="674" cy="30" r="14" fill={meng(k.achtergrond, '#000000', 0.12)} opacity="0.5" />
      <g opacity="0.75">{HUIZEN.map((h, i) => <Huis key={i} {...h} x={h.x + 22} y0={118} kleur={achter} />)}</g>
      {HUIZEN.map((h, i) => <Huis key={i} {...h} y0={134} kleur={voor} />)}
      {HUIZEN.map((h, i) => {
        // Een deel van de raampjes brandt: vaste verdeling, geen toeval
        const ramen = [];
        for (let rij = 0; rij < Math.floor((h.h - 14) / 22); rij++) {
          for (let kol = 0; kol < (h.b > 58 ? 2 : 1); kol++) {
            if ((i * 7 + rij * 3 + kol * 5) % 3 === 0) continue;
            const cx = h.x + (h.b > 58 ? 16 + kol * 26 : h.b / 2 - 4);
            ramen.push(<rect key={`${rij}-${kol}`} x={cx} y={134 - h.h + 10 + rij * 22} width="9" height="12" rx="1.500" fill={k.accent} opacity="0.9" />);
          }
        }
        return <g key={i}>{ramen}</g>;
      })}
      <rect x="0" y="126" width="800" height="4" fill={voor} />
    </>
  );
}

function Gras({ k }: { k: CadeautjeKleuren }) {
  const bloem = [k.tegels[1], k.accent, k.tegels[2], k.secundair, k.tegels[0]];
  const gras = k.primair;
  return (
    <>
      <path d="M0 130V82Q150 52 320 84T640 70T800 82V130Z" fill={meng(k.achtergrond, gras, 0.45)} />
      <path d="M0 130V100Q180 76 360 102T700 92T800 100V130Z" fill={meng(gras, '#ffffff', 0.12)} />
      <path d="M0 130V114Q200 98 400 114T800 110V130Z" fill={gras} />
      {[40, 120, 205, 300, 392, 480, 575, 668, 750].map((x, i) => {
        const y = 100 + ((i * 11) % 9);
        const h = 26 + ((i * 7) % 14);
        const c = bloem[i % bloem.length];
        return (
          <g key={x}>
            <path d={`M${x} ${y + 22}Q${x + 3} ${y + h * 0.4} ${x} ${y}`} stroke={meng(gras, '#000000', 0.3)} strokeWidth="2.200" fill="none" strokeLinecap="round" />
            <path d={`M${x} ${y + 14}q-9 -2 -11 -9q8 0 11 9z`} fill={meng(gras, '#000000', 0.15)} />
            {[0, 72, 144, 216, 288].map((hoek) => (
              <ellipse key={hoek} cx={x} cy={y - 6} rx="4.200" ry="6.500" fill={c} transform={`rotate(${hoek} ${x} ${y})`} />
            ))}
            <circle cx={x} cy={y} r="3.400" fill={meng(k.accent, '#ffffff', 0.25)} />
          </g>
        );
      })}
    </>
  );
}

function Golven({ k }: { k: CadeautjeKleuren }) {
  const zee = k.primair;
  return (
    <>
      <circle cx="130" cy="112" r="46" fill={k.accent} opacity="0.95" />
      {[...Array(9)].map((_, i) => (
        <rect key={i} x="127" y="38" width="6" height="18" rx="3" fill={k.accent} opacity="0.7" transform={`rotate(${i * 20 - 80} 130 112)`} />
      ))}
      <path d="M0 130V78Q100 62 200 78T400 78T600 78T800 78V130Z" fill={meng(zee, '#000000', 0.25)} />
      {/* Zeilbootje */}
      <g transform="translate(560 48)">
        <path d="M24 0v34L2 34z" fill={k.licht} />
        <path d="M28 8v26h18z" fill={k.tegels[1]} />
        <path d="M-2 38h54l-8 10H8z" fill={k.secundair} />
      </g>
      <path d="M0 130V94Q100 78 200 94T400 94T600 94T800 94V130Z" fill={zee} />
      <path d="M0 130V110Q100 96 200 110T400 110T600 110T800 110V130Z" fill={meng(zee, '#ffffff', 0.28)} />
      <path d="M0 130V122Q100 112 200 122T400 122T600 122T800 122V130Z" fill={meng(zee, '#ffffff', 0.5)} />
    </>
  );
}

function Heuvels({ k }: { k: CadeautjeKleuren }) {
  const groen = k.primair;
  return (
    <>
      <path d="M0 130V74Q160 36 340 78T680 60T800 76V130Z" fill={meng(k.achtergrond, groen, 0.3)} />
      <path d="M0 130V98Q200 62 420 100T800 84V130Z" fill={meng(k.achtergrond, groen, 0.55)} />
      <path d="M0 130V112Q180 90 380 112T800 104V130Z" fill={groen} />
      {[[90, 106, 0], [210, 112, 1], [350, 111, 2], [520, 106, 3], [640, 110, 0], [740, 104, 1]].map(([x, y, c], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="4" fill={k.tegels[c]} />
          <circle cx={x} cy={y} r="1.600" fill={k.licht} />
        </g>
      ))}
    </>
  );
}

// ─── Bovenkant: een slinger met vlaggetjes ─────────────────────

// Afronden: server en browser rekenen net anders door, en dat geeft anders een hydration-fout
const r2 = (n: number) => Math.round(n * 100) / 100;

type Punt = [number, number];
const kwad = (a: Punt, b: Punt, c: Punt, t: number): Punt => [
  (1 - t) ** 2 * a[0] + 2 * (1 - t) * t * b[0] + t * t * c[0],
  (1 - t) ** 2 * a[1] + 2 * (1 - t) * t * b[1] + t * t * c[1],
];

function Vlaggetjes({ k }: { k: CadeautjeKleuren }) {
  const kleuren = [k.accent, k.tegels[1], k.tegels[2], k.licht, k.secundair, k.tegels[0]];
  const touwen: [Punt, Punt, Punt][] = [[[-20, 6], [200, 78], [410, 14]], [[390, 14], [600, 78], [820, 6]]];
  let nr = 0;
  return (
    <>
      {touwen.map(([a, b, c], i) => (
        <path key={i} d={`M${a[0]} ${a[1]}Q${b[0]} ${b[1]} ${c[0]} ${c[1]}`} stroke={meng(k.achtergrond, '#ffffff', 0.5)} strokeWidth="2" fill="none" />
      ))}
      {touwen.flatMap(([a, b, c]) =>
        Array.from({ length: 9 }, (_, i) => {
          const t = (i + 0.7) / 9.6;
          const p = kwad(a, b, c, t);
          const q = kwad(a, b, c, t + 0.01);
          const hoek = (Math.atan2(q[1] - p[1], q[0] - p[0]) * 180) / Math.PI;
          const kleur = kleuren[nr++ % kleuren.length];
          return (
            <g key={`${a[0]}-${i}`} transform={`translate(${r2(p[0])} ${r2(p[1])}) rotate(${r2(hoek)})`}>
              <polygon points="-13,0 13,0 0,34" fill={kleur} stroke="rgba(0,0,0,0.25)" strokeWidth="1" strokeLinejoin="round" />
              <polygon points="-13,0 0,0 -4,22" fill="#fff" opacity="0.18" />
            </g>
          );
        }),
      )}
    </>
  );
}

// ─── Samen ────────────────────────────────────────────────────

export default function Sfeer({ sfeer, kleuren, plek }: { sfeer: SfeerNaam; kleuren: CadeautjeKleuren; plek: 'boven' | 'onder' }) {
  if (plek === 'boven') {
    if (!heeftBovenkant(sfeer)) return null;
    return (
      <svg viewBox="0 0 800 80" preserveAspectRatio="xMidYMin slice" aria-hidden className="pointer-events-none absolute left-0 top-0 h-[56px] w-full sm:h-[80px]">
        <Vlaggetjes k={kleuren} />
      </svg>
    );
  }
  if (!heeftOnderkant(sfeer)) return null;
  return (
    <svg viewBox="0 0 800 130" preserveAspectRatio="xMidYMax slice" aria-hidden className={`pointer-events-none absolute bottom-0 left-0 w-full ${HOOGTE_ONDER}`}>
      {sfeer === 'dennen' && <Dennen k={kleuren} />}
      {sfeer === 'daken' && <Daken k={kleuren} />}
      {sfeer === 'gras' && <Gras k={kleuren} />}
      {sfeer === 'golven' && <Golven k={kleuren} />}
      {sfeer === 'heuvels' && <Heuvels k={kleuren} />}
    </svg>
  );
}
