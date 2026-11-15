import type { Decor as DecorNaam } from '@/lib/config';

// Zachtjes zwevend decor in de kaart, in de kleuren van de huisstijl. De posities staan vast (geen toeval),
// zodat server en browser hetzelfde tekenen. Elke vorm is een gevulde tekening op een vlak van 24 x 24.

const AANTAL = 16;
const deeltjes = Array.from({ length: AANTAL }, (_, i) => ({
  x: (i * 37 + 6) % 94,
  grootte: 22 + ((i * 7) % 6) * 7,
  duur: 13 + ((i * 5) % 10),
  start: -((i * 13) % 19),
  drift: (i % 2 === 0 ? 1 : -1) * (16 + ((i * 11) % 40)),
  draai: (i % 2 === 0 ? 1 : -1) * (60 + ((i * 23) % 160)),
}));

// Vaste sterretjes en zonnetjes
export const STERREN = [
  { x: 8, y: 6, s: 16 }, { x: 88, y: 8, s: 22 }, { x: 20, y: 38, s: 12 },
  { x: 94, y: 34, s: 14 }, { x: 5, y: 66, s: 14 }, { x: 70, y: 52, s: 12 },
  { x: 50, y: 4, s: 14 }, { x: 36, y: 80, s: 16 }, { x: 84, y: 76, s: 14 },
];

const ZONNEN = [
  { x: 2, y: 2, s: 70 }, { x: 84, y: 52, s: 50 }, { x: 10, y: 66, s: 38 },
];

function Vorm({ decor, kleur }: { decor: Exclude<DecorNaam, 'geen' | 'sterren' | 'zon'>; kleur: string }) {
  const rand = 'rgba(0,0,0,0.25)';
  switch (decor) {
    case 'ballonnen':
      return (
        <svg viewBox="0 0 24 32" className="h-full w-full">
          <path d="M12 2C7 2 3.600 5.800 3.600 10.400c0 4.600 4 8.300 8.400 9.600 4.400-1.300 8.400-5 8.400-9.600C20.400 5.800 17 2 12 2z" fill={kleur} stroke={rand} strokeWidth="0.6" />
          <path d="M7 6.500c1.200-1.500 3-2.300 4.600-2.300" stroke="#fff" strokeWidth="1.400" strokeLinecap="round" fill="none" opacity="0.65" />
          <path d="M10.800 20l1.200 2 1.200-2z" fill={kleur} stroke={rand} strokeWidth="0.5" />
          <path d="M12 22c-2 2.500 2 4.500 0 9" stroke="rgba(255,255,255,0.55)" strokeWidth="0.8" fill="none" />
        </svg>
      );
    case 'hartjes':
      return (
        <svg viewBox="0 0 24 24" className="h-full w-full">
          <path d="M12 21s-9-5.600-9-12A5 5 0 0 1 12 6.200 5 5 0 0 1 21 9c0 6.400-9 12-9 12z" fill={kleur} stroke={rand} strokeWidth="0.6" />
          <path d="M6.500 8.500c.5-1.400 1.800-2.200 3.200-2" stroke="#fff" strokeWidth="1.400" strokeLinecap="round" fill="none" opacity="0.6" />
        </svg>
      );
    case 'bloemen':
      return (
        <svg viewBox="0 0 24 24" className="h-full w-full">
          {[0, 72, 144, 216, 288].map((h) => (
            <ellipse key={h} cx="12" cy="6.500" rx="3.800" ry="5.500" fill={kleur} stroke={rand} strokeWidth="0.5" transform={`rotate(${h} 12 12)`} />
          ))}
          <circle cx="12" cy="12" r="3.200" fill="#ffd166" stroke={rand} strokeWidth="0.5" />
        </svg>
      );
    case 'sneeuw':
      return (
        <svg viewBox="0 0 24 24" className="h-full w-full" fill="none" stroke={kleur} strokeWidth="1.600" strokeLinecap="round">
          {[0, 60, 120].map((h) => (
            <g key={h} transform={`rotate(${h} 12 12)`}>
              <path d="M12 2v20M9 5l3 2.500L15 5M9 19l3-2.500L15 19" />
            </g>
          ))}
        </svg>
      );
    case 'bladeren':
      return (
        <svg viewBox="0 0 24 24" className="h-full w-full">
          <path d="M12 2C5 5 3.500 12 5.500 16.500 7 20 10 22 12 23c2-1 5-3 6.500-6.500C20.500 12 19 5 12 2z" fill={kleur} stroke={rand} strokeWidth="0.6" />
          <path d="M12 22V8M12 13l-3.500-2.500M12 17l4-3" stroke="rgba(0,0,0,0.3)" strokeWidth="1" strokeLinecap="round" fill="none" />
        </svg>
      );
  }
}

export default function Decor({ decor, kleuren }: { decor: DecorNaam; kleuren: string[] }) {
  if (decor === 'geen') return null;

  if (decor === 'sterren') {
    return (
      <>
        {STERREN.map((s, i) => (
          <span
            key={i}
            aria-hidden
            className="cad-twinkel absolute text-goud pointer-events-none"
            style={{ left: `${s.x}%`, top: `${s.y}%`, fontSize: s.s, animationDelay: `${i * 0.35}s` }}
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
          <span key={i} aria-hidden className="cad-zon text-goud" style={{ left: `${z.x}%`, top: `${z.y}%`, width: z.s, height: z.s, ['--cad-start' as string]: `${-i * 2.500}s` }}>
            <svg viewBox="0 0 24 24" className="h-full w-full" fill="currentColor" stroke="none">
              <circle cx="12" cy="12" r="5" />
              {[...Array(8)].map((_, r) => <rect key={r} x="11" y="1" width="2" height="4.500" rx="1" transform={`rotate(${r * 45} 12 12)`} />)}
            </svg>
          </span>
        ))}
      </>
    );
  }

  // Ballonnen en hartjes stijgen, de rest valt
  const omhoog = decor === 'ballonnen' || decor === 'hartjes';
  return (
    <>
      {deeltjes.map((d, i) => (
        <span
          key={i}
          aria-hidden
          className={`cad-zweef ${omhoog ? 'cad-zweef-op' : ''}`}
          style={{
            left: `${d.x}%`,
            [omhoog ? 'bottom' : 'top']: 0,
            width: d.grootte,
            height: decor === 'ballonnen' ? d.grootte * 1.33 : d.grootte,
            ['--cad-duur' as string]: `${d.duur}s`,
            ['--cad-start' as string]: `${d.start}s`,
            ['--cad-drift' as string]: `${d.drift}px`,
            ['--cad-draai' as string]: `${omhoog ? d.draai / 8 : d.draai}deg`,
            ['--cad-dekking' as string]: decor === 'sneeuw' ? 0.55 : decor === 'bladeren' ? 0.7 : 0.8,
          }}
        >
          <Vorm decor={decor} kleur={kleuren[i % kleuren.length]} />
        </span>
      ))}
    </>
  );
}
