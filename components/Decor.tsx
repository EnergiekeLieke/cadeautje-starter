import CadeauIcoon from '@/components/CadeauIcoon';
import type { Decor as DecorNaam, IcoonNaam } from '@/lib/config';

// Zachtjes zwevend decor in de kaart. De posities staan vast (geen toeval), zodat server en browser hetzelfde tekenen.
const AANTAL = 14;
const deeltjes = Array.from({ length: AANTAL }, (_, i) => ({
  x: (i * 37 + 8) % 96,
  grootte: 14 + ((i * 7) % 5) * 4,
  duur: 11 + ((i * 5) % 9),
  start: -((i * 13) % 17),
  drift: ((i % 2 === 0 ? 1 : -1) * (14 + ((i * 11) % 36))),
  draai: (i % 2 === 0 ? 1 : -1) * (90 + ((i * 23) % 200)),
}));

// Vaste sterretjes en zonnetjes
export const STERREN = [
  { x: 8, y: 6, s: 14, d: 0 }, { x: 88, y: 8, s: 18, d: 0.6 }, { x: 20, y: 38, s: 10, d: 1.2 },
  { x: 94, y: 34, s: 12, d: 1.8 }, { x: 5, y: 66, s: 12, d: 0.3 }, { x: 70, y: 52, s: 10, d: 2.1 },
  { x: 50, y: 4, s: 12, d: 1.5 }, { x: 36, y: 88, s: 14, d: 0.9 }, { x: 84, y: 82, s: 12, d: 2.4 },
];

const ZONNEN = [
  { x: 4, y: 3, s: 44, d: 0 }, { x: 84, y: 60, s: 36, d: 2 }, { x: 12, y: 72, s: 30, d: 4 },
];

const ICOON_BIJ_DECOR: Partial<Record<DecorNaam, IcoonNaam>> = {
  sneeuw: 'sneeuwvlok', hartjes: 'hart', bloemen: 'bloem', ballonnen: 'ballon', bladeren: 'blad',
};

export default function Decor({ decor }: { decor: DecorNaam }) {
  if (decor === 'geen') return null;

  if (decor === 'sterren') {
    return (
      <>
        {STERREN.map((s, i) => (
          <span
            key={i}
            aria-hidden
            className="cad-twinkel absolute text-goud pointer-events-none"
            style={{ left: `${s.x}%`, top: `${s.y}%`, fontSize: s.s, animationDelay: `${s.d}s` }}
          >
            ✦
          </span>
        ))}
      </>
    );
  }

  if (decor === 'zon') {
    return (
      <>
        {ZONNEN.map((z, i) => (
          <span key={i} aria-hidden className="cad-zon text-goud" style={{ left: `${z.x}%`, top: `${z.y}%`, width: z.s, height: z.s, ['--cad-start' as string]: `${-z.d}s` }}>
            <CadeauIcoon naam="zon" className="h-full w-full" />
          </span>
        ))}
      </>
    );
  }

  const icoon = ICOON_BIJ_DECOR[decor];
  if (!icoon) return null;
  // Ballonnen en hartjes stijgen, de rest valt
  const omhoog = decor === 'ballonnen' || decor === 'hartjes';
  return (
    <>
      {deeltjes.map((d, i) => (
        <span
          key={i}
          aria-hidden
          className={`cad-zweef ${omhoog ? 'cad-zweef-op' : ''} text-goud`}
          style={{
            left: `${d.x}%`,
            [omhoog ? 'bottom' : 'top']: 0,
            width: d.grootte,
            height: d.grootte,
            ['--cad-duur' as string]: `${d.duur}s`,
            ['--cad-start' as string]: `${d.start}s`,
            ['--cad-drift' as string]: `${d.drift}px`,
            ['--cad-draai' as string]: `${d.draai}deg`,
          }}
        >
          <CadeauIcoon naam={icoon} className="h-full w-full" />
        </span>
      ))}
    </>
  );
}
