'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import CadeauIcoon from '@/components/CadeauIcoon';
import Confetti from '@/components/Confetti';
import DeelKnop from '@/components/DeelKnop';
import Decor from '@/components/Decor';
import EigenLettertypeStijl from '@/components/EigenLettertypeStijl';
import { cadeautjesVoor, icoonVoor, type CadeautjeConfig } from '@/lib/config';
import { kopieerNaarKlembord } from '@/lib/delen';
import { confettiKleuren, cssVariabelen, heeftAchtergrondAfbeelding, heeftPopupAchtergrond, tegelKleuren } from '@/lib/kleur';
import { kiesTekst, knopTeksten } from '@/lib/teksten';

const SPATTERS = [
  { x: 22, y: 30, s: 14, d: 0 }, { x: 74, y: 22, s: 18, d: 0.15 }, { x: 14, y: 62, s: 10, d: 0.3 },
  { x: 84, y: 58, s: 12, d: 0.1 }, { x: 40, y: 8, s: 12, d: 0.4 }, { x: 62, y: 70, s: 10, d: 0.25 },
];

const KNOP_PILL = 'cad-deel rounded-full border border-goud/70 text-opach text-xs sm:text-sm px-4 py-2 hover:bg-goud/20 transition-colors focus-visible:outline-goud';

// Breedte van een cadeautje per aantal cadeautjes: op de telefoon (mob) en vanaf 640 px (sm). Er staat een vaste tussenruimte van 0.75rem tussen,
// de laatste rij staat in het midden. Volledige klassenamen, anders ziet Tailwind ze niet.
const B2 = 'w-[calc((100%-0.75rem)/2)]';
const B3 = 'w-[calc((100%-1.5rem)/3)]';
const SM3 = 'sm:w-[calc((100%-1.5rem)/3)]';
const SM4 = 'sm:w-[calc((100%-2.25rem)/4)]';
const SM5 = 'sm:w-[calc((100%-3rem)/5)]';
const BREEDTE: Record<number, string> = {
  1: `${B2} ${SM3}`, 2: `${B2} ${SM3}`, 3: `${B3} ${SM3}`, 4: `${B2} ${SM4}`, 5: `${B3} ${SM5}`,
  6: `${B3} ${SM3}`, 7: `${B3} ${SM4}`, 8: `${B3} ${SM4}`, 9: `${B3} ${SM3}`, 10: `${B3} ${SM5}`,
};

// Een korte vingerafdruk van de inhoud. Verandert de beheerder de cadeautjes, dan begint de bezoeker weer met een schone lei.
function vingerafdruk(config: CadeautjeConfig): string {
  const tekst = JSON.stringify([config.titel, config.aantalCadeautjes, config.aantalKiezen, config.cadeautjes]);
  let h = 5381;
  for (let i = 0; i < tekst.length; i++) h = ((h << 5) + h + tekst.charCodeAt(i)) | 0;
  return `cadeautje:${(h >>> 0).toString(36)}`;
}

// De browser mag opslag weigeren (privévenster, geblokkeerde cookies): dan werkt de pagina gewoon, alleen zonder geheugen
function leesOpslag(sleutel: string): number[] {
  try {
    const ruw = window.localStorage.getItem(sleutel);
    const lijst: unknown = ruw ? JSON.parse(ruw) : [];
    return Array.isArray(lijst) ? lijst.filter((n): n is number => Number.isInteger(n)) : [];
  } catch {
    return [];
  }
}

function schrijfOpslag(sleutel: string, lijst: number[]) {
  try {
    if (lijst.length === 0) window.localStorage.removeItem(sleutel);
    else window.localStorage.setItem(sleutel, JSON.stringify(lijst));
  } catch {
    // Zonder opslag onthoudt de pagina niets, dat is prima
  }
}

// De versiering bovenop (strik, ster) heet "deksel": die vliegt eraf als het cadeautje opengaat
function Strik() {
  return (
    <svg viewBox="0 0 40 24" aria-hidden className="cad-deksel pointer-events-none absolute left-1/2 top-0 w-[46%] -translate-x-1/2 -translate-y-[45%] text-goud drop-shadow">
      <path d="M20 14C14 2 3 4 6 11c2 4 9 3 14 3zM20 14c6-12 17-10 14-3-2 4-9 3-14 3z" fill="currentColor" stroke="rgba(0,0,0,0.35)" strokeWidth="0.8" />
      <circle cx="20" cy="14" r="3.2" fill="currentColor" stroke="rgba(0,0,0,0.35)" strokeWidth="0.8" />
    </svg>
  );
}

function Sterretje() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="cad-deksel pointer-events-none absolute left-1/2 top-0 w-[30%] -translate-x-1/2 -translate-y-[40%] text-goud drop-shadow">
      <path d="M12 2.8l2.8 5.9 6.4.9-4.7 4.5 1.2 6.4L12 17.3l-5.7 3.2 1.2-6.4-4.7-4.5 6.4-.9z" fill="currentColor" stroke="rgba(0,0,0,0.35)" strokeWidth="0.7" />
    </svg>
  );
}

const GOUD = 'rgb(var(--cad-goud))';

// Het hele lint: over de volle hoogte en breedte van het cadeautje
function Lint() {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-0 rounded-[inherit]"
      style={{
        background: `linear-gradient(${GOUD}, ${GOUD}) center / 14% 100% no-repeat, linear-gradient(${GOUD}, ${GOUD}) center / 100% 14% no-repeat`,
        filter: 'drop-shadow(0 0 1px rgba(0,0,0,0.45))',
      }}
    />
  );
}

// Het hangslotje voor cadeautjes die niet meer open mogen
function Slot() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden>
      <path d="M12 2a5 5 0 0 0-5 5v3H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1V7a5 5 0 0 0-5-5Zm-3 8V7a3 3 0 1 1 6 0v3H9Z" />
    </svg>
  );
}

// Het deel van de pagina dat de bezoeker op dit moment ziet, in pixels vanaf de bovenkant van de pagina
interface Zicht { top: number; hoogte: number }

interface Props {
  config: CadeautjeConfig;
  /** Ingebed in een iframe (bijvoorbeeld in Kennis Shop): dezelfde pagina, maar met een doorzichtige achtergrond en weinig marge eromheen */
  embed?: boolean;
  /** Voorbeeld in de editor: er wordt niets onthouden in de browser */
  preview?: boolean;
  /** Voorbeeld in de editor: de kleur (bijvoorbeeld 'primair' of 'tegel2') waarvan we de onderdelen laten oplichten */
  markeer?: string | null;
}

export default function Cadeautjes({ config, embed = false, preview = false, markeer = null }: Props) {
  const [beweging, setBeweging] = useState(true);
  const [geopend, setGeopend] = useState<number[]>([]);
  const [actief, setActief] = useState<number | null>(null);
  const [confettiKeys, setConfettiKeys] = useState<number[]>([]);
  const [melding, setMelding] = useState('');
  const [gekopieerd, setGekopieerd] = useState(false);
  const [zicht, setZicht] = useState<Zicht | null>(null);
  const zichtRef = useRef<HTMLDivElement>(null);
  const sluitRef = useRef<HTMLButtonElement>(null);
  const dialoogRef = useRef<HTMLDivElement>(null);
  const vorigeActief = useRef<number | null>(null);
  const meldingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const kopieerTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const gepusht = useRef(false);
  const confettiTeller = useRef(0);

  const { opties } = config;
  const aantal = config.aantalCadeautjes;
  const lijst = useMemo(() => cadeautjesVoor(config), [config]);
  const tegels = useMemo(() => tegelKleuren(config.kleuren), [config.kleuren]);
  const confettiSet = useMemo(() => confettiKleuren(config.kleuren), [config.kleuren]);
  const variabelen = useMemo(() => cssVariabelen(config) as React.CSSProperties, [config]);
  const sleutel = useMemo(() => vingerafdruk(config), [config]);
  const teksten = knopTeksten(config);
  const achtergrondAfbeelding = heeftAchtergrondAfbeelding(opties);

  // Alleen cadeautjes die er nog zijn tellen mee (de beheerder kan er in het voorbeeld een weghalen)
  const gekozen = useMemo(() => geopend.filter((nr) => nr <= aantal), [geopend, aantal]);
  const klaar = gekozen.length >= config.aantalKiezen;
  // Na de laatste keuze kunnen de overige cadeautjes ook open, zodra de popup dicht is
  const onthul = klaar && opties.restOnthullen && actief === null;
  const isOpen = useCallback((nr: number) => gekozen.includes(nr) || onthul, [gekozen, onthul]);

  // Het geheugen van de browser lezen. Dit gebeurt pas na het laden van de pagina, zodat server en browser hetzelfde tekenen.
  useEffect(() => {
    setGeopend(preview ? [] : leesOpslag(sleutel));
  }, [sleutel, preview]);

  useEffect(() => {
    setBeweging(!window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    return () => {
      for (const t of [meldingTimer, openTimer, kopieerTimer]) if (t.current) clearTimeout(t.current);
    };
  }, []);

  // In een iframe moet de pagina doorzichtig zijn, zodat de kaart op elke achtergrond past
  useEffect(() => {
    if (!embed) return;
    const delen = [document.documentElement, document.body];
    const vorige = delen.map((el) => el.style.background);
    delen.forEach((el) => { el.style.background = 'transparent'; });
    return () => delen.forEach((el, i) => { el.style.background = vorige[i]; });
  }, [embed]);

  const confetti = useCallback(() => {
    if (!opties.confetti) return;
    confettiTeller.current += 1;
    setConfettiKeys((k) => [...k, confettiTeller.current]);
  }, [opties.confetti]);

  // Ingebed in een hoog iframe: welk stuk van het iframe ziet de bezoeker nu? De browser vertelt dat via een
  // IntersectionObserver, ook als de pagina op een ander domein staat dan de pagina eromheen. Dan zetten we de popup
  // in dat zichtbare stuk, in plaats van in het midden van het hele (hoge) iframe waar hij buiten beeld kan vallen.
  const meetZichtbaar = useCallback(
    () => new Promise<Zicht | null>((klaarMeten) => {
      const doel = zichtRef.current;
      if (!doel || typeof IntersectionObserver === 'undefined') return klaarMeten(null);
      const timer = setTimeout(() => { waarnemer.disconnect(); klaarMeten(null); }, 400);
      const waarnemer = new IntersectionObserver((metingen) => {
        clearTimeout(timer);
        waarnemer.disconnect();
        const r = metingen[0]?.intersectionRect;
        klaarMeten(r && r.height > 120 ? { top: r.top + window.scrollY, hoogte: r.height } : null);
      });
      waarnemer.observe(doel);
    }),
    [],
  );

  // Popup openen en sluiten via de terugknop van de telefoon
  const openPopup = useCallback(async (nr: number) => {
    if (embed) setZicht(await meetZichtbaar());
    if (!gepusht.current) {
      window.history.pushState({ cad: true }, '');
      gepusht.current = true;
    }
    setActief(nr);
  }, [embed, meetZichtbaar]);

  const sluit = useCallback(() => {
    if (gepusht.current) {
      gepusht.current = false;
      window.history.back();
    } else {
      setActief(null);
    }
  }, []);

  useEffect(() => {
    const opTerug = () => { gepusht.current = false; setActief(null); };
    window.addEventListener('popstate', opTerug);
    return () => window.removeEventListener('popstate', opTerug);
  }, []);

  // Na het sluiten van de popup keert de focus terug naar het cadeautje dat je het laatst bekeek
  useEffect(() => {
    if (actief === null && vorigeActief.current !== null) {
      document.querySelector<HTMLButtonElement>(`#cad-${vorigeActief.current} button`)?.focus({ preventScroll: true });
    }
    vorigeActief.current = actief;
  }, [actief]);

  // Popup: scrollen vergrendelen en toetsen
  useEffect(() => {
    if (actief === null) return;
    sluitRef.current?.focus();
    const vorige = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const opToets = (e: KeyboardEvent) => {
      if (e.key === 'Escape') sluit();
      // Tab blijft binnen de popup, zodat je niet per ongeluk achter de popup terechtkomt
      if (e.key === 'Tab') {
        const knoppen = dialoogRef.current?.querySelectorAll<HTMLElement>('button:not([disabled]), a[href]');
        if (!knoppen || knoppen.length === 0) return;
        const eerste = knoppen[0];
        const laatste = knoppen[knoppen.length - 1];
        const binnen = dialoogRef.current?.contains(document.activeElement);
        if (!binnen || (e.shiftKey && document.activeElement === eerste)) {
          e.preventDefault();
          (binnen ? laatste : eerste).focus();
        } else if (!e.shiftKey && document.activeElement === laatste) {
          e.preventDefault();
          eerste.focus();
        }
      }
    };
    window.addEventListener('keydown', opToets);
    return () => {
      document.body.style.overflow = vorige;
      window.removeEventListener('keydown', opToets);
    };
  }, [actief, sluit]);

  function toonMelding(tekst: string) {
    setMelding(tekst);
    if (meldingTimer.current) clearTimeout(meldingTimer.current);
    meldingTimer.current = setTimeout(() => setMelding(''), 3000);
  }

  function klik(nr: number) {
    // Een cadeautje dat al open is (of onthuld), bekijk je gewoon nog een keer
    if (isOpen(nr)) {
      openPopup(nr);
      return;
    }
    if (klaar) {
      toonMelding(config.aantalKiezen === 1 ? 'Je hebt al een cadeautje gekozen.' : `Je hebt al ${config.aantalKiezen} cadeautjes gekozen.`);
      return;
    }
    const nieuw = [...gekozen, nr];
    setGeopend(nieuw);
    if (!preview) schrijfOpslag(sleutel, nieuw);
    if (beweging) confetti();
    // Heel even wachten, zodat je het deksel eraf ziet gaan voordat de popup komt
    if (openTimer.current) clearTimeout(openTimer.current);
    openTimer.current = setTimeout(() => openPopup(nr), beweging ? 500 : 0);
  }

  function opnieuw() {
    setGeopend([]);
    setActief(null);
    setMelding('');
    if (!preview) schrijfOpslag(sleutel, []);
  }

  async function kopieerCode(waarde: string) {
    if (await kopieerNaarKlembord(waarde, dialoogRef.current ?? document.body)) {
      setGekopieerd(true);
      if (kopieerTimer.current) clearTimeout(kopieerTimer.current);
      kopieerTimer.current = setTimeout(() => setGekopieerd(false), 2000);
    }
  }

  const inhoud = actief !== null ? lijst[actief - 1] : null;
  const inhoudIcoon = inhoud ? icoonVoor(config, inhoud, inhoud.nr - 1) : null;
  const heeftKnop = Boolean(inhoud?.knop.aan && inhoud.knop.url);
  const heeftCode = Boolean(inhoud?.code.aan && inhoud.code.waarde);
  // Zelfde venster: in een iframe (Kennis Shop) navigeert dan de hele pagina naar de link
  const knopDoel = config.knoppen.openen === 'zelfde' ? '_top' : '_blank';
  const kiezen = kiesTekst(config, gekozen.length);

  return (
    // Ingebed krijgt de pagina geen paginakleur en geen vaste minimale hoogte, zodat alleen de kaart zichtbaar is
    <div style={variabelen} data-markeer={preview && markeer ? markeer : undefined} data-kleur="licht" className={`${embed ? 'relative p-2' : 'min-h-screen bg-licht px-3 sm:px-4 py-6'} cad-vlak`}>
      <EigenLettertypeStijl eigen={config.eigenLettertype} eigen2={config.eigenLettertype2} />
      {embed && <div ref={zichtRef} aria-hidden className="pointer-events-none absolute inset-0" />}
      {confettiKeys.map((k) => <Confetti key={k} kleuren={confettiSet} />)}

      <div className="max-w-3xl mx-auto">
        <div
          data-kleur="achtergrond"
          className={`cad-vlak ${achtergrondAfbeelding ? 'cad-achtergrond' : ''} relative overflow-hidden bg-nacht border-2 border-goud/60 shadow-xl rounded-3xl px-3 sm:px-10 pt-8 pb-8`}
        >
          <Decor decor={opties.decor} />

          <header className="relative text-center mb-6">
            {config.logoUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={config.logoUrl} alt="" className="mx-auto mb-3 w-auto max-w-full object-contain max-h-16 sm:max-h-20" />
            )}
            <h1 data-kleur="accent" className="cad-deel cad-goudtekst cad-titel font-titel font-bold leading-tight">
              {config.titel}
            </h1>
            {config.ondertitel && (
              <p className="mt-2 font-onder text-xs sm:text-sm tracking-[0.25em] uppercase text-opach/80">
                {config.ondertitel}
              </p>
            )}
            <p className="mt-4 text-opach text-sm sm:text-base font-onder" aria-live="polite">{melding || kiezen}</p>
            {opties.delen && (
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                <DeelKnop titel={config.titel} sjabloon={opties.delenTekst} eigenLink={opties.delenUrl} className={KNOP_PILL} />
              </div>
            )}
          </header>

          <ol className="relative flex flex-wrap justify-center gap-3 list-none p-0 m-0">
            {lijst.map(({ nr, ...c }, index) => {
              // Kleurpatroon: elk cadeautje een andere tegelkleur, in volgorde
              const tegelNr = index % tegels.length;
              const t = tegels[tegelNr];
              const open = isOpen(nr);
              const gedimd = !open && klaar;
              const icoon = icoonVoor(config, c, index);
              return (
                <li key={nr} id={`cad-${nr}`} className={BREEDTE[Math.min(aantal, 10)] ?? B3}>
                  <div
                    className={`relative aspect-square ${opties.schudden && !open && !gedimd ? 'cad-schud' : ''} ${gedimd ? 'cad-gedimd' : ''}`}
                    style={{ ['--cad-vertraging' as string]: `${(index * 0.9) % 3.6}s` }}
                  >
                    <button
                      type="button"
                      onClick={() => klik(nr)}
                      aria-label={open ? `Cadeautje ${nr}: ${c.titel}` : gedimd ? `Cadeautje ${nr}, niet meer te openen` : `Cadeautje ${nr}, nog dicht. Klik om te openen`}
                      aria-disabled={gedimd}
                      className={`absolute inset-0 block w-full rounded-2xl focus-visible:outline-goud ${open ? 'cad-open' : ''} ${gedimd ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      {/* Binnenkant: glanzend met het icoon en de titel, zodat open nooit op een dicht cadeautje lijkt */}
                      <span data-kleur="accent primair" className="cad-deel cad-binnen cad-doos flex flex-col items-center justify-center border-2 border-goud px-1 text-primair">
                        <CadeauIcoon naam={icoon} className={`${open ? '' : 'invisible '}h-8 w-8 sm:h-12 sm:w-12`} />
                        <span className={`${open ? '' : 'invisible '}mt-1 line-clamp-2 break-words text-center font-cadeau text-[10px] font-bold leading-tight sm:text-sm`}>
                          {c.titel}
                        </span>
                      </span>

                      {/* Dichte doos in de kleur van de tegel */}
                      <span
                        data-kleur={`tegel${tegelNr + 1} accent`}
                        className="cad-deel cad-doos cad-doos-dicht border border-goud/80 shadow-md"
                        style={{ backgroundColor: t.bg, color: t.tekst, transitionDelay: beweging && open ? `${index * 60}ms` : '0ms' }}
                      >
                        <span className="pointer-events-none absolute inset-1 rounded-xl border border-goud/40 sm:inset-1.5" />
                        {opties.verpakking === 'lint' && <Lint />}
                        <span className="absolute inset-0 flex items-center justify-center">
                          <span
                            className={opties.verpakking === 'lint' ? 'flex items-center justify-center rounded-lg p-1.5 sm:p-2' : 'contents'}
                            style={opties.verpakking === 'lint' ? { backgroundColor: t.bg } : undefined}
                          >
                            <CadeauIcoon naam={icoon} className="relative h-9 w-9 sm:h-14 sm:w-14" />
                          </span>
                        </span>
                        {opties.verpakking === 'strik' && <Strik />}
                        {opties.verpakking === 'ster' && <Sterretje />}
                        {gedimd && <span className="absolute bottom-1 right-1.5 opacity-70"><Slot /></span>}
                      </span>
                    </button>
                  </div>
                </li>
              );
            })}
          </ol>

          <div className="relative mt-6 min-h-[3rem] text-center">
            {klaar && opties.opnieuwSpelen && (
              <button type="button" onClick={opnieuw} data-kleur="accent" className={KNOP_PILL}>{teksten.opnieuw}</button>
            )}
            {config.footer && (
              <p className="mt-4 text-opach/80 text-sm sm:text-base font-titel italic">
                {config.footer}
                <span className="block text-goud text-lg mt-1" aria-hidden>♥</span>
              </p>
            )}
          </div>
        </div>
      </div>

      {inhoud && inhoudIcoon && (
        <div
          className={embed && zicht ? 'absolute inset-0 z-40 bg-black/60' : 'fixed inset-0 z-40 flex items-center justify-center bg-black/60 p-4'}
          onClick={sluit}
        >
          {/* Ingebed staat de popup in het stuk van het iframe dat de bezoeker ziet */}
          <div
            className={embed && zicht ? 'absolute inset-x-0 flex items-center justify-center p-4' : 'contents'}
            style={embed && zicht ? { top: zicht.top, height: zicht.hoogte } : undefined}
          >
            <div
              ref={dialoogRef}
              role="dialog"
              aria-modal="true"
              aria-label={`Cadeautje ${inhoud.nr}: ${inhoud.titel}`}
              onClick={(e) => e.stopPropagation()}
              style={embed && zicht ? { maxHeight: Math.max(240, zicht.hoogte - 32) } : undefined}
              data-kleur="licht"
              className={`cad-vlak cad-popup ${heeftPopupAchtergrond(opties) ? `cad-popup-achtergrond${opties.popupAchtergrondTekst === 'licht' ? ' cad-popup-licht' : ''}` : ''} font-poptekst relative w-full max-w-md ${embed && zicht ? '' : 'max-h-[85vh]'} overflow-y-auto rounded-3xl border-4 border-goud bg-licht text-center shadow-2xl`}
            >
              <div data-kleur="secundair" className="cad-deel border-b-2 border-goud bg-secundair py-2 text-xs uppercase tracking-[0.25em] text-opsec">
                ✦ Cadeautje {inhoud.nr} van {aantal} ✦
              </div>
              <button
                ref={sluitRef}
                type="button"
                onClick={sluit}
                aria-label={teksten.sluit}
                className="absolute right-0 top-0 flex h-11 w-11 items-start justify-center pt-1 text-2xl leading-none text-opsec opacity-90 hover:text-goud"
              >
                ×
              </button>

              <div key={inhoud.nr} className="relative px-6 pb-4 pt-6 sm:px-8">
                {SPATTERS.map((s, i) => (
                  <span
                    key={i}
                    aria-hidden
                    className="cad-spat pointer-events-none absolute text-goud"
                    style={{ left: `${s.x}%`, top: `${s.y}%`, fontSize: s.s, animationDelay: `${s.d}s` }}
                  >
                    ✦
                  </span>
                ))}
                <div className="cad-tekst">
                  <div className="cad-medaillon mx-auto flex h-20 w-20 items-center justify-center rounded-full border-2 border-goud text-secundair">
                    <CadeauIcoon naam={inhoudIcoon} className="h-11 w-11" />
                  </div>
                  <h2 data-kleur="primair" className="cad-deel cad-ptekst mt-4 font-popkop text-2xl font-bold text-primair">{inhoud.titel}</h2>
                  {inhoud.tekst && <p data-kleur="tekst" className="cad-deel cad-ptekst mt-3 whitespace-pre-line leading-relaxed text-inkt">{inhoud.tekst}</p>}
                  {inhoud.afbeelding && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={inhoud.afbeelding} alt="" className="mx-auto mt-4 max-h-56 w-auto max-w-full rounded-xl object-cover" />
                  )}
                  {heeftCode && (
                    <div className="mt-5">
                      <p className="cad-ptekst text-xs uppercase tracking-[0.2em] text-inkt/70">{inhoud.code.label || teksten.codeLabel}</p>
                      <div className="mt-2 inline-flex max-w-full items-center gap-2 rounded-xl border-2 border-dashed border-goud bg-white/60 py-1.5 pl-4 pr-1.5">
                        <code className="cad-ptekst break-all font-mono text-base font-bold text-primair">{inhoud.code.waarde}</code>
                        <button
                          type="button"
                          onClick={() => kopieerCode(inhoud.code.waarde)}
                          className="shrink-0 rounded-lg bg-primair px-3 py-1.5 text-xs font-semibold text-oppri hover:bg-secundair hover:text-opsec"
                        >
                          {gekopieerd ? teksten.gekopieerd : teksten.kopieer}
                        </button>
                      </div>
                    </div>
                  )}
                  {heeftKnop && (
                    <a
                      href={inhoud.knop.url}
                      target={knopDoel}
                      rel={knopDoel === '_blank' ? 'noopener noreferrer' : 'noopener'}
                      data-kleur="secundair"
                      className="cad-deel mt-5 inline-block rounded-full bg-secundair px-6 py-2.5 text-sm font-semibold text-opsec transition-opacity hover:opacity-90"
                    >
                      {inhoud.knop.label || config.knoppen.standaardLabel}
                    </a>
                  )}
                </div>
              </div>

              <div className="flex justify-center px-4 pb-5">
                <button
                  type="button"
                  onClick={sluit}
                  className="rounded-full bg-primair px-6 py-2 text-sm font-semibold text-oppri transition-colors hover:bg-secundair hover:text-opsec"
                >
                  {teksten.sluit}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
