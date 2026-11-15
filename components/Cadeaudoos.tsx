import { useId } from 'react';
import type { Papier, Verpakking, Vorm } from '@/lib/config';
import { meng } from '@/lib/kleur';

// Een ingepakt cadeautje, getekend als doos met deksel, lint, strik en inpakpapier.
// Alle kleuren komen uit de huisstijl: de tegelkleur is het papier, de accentkleur het lint.
// De drie delen hebben een eigen klasse, zodat het deksel eraf kan vliegen als het cadeautje opengaat (zie globals.css):
// .cad-lid (deksel met strik), .cad-body (de doos zelf).

interface Props {
  /** Kleur van het inpakpapier */
  papierKleur: string;
  /** Kleur van patroon en details op het papier (leesbaar tegen het papier) */
  detailKleur: string;
  /** Kleur van lint en strik */
  lintKleur: string;
  papier: Papier;
  verpakking: Verpakking;
  /** De vorm van het cadeautje: een doos, een paasei of een koffer */
  vorm: Vorm;
}

// Een patroontegel van 20 x 20. Elk patroon tekent met `currentColor`, de dekking staat op de laag eroverheen.
function Patroon({ id, soort, kleur }: { id: string; soort: Papier; kleur: string }) {
  if (soort === 'geen') return null;
  const vorm = {
    stippen: <><circle cx="5" cy="5" r="2.4" /><circle cx="15" cy="15" r="2.4" /></>,
    strepen: <path d="M-2 22L22 -2M-2 12L12 -2M8 22L22 8" stroke="currentColor" strokeWidth="3" fill="none" />,
    sterren: <path d="M10 3l1.9 4 4.3.6-3.1 3 .8 4.300L10 12.800 6.100 14.900l.8-4.300-3.100-3 4.300-.6z" />,
    hartjes: <path d="M10 16s-6-3.600-6-7.700A3.300 3.300 0 0 1 10 6.500a3.300 3.300 0 0 1 6 1.800C16 12.400 10 16 10 16z" />,
    sneeuw: <path d="M10 3v14M3 10h14M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.500" strokeLinecap="round" fill="none" />,
    eitjes: <path d="M-1 14l5-5 5 5 5-5 5 5" stroke="currentColor" strokeWidth="2.200" strokeLinejoin="round" fill="none" />,
    golven: <path d="M-2 10q3-5 6 0t6 0 6 0 6 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />,
    blaadjes: <path d="M10 3c4 2 5 6 0 12-5-6-4-10 0-12z" />,
    ruit: <path d="M10 2.500L17.500 10 10 17.500 2.500 10z" stroke="currentColor" strokeWidth="1.600" fill="none" />,
  }[soort];
  return (
    <pattern id={id} width="20" height="20" patternUnits="userSpaceOnUse" patternTransform="scale(0.62)" style={{ color: kleur }}>
      <g fill="currentColor">{vorm}</g>
    </pattern>
  );
}

export default function Cadeaudoos({ papierKleur, detailKleur, lintKleur, papier, verpakking, vorm }: Props) {
  const uniek = useId().replace(/:/g, '');
  const pat = `p${uniek}`;
  const licht = `l${uniek}`;
  const donker = `d${uniek}`;
  const lintVerloop = `v${uniek}`;
  const klipBoven = `kb${uniek}`;
  const klipOnder = `ko${uniek}`;
  const eiKlip = `ek${uniek}`;
  const schoenKlip = `sk${uniek}`;
  const heeftLint = verpakking !== 'geen';
  const lintLicht = meng(lintKleur, '#ffffff', 0.35);
  const lintDonker = meng(lintKleur, '#000000', 0.28);
  const randLicht = meng(papierKleur, '#ffffff', 0.22);
  const randDonker = meng(papierKleur, '#000000', 0.3);

  const SCHOEN = 'M22 42H58V60C58 64 62 66 68 65C80 63 94 68 94 78C94 85 90 88 84 88H26C21 88 18 85 18 80V46Q18 42 22 42Z';
  const EI = 'M50 8C28 8 14 44 14 64c0 18 16 29 36 29s36-11 36-29C86 44 72 8 50 8z';
  const ZIGZAG = 'L88 56L76 46L64 56L52 46L40 56L28 46L16 56L4 46L0 50Z';
  const ei = (
    <>
      <path d={EI} fill={`url(#${licht})`} />
      <path d={EI} fill={`url(#${donker})`} opacity="0.55" />
      {papier !== 'geen' && <path d={EI} fill={`url(#${pat})`} opacity="0.32" />}
      {heeftLint && (
        <g clipPath={`url(#${eiKlip})`}>
          <rect x="0" y="22" width="100" height="8" fill={lintKleur} />
          <rect x="0" y="22" width="100" height="2" fill={lintLicht} opacity="0.55" />
          <rect x="0" y="72" width="100" height="8" fill={lintKleur} />
          <rect x="0" y="72" width="100" height="2" fill={lintLicht} opacity="0.55" />
        </g>
      )}
      <ellipse cx="37" cy="36" rx="6.500" ry="13" fill="#fff" opacity="0.25" transform="rotate(18 37 36)" />
      <path d={EI} fill="none" stroke={randDonker} strokeWidth="1" opacity="0.8" />
    </>
  );

  return (
    <svg viewBox="0 0 100 100" aria-hidden className="absolute inset-0 h-full w-full overflow-visible">
      <defs>
        <linearGradient id={licht} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={randLicht} />
          <stop offset="1" stopColor={papierKleur} />
        </linearGradient>
        <linearGradient id={donker} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={papierKleur} />
          <stop offset="0.7" stopColor={papierKleur} />
          <stop offset="1" stopColor={randDonker} />
        </linearGradient>
        <linearGradient id={lintVerloop} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={lintDonker} />
          <stop offset="0.35" stopColor={lintLicht} />
          <stop offset="1" stopColor={lintKleur} />
        </linearGradient>
        <Patroon id={pat} soort={papier} kleur={detailKleur} />
        <clipPath id={klipBoven}><path d={`M0 0H100V50${ZIGZAG}`} /></clipPath>
        <clipPath id={klipOnder}><path d={`M0 100H100V50${ZIGZAG}`} /></clipPath>
        <clipPath id={eiKlip}><path d={EI} /></clipPath>
        <clipPath id={schoenKlip}><path d={SCHOEN} /></clipPath>
      </defs>

      {/* Schaduw op de grond */}
      <ellipse className="cad-schaduw" cx="50" cy="93" rx="38" ry="4.500" fill="#000" opacity="0.25" />

      {vorm === 'doos' && (
        <>
      {/* De doos zelf */}
      <g className="cad-body">
        <rect x="15" y="44" width="70" height="48" rx="5" fill={`url(#${donker})`} />
        {papier !== 'geen' && <rect x="15" y="44" width="70" height="48" rx="5" fill={`url(#${pat})`} opacity="0.32" />}
        {/* Glans links */}
        <rect x="19" y="50" width="4" height="36" rx="2" fill="#fff" opacity="0.18" />
        {/* Schaduw onder het deksel */}
        <rect x="15" y="44" width="70" height="7" fill="#000" opacity="0.2" />
        {heeftLint && (
          <>
            <rect x="43" y="44" width="14" height="48" fill={`url(#${lintVerloop})`} />
            {verpakking === 'lint' && <rect x="15" y="64" width="70" height="11" fill={lintKleur} opacity="0.95" />}
            {verpakking === 'lint' && <rect x="15" y="64" width="70" height="2.500" fill={lintLicht} opacity="0.55" />}
          </>
        )}
        <rect x="15" y="44" width="70" height="48" rx="5" fill="none" stroke={randDonker} strokeWidth="1" opacity="0.7" />
      </g>

      {/* Deksel, met de strik of ster erbovenop */}
      <g className="cad-lid">
        <rect x="10" y="31" width="80" height="17" rx="4.500" fill={`url(#${licht})`} />
        {papier !== 'geen' && <rect x="10" y="31" width="80" height="17" rx="4.500" fill={`url(#${pat})`} opacity="0.32" />}
        <rect x="14" y="33.500" width="72" height="2.500" rx="1.200" fill="#fff" opacity="0.3" />
        <rect x="10" y="31" width="80" height="17" rx="4.500" fill="none" stroke={randDonker} strokeWidth="1" opacity="0.7" />
        {heeftLint && <rect x="43" y="31" width="14" height="17" fill={`url(#${lintVerloop})`} />}

        {verpakking === 'ster' && (
          <path
            d="M50 6l4.700 10.200 11.100 1.200-8.300 7.500 2.300 11-9.800-5.600-9.800 5.600 2.300-11-8.300-7.500 11.100-1.200z"
            fill={lintKleur}
            stroke={lintDonker}
            strokeWidth="1.200"
            strokeLinejoin="round"
          />
        )}

        {(verpakking === 'strik' || verpakking === 'lint') && (
          <g>
            {/* Staartjes */}
            <path d="M47 32L36 49l8-2.500 3.500-9z" fill={lintDonker} />
            <path d="M53 32l11 17-8-2.500-3.500-9z" fill={lintDonker} />
            {/* Twee lussen */}
            <path d="M50 31C40 12 15 13 22 27c3.500 7 20 7 28 4z" fill={lintKleur} stroke={lintDonker} strokeWidth="1.200" strokeLinejoin="round" />
            <path d="M50 31c10-19 35-18 28-4-3.500 7-20 7-28 4z" fill={lintKleur} stroke={lintDonker} strokeWidth="1.200" strokeLinejoin="round" />
            <path d="M46 28C40 19 29 18 27 24" fill="none" stroke={lintLicht} strokeWidth="2" strokeLinecap="round" opacity="0.8" />
            <path d="M54 28c6-9 17-10 19-4" fill="none" stroke={lintLicht} strokeWidth="2" strokeLinecap="round" opacity="0.8" />
            {/* Knoop */}
            <ellipse cx="50" cy="31" rx="5.500" ry="5" fill={lintKleur} stroke={lintDonker} strokeWidth="1.200" />
            <ellipse cx="48.500" cy="29.500" rx="2" ry="1.500" fill={lintLicht} opacity="0.85" />
          </g>
        )}
      </g>
        </>
      )}

      {/* Een paasei: bij openen springt de bovenkant eraf langs de zigzag */}
      {vorm === 'ei' && (
        <>
          <g className="cad-body">
            <g clipPath={`url(#${klipOnder})`}>{ei}</g>
          </g>
          <g className="cad-lid">
            <g clipPath={`url(#${klipBoven})`}>{ei}</g>
            <g clipPath={`url(#${eiKlip})`}><path d="M0 50L4 46L16 56L28 46L40 56L52 46L64 56L76 46L88 56L100 50" fill="none" stroke={randDonker} strokeWidth="0.9" opacity="0.7" strokeLinejoin="round" /></g>
            {verpakking === 'strik' && (
              <g transform="translate(50 14) scale(0.6) translate(-50 -31)">
                <path d="M47 32L36 49l8-2.500 3.500-9z" fill={lintDonker} />
                <path d="M53 32l11 17-8-2.500-3.500-9z" fill={lintDonker} />
                <path d="M50 31C40 12 15 13 22 27c3.500 7 20 7 28 4z" fill={lintKleur} stroke={lintDonker} strokeWidth="1.600" strokeLinejoin="round" />
                <path d="M50 31c10-19 35-18 28-4-3.500 7-20 7-28 4z" fill={lintKleur} stroke={lintDonker} strokeWidth="1.600" strokeLinejoin="round" />
                <ellipse cx="50" cy="31" rx="5.500" ry="5" fill={lintKleur} stroke={lintDonker} strokeWidth="1.600" />
              </g>
            )}
            {verpakking === 'ster' && (
              <path d="M50 -2l4.700 10.200 11.100 1.200-8.300 7.500 2.300 11-9.800-5.600-9.800 5.600 2.300-11-8.300-7.500 11.100-1.200z" fill={lintKleur} stroke={lintDonker} strokeWidth="1.200" strokeLinejoin="round" transform="translate(0 2) scale(1)" />
            )}
          </g>
        </>
      )}

      {/* Een koffer: de bovenkant met het handvat gaat open */}
      {vorm === 'koffer' && (
        <>
          <g className="cad-body">
            <rect x="12" y="46" width="76" height="44" rx="6" fill={`url(#${donker})`} />
            {papier !== 'geen' && <rect x="12" y="46" width="76" height="44" rx="6" fill={`url(#${pat})`} opacity="0.32" />}
            <rect x="12" y="46" width="76" height="9" fill="#000" opacity="0.18" />
            <rect x="16" y="56" width="4" height="28" rx="2" fill="#fff" opacity="0.18" />
            {heeftLint && (
              <>
                <rect x="24" y="46" width="9" height="44" fill={`url(#${lintVerloop})`} />
                <rect x="67" y="46" width="9" height="44" fill={`url(#${lintVerloop})`} />
              </>
            )}
            <rect x="12" y="46" width="76" height="44" rx="6" fill="none" stroke={randDonker} strokeWidth="1" opacity="0.8" />
            {/* Hoekjes en wieltjes */}
            <path d="M12 82v2a6 6 0 0 0 6 6h5v-8z" fill={lintDonker} />
            <path d="M88 82v2a6 6 0 0 1-6 6h-5v-8z" fill={lintDonker} />
            <circle cx="26" cy="93.500" r="3.500" fill="#2a2a2a" />
            <circle cx="74" cy="93.500" r="3.500" fill="#2a2a2a" />
          </g>
          <g className="cad-lid">
            {/* Handvat */}
            <path d="M38 27v-7a4 4 0 0 1 4-4h16a4 4 0 0 1 4 4v7" fill="none" stroke={lintDonker} strokeWidth="5" strokeLinecap="round" />
            <path d="M40 26v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5" fill="none" stroke={lintLicht} strokeWidth="1.400" strokeLinecap="round" opacity="0.9" />
            <rect x="12" y="26" width="76" height="22" rx="6" fill={`url(#${licht})`} />
            {papier !== 'geen' && <rect x="12" y="26" width="76" height="22" rx="6" fill={`url(#${pat})`} opacity="0.32" />}
            <rect x="16" y="29" width="68" height="2.500" rx="1.200" fill="#fff" opacity="0.3" />
            {heeftLint && (
              <>
                <rect x="24" y="26" width="9" height="22" fill={`url(#${lintVerloop})`} />
                <rect x="67" y="26" width="9" height="22" fill={`url(#${lintVerloop})`} />
              </>
            )}
            <rect x="12" y="26" width="76" height="22" rx="6" fill="none" stroke={randDonker} strokeWidth="1" opacity="0.8" />
            {/* Sluitingen */}
            <rect x="38" y="42" width="9" height="8" rx="1.800" fill={lintKleur} stroke={lintDonker} strokeWidth="1" />
            <rect x="53" y="42" width="9" height="8" rx="1.800" fill={lintKleur} stroke={lintDonker} strokeWidth="1" />
            <circle cx="42.500" cy="46" r="1.200" fill={lintDonker} />
            <circle cx="57.500" cy="46" r="1.200" fill={lintDonker} />
            {verpakking === 'ster' && (
              <path d="M50 29l2.200 4.700 5.100.6-3.800 3.500 1 5.100-4.500-2.600-4.500 2.600 1-5.100-3.800-3.500 5.100-.6z" fill={lintKleur} stroke={lintDonker} strokeWidth="0.8" strokeLinejoin="round" />
            )}
          </g>
        </>
      )}

      {/* Een schoentje met een cadeau erin: bij openen springt het cadeau eruit en verdwijnt de schoen */}
      {vorm === 'schoen' && (
        <g transform="translate(50 49) scale(1.08) translate(-56 -49)">
          <g className="cad-body">
            <path d={SCHOEN} fill={`url(#${licht})`} />
            <path d={SCHOEN} fill={`url(#${donker})`} opacity="0.55" />
            {papier !== 'geen' && <path d={SCHOEN} fill={`url(#${pat})`} opacity="0.32" />}
            <g clipPath={`url(#${schoenKlip})`}>
              {/* Zool, hak en de neus van de schoen */}
              <rect x="0" y="82" width="100" height="9" fill={meng(papierKleur, '#000000', 0.55)} />
              <rect x="0" y="82" width="100" height="1.600" fill="#fff" opacity="0.18" />
              <rect x="18" y="73" width="23" height="10" fill={meng(papierKleur, '#000000', 0.3)} opacity="0.55" />
              <path d="M80 64C89 65 94 70 94 78V82H84C84 74 82 68 80 64Z" fill={meng(papierKleur, '#000000', 0.18)} opacity="0.6" />
              <rect x="22" y="52" width="4" height="20" rx="2" fill="#fff" opacity="0.2" />
            </g>
            {/* Veters */}
            {heeftLint && (
              <>
                <path d="M59 61.500l4.500 2.500M64.500 64l4.500 1M70 65l4.500-1.800" stroke={lintKleur} strokeWidth="1.500" strokeLinecap="round" fill="none" />
                {[[60.500, 62], [66, 64.500], [71.500, 65.200]].map(([x, y]) => <circle key={x} cx={x} cy={y} r="1.600" fill={lintLicht} stroke={lintDonker} strokeWidth="0.5" />)}
              </>
            )}
            <path d={SCHOEN} fill="none" stroke={randDonker} strokeWidth="1" opacity="0.8" />
            {/* De donkere binnenkant van de opening */}
            <ellipse cx="38" cy="42.500" rx="18" ry="3.500" fill={meng(papierKleur, '#000000', 0.65)} />
          </g>

          {/* Het cadeau zit een beetje scheef in de schoen en steekt er voor twee derde uit */}
          <g className="cad-lid">
            <g transform="rotate(-9 38 44)">
              <rect x="23" y="22" width="30" height="26" rx="3" fill={lintKleur} stroke={lintDonker} strokeWidth="1" />
              <rect x="23" y="22" width="30" height="7" rx="3" fill={lintLicht} opacity="0.5" />
              <rect x="35" y="22" width="6" height="26" fill="#fff" opacity="0.9" />
              <rect x="23" y="32" width="30" height="5.500" fill="#fff" opacity="0.9" />
              {verpakking === 'strik' && (
                <g>
                  <path d="M38 22C30 7 14 8 19 17c3 4 13 3 19 5z" fill="#fff" stroke={lintDonker} strokeWidth="1" strokeLinejoin="round" />
                  <path d="M38 22c8-15 24-14 19-5-3 4-13 3-19 5z" fill="#fff" stroke={lintDonker} strokeWidth="1" strokeLinejoin="round" />
                  <circle cx="38" cy="22" r="3.200" fill="#fff" stroke={lintDonker} strokeWidth="1" />
                </g>
              )}
              {verpakking === 'ster' && (
                <path d="M38 6l3.200 6.700 7.300.9-5.400 5 1.400 7.200-6.500-3.600-6.500 3.600 1.400-7.200-5.400-5 7.300-.9z" fill="#fff" stroke={lintDonker} strokeWidth="1" strokeLinejoin="round" />
              )}
            </g>
          </g>

          {/* De rand van de schoen, vóór het cadeau */}
          <g className="cad-body">
            <rect x="17" y="42" width="42" height="9" rx="3.500" fill={meng(papierKleur, '#ffffff', 0.5)} stroke={randDonker} strokeWidth="1" />
            <rect x="20" y="44" width="36" height="1.800" rx="0.900" fill="#fff" opacity="0.5" />
          </g>
        </g>
      )}
    </svg>
  );
}
