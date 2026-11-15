'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import DelenTab from '@/components/beheer/DelenTab';
import UpdatesTab from '@/components/beheer/UpdatesTab';
import { INPUT, KNOP, KNOP_PRIMAIR, Veld, type Bericht } from '@/components/beheer/velden';
import CadeauIcoon from '@/components/CadeauIcoon';
import EigenLettertypeStijl from '@/components/EigenLettertypeStijl';
import { BERICHT_CONFIG, BERICHT_KLAAR, BERICHT_MARKEER } from '@/components/CadeautjesPagina';
import standaardConfig from '@/config/cadeautje.json';
import {
  cadeautjesVoor, DECOR_NAMEN, DECORS, ICONEN, ICOON_NAMEN, kleurenGelijkAanThema, LETTERTYPE_PLEKKEN, LETTERTYPES, lettertypeVoor, leesConfig,
  MAX_CADEAUTJES, THEMAS, THEMA_SLEUTELS, VERPAKKING_NAMEN, VERPAKKINGEN,
  type Cadeautje, type CadeautjeConfig, type Decor, type Lettertype, type LettertypePlek, type ThemaNaam, type Verpakking,
} from '@/lib/config';
import { deelBericht, deelTekst, STANDAARD_DEELTEKST } from '@/lib/delen';
import { achtergrondMaten, POPUP_ACHTERGROND_MAAT } from '@/lib/embed';
import { contrast, heeftAchtergrondAfbeelding, heeftPopupAchtergrond } from '@/lib/kleur';
import type { OpslagModus } from '@/lib/opslag';
import { PROMPT_TEKSTEN } from '@/lib/promptTeksten';
import type { VersieInfo } from '@/lib/versie';

const TABS = ['Algemeen', 'Kleuren en logo', 'Cadeautjes', 'Opties en teksten', 'Delen', 'Updates', 'Importeren en exporteren'] as const;
type Tab = (typeof TABS)[number];

// Bij aanwijzen of selecteren van een kleurveld lichten in het voorbeeld de onderdelen met die kleur op (zie `markeer` in de pagina)
function KleurVeld({ label, waarde, onChange, sleutel, gebruikt, opMarkeer }: { label: string; waarde: string; onChange: (hex: string) => void; sleutel: string; gebruikt: string; opMarkeer: (sleutel: string | null) => void }) {
  const [tekst, setTekst] = useState(waarde);
  useEffect(() => setTekst(waarde), [waarde]);
  return (
    <div
      onMouseEnter={() => opMarkeer(sleutel)}
      onMouseLeave={() => opMarkeer(null)}
      onFocus={() => opMarkeer(sleutel)}
      onBlur={() => opMarkeer(null)}
    >
      <span className="mb-1 block text-sm font-medium">{label}</span>
      <span className="mb-1.5 block text-xs text-slate-500">{gebruikt}</span>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={waarde}
          onChange={(e) => onChange(e.target.value)}
          aria-label={label}
          className="h-9 w-12 cursor-pointer rounded border border-slate-300 bg-white p-0.5"
        />
        <input
          type="text"
          value={tekst}
          onChange={(e) => {
            setTekst(e.target.value);
            if (/^#[0-9a-fA-F]{6}$/.test(e.target.value)) onChange(e.target.value.toLowerCase());
          }}
          maxLength={7}
          spellCheck={false}
          aria-label={`${label} als kleurcode`}
          className={`${INPUT} font-mono`}
        />
      </div>
    </div>
  );
}

function UploadKnop({ onUrl, label = 'Afbeelding uploaden' }: { onUrl: (url: string) => void; label?: string }) {
  const invoer = useRef<HTMLInputElement>(null);
  const [bezig, setBezig] = useState(false);
  const [fout, setFout] = useState('');

  async function kies(e: React.ChangeEvent<HTMLInputElement>) {
    const bestand = e.target.files?.[0];
    e.target.value = '';
    if (!bestand) return;
    setBezig(true);
    setFout('');
    const form = new FormData();
    form.append('bestand', bestand);
    const res = await fetch('/api/beheer/upload', { method: 'POST', body: form });
    const data = await res.json().catch(() => ({}));
    if (res.ok && data.url) onUrl(data.url);
    else setFout(data.fout ?? 'Uploaden is niet gelukt.');
    setBezig(false);
  }

  return (
    <div>
      <input ref={invoer} type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={kies} className="hidden" />
      <button type="button" onClick={() => invoer.current?.click()} disabled={bezig} className={KNOP}>
        {bezig ? 'Uploaden...' : label}
      </button>
      {fout && <p className="mt-1 text-xs text-red-700" role="alert">{fout}</p>}
    </div>
  );
}

// De twee plekken voor een eigen lettertype: elk met een gewoon en een vet bestand
const EIGEN_LETTERTYPES = [
  { sleutel: 'eigenLettertype', keuze: 'eigen', kop: 'Eigen lettertype 1' },
  { sleutel: 'eigenLettertype2', keuze: 'eigen2', kop: 'Eigen lettertype 2' },
] as const;
type EigenSleutel = (typeof EIGEN_LETTERTYPES)[number]['sleutel'];

// Eén lettertypebestand uploaden (otf, ttf, woff of woff2). We bewaren alleen de naam in de opslag, het bestand zelf blijft daar.
function LettertypeUpload({ label, id, onId, onWis }: { label: string; id: string; onId: (id: string) => void; onWis: () => void }) {
  const invoer = useRef<HTMLInputElement>(null);
  const [bezig, setBezig] = useState(false);
  const [fout, setFout] = useState('');

  async function kies(e: React.ChangeEvent<HTMLInputElement>) {
    const bestand = e.target.files?.[0];
    e.target.value = '';
    if (!bestand) return;
    setBezig(true);
    setFout('');
    const form = new FormData();
    form.append('bestand', bestand);
    const res = await fetch('/api/beheer/lettertype', { method: 'POST', body: form });
    const data = await res.json().catch(() => ({}));
    if (res.ok && data.id) onId(data.id);
    else setFout(data.fout ?? 'Uploaden is niet gelukt.');
    setBezig(false);
  }

  return (
    <div className="rounded-lg border border-slate-200 p-2">
      <p className="text-sm font-medium">{label}</p>
      <input ref={invoer} type="file" accept=".otf,.ttf,.woff,.woff2" onChange={kies} className="hidden" />
      <div className="mt-1 flex flex-wrap items-center gap-2">
        <button type="button" onClick={() => invoer.current?.click()} disabled={bezig} className={KNOP}>
          {bezig ? 'Uploaden...' : id ? 'Vervang bestand' : 'Kies bestand'}
        </button>
        {id && <button type="button" onClick={onWis} className={KNOP}>Verwijder</button>}
        <span className={`text-xs ${id ? 'text-emerald-800' : 'text-slate-500'}`}>{id ? 'Geüpload' : 'Nog geen bestand'}</span>
      </div>
      {fout && <p className="mt-1 text-xs text-red-700" role="alert">{fout}</p>}
    </div>
  );
}

// Waar elke kleur op de pagina te zien is, voor de regel onder het kleurveld
const KLEUR_GEBRUIK = {
  achtergrond: 'De kaart zelf waar de cadeautjes op staan.',
  accent: 'De titel, de randjes, het lint en de binnenkant van een geopend cadeautje.',
  licht: 'De pagina rondom de kaart en de popup.',
  primair: 'Knoppen en titels in de popup en de icoontjes in een geopend cadeautje.',
  secundair: 'De balk bovenin en de knop in de popup.',
  tekst: 'Alleen de lopende tekst in de popup. Je ziet hem pas als je een cadeautje opent.',
} as const;

function isObject(x: unknown): x is Record<string, unknown> {
  return typeof x === 'object' && x !== null && !Array.isArray(x);
}

// Geplakte JSON (bijvoorbeeld van Claude) mag onvolledig zijn: wat ontbreekt blijft zoals het nu is.
function voegSamen(huidig: CadeautjeConfig, ingevoerd: Record<string, unknown>): unknown {
  const lijst = Array.isArray(ingevoerd.cadeautjes) ? ingevoerd.cadeautjes : undefined;
  return {
    ...huidig,
    ...ingevoerd,
    kleuren: { ...huidig.kleuren, ...(isObject(ingevoerd.kleuren) ? ingevoerd.kleuren : {}) },
    opties: { ...huidig.opties, ...(isObject(ingevoerd.opties) ? ingevoerd.opties : {}) },
    knoppen: { ...huidig.knoppen, ...(isObject(ingevoerd.knoppen) ? ingevoerd.knoppen : {}) },
    teksten: { ...huidig.teksten, ...(isObject(ingevoerd.teksten) ? ingevoerd.teksten : {}) },
    ...(ingevoerd.aantalCadeautjes === undefined && lijst ? { aantalCadeautjes: Math.min(MAX_CADEAUTJES, Math.max(1, lijst.length)) } : {}),
  };
}

// Huisstijl: de kleuren en lettertypes, als blok tekst om te bewaren of in een andere pagina te plakken
function huisstijlTekst(config: CadeautjeConfig): string {
  const { kleuren, lettertype, lettertypes, titelGrootte } = config;
  return JSON.stringify({ kleuren, lettertype, lettertypes, titelGrootte }, null, 2);
}

/** Leest een geplakt huisstijlblok en zet het in de instellingen. Andere instellingen (teksten, cadeautjes) blijven zoals ze zijn. */
function huisstijlToepassen(huidig: CadeautjeConfig, tekst: string): { ok: true; config: CadeautjeConfig } | { ok: false; regel: string } {
  const van = tekst.indexOf('{');
  const tot = tekst.lastIndexOf('}');
  let ruw: unknown;
  try {
    ruw = JSON.parse(van >= 0 && tot > van ? tekst.slice(van, tot + 1) : tekst);
  } catch {
    return { ok: false, regel: 'Dit lijkt niet op gekopieerde kleuren. Kopieer ze eerst met "Kopieer mijn kleuren".' };
  }
  if (!isObject(ruw) || !isObject(ruw.kleuren)) {
    return { ok: false, regel: 'Ik vind hier geen kleuren in. Kopieer ze eerst met "Kopieer mijn kleuren".' };
  }
  const uitkomst = leesConfig({
    ...huidig,
    kleuren: { ...huidig.kleuren, ...ruw.kleuren },
    ...(ruw.lettertype !== undefined ? { lettertype: ruw.lettertype } : {}),
    ...(isObject(ruw.lettertypes) ? { lettertypes: { ...huidig.lettertypes, ...ruw.lettertypes } } : {}),
    ...(ruw.titelGrootte !== undefined ? { titelGrootte: ruw.titelGrootte } : {}),
  });
  if (!uitkomst.ok) return { ok: false, regel: `Deze kleuren kloppen niet helemaal: ${uitkomst.fouten[0]}` };
  return { ok: true, config: uitkomst.config };
}

function UitlogVenster({ fouten, bezig, opOpslaan, opZonderOpslaan, opTerug }: { fouten: string[]; bezig: boolean; opOpslaan: () => void; opZonderOpslaan: () => void; opTerug: () => void }) {
  const eerste = useRef<HTMLButtonElement>(null);
  useEffect(() => { eerste.current?.focus(); }, []);
  const kanOpslaan = fouten.length === 0;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={opTerug}
      onKeyDown={(e) => { if (e.key === 'Escape') opTerug(); }}
    >
      <div role="dialog" aria-modal="true" aria-labelledby="uitlog-titel" onClick={(e) => e.stopPropagation()} className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <h2 id="uitlog-titel" className="text-lg font-bold">{kanOpslaan ? 'Je hebt nog niet opgeslagen' : 'Eerst dit oplossen'}</h2>
        {kanOpslaan ? (
          <p className="mt-2 text-sm text-slate-700">Als je nu uitlogt, gaan je wijzigingen verloren. Wil je ze eerst opslaan?</p>
        ) : (
          <>
            <p className="mt-2 text-sm text-slate-700">Je wijzigingen kunnen nog niet worden opgeslagen. Dit moet eerst nog aangepast worden:</p>
            <ul className="ml-5 mt-2 list-disc text-sm text-red-800">{fouten.slice(0, 6).map((f) => <li key={f}>{f}</li>)}</ul>
          </>
        )}
        <div className="mt-5 flex flex-wrap justify-end gap-2">
          <button type="button" onClick={opZonderOpslaan} className={KNOP}>Uitloggen zonder opslaan</button>
          {kanOpslaan ? (
            <>
              <button type="button" onClick={opTerug} className={KNOP}>Terug</button>
              <button ref={eerste} type="button" onClick={opOpslaan} disabled={bezig} className={KNOP_PRIMAIR}>{bezig ? 'Opslaan...' : 'Opslaan en uitloggen'}</button>
            </>
          ) : (
            <button ref={eerste} type="button" onClick={opTerug} className={KNOP_PRIMAIR}>Terug en oplossen</button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Editor({ beginConfig, modus, versie: beginVersie }: { beginConfig: CadeautjeConfig; modus: OpslagModus; versie: VersieInfo }) {
  // De versie-informatie komt bij het openen van de pagina mee, en wordt bijgewerkt met de knop Zoek naar updates
  const [versie, setVersie] = useState(beginVersie);
  const router = useRouter();
  const [config, setConfig] = useState(beginConfig);
  const [opgeslagen, setOpgeslagen] = useState(() => JSON.stringify(beginConfig));
  const [tab, setTab] = useState<Tab>('Algemeen');
  const [bezig, setBezig] = useState(false);
  const [uitlogVraag, setUitlogVraag] = useState(false);
  const [huisBericht, setHuisBericht] = useState<Bericht>(null);
  const [huisPlakVeld, setHuisPlakVeld] = useState<string | null>(null);
  const [bericht, setBericht] = useState<Bericht>(null);
  // Met "Opnieuw beginnen" in het voorbeeld laden we het voorbeeld opnieuw, zodat het geheugen van het voorbeeld leeg is
  const [previewTeller, setPreviewTeller] = useState(0);
  const [previewEmbed, setPreviewEmbed] = useState(false);
  const [jsonTekst, setJsonTekst] = useState('');
  const [importBericht, setImportBericht] = useState<Bericht>(null);
  const frame = useRef<HTMLIFrameElement>(null);

  const controle = useMemo(() => leesConfig(config), [config]);
  const gewijzigd = JSON.stringify(config) !== opgeslagen;
  // Gebruikt de pagina een eigen achtergrondafbeelding? Dan doet de achtergrondkleur niet mee.
  const achtergrondActief = heeftAchtergrondAfbeelding(config.opties);
  const popupActief = heeftPopupAchtergrond(config.opties);
  const maten = achtergrondMaten(config.aantalCadeautjes);
  // Welke eigen lettertypes zijn geüpload? Alleen die staan in de keuzelijstjes.
  const eigenGebruik = EIGEN_LETTERTYPES.map((e) => ({ ...e, naam: config[e.sleutel].naam || LETTERTYPES[e.keuze].naam, aanwezig: Boolean(config[e.sleutel].normaal || config[e.sleutel].vet) }));
  const lijst = useMemo(() => cadeautjesVoor(config), [config]);
  const kleurenAangepast = !kleurenGelijkAanThema(config.kleuren, config.thema);
  // Cadeautjes die nog de voorbeeldtekst uit config/cadeautje.json hebben
  const voorbeeldCadeautjes = useMemo(
    () => lijst.filter((c, i) => standaardConfig.cadeautjes[i] && c.titel === standaardConfig.cadeautjes[i].titel && c.tekst === standaardConfig.cadeautjes[i].tekst).map((c) => c.nr),
    [lijst],
  );
  const voorbeeldTitel = config.titel === standaardConfig.titel;

  const waarschuwingen = useMemo(() => {
    const k = config.kleuren;
    const w: string[] = [];
    if (contrast(k.achtergrond, k.accent) < 3) w.push('De accentkleur valt weg tegen de achtergrond, dus de titel is slecht leesbaar.');
    if (contrast(k.licht, k.primair) < 4.5) w.push('De primaire kleur is slecht leesbaar op de lichte kleur (titels in de popup).');
    if (contrast(k.licht, k.tekst) < 4.5) w.push('De tekstkleur is slecht leesbaar op de lichte kleur (tekst in de popup).');
    return w;
  }, [config.kleuren]);

  // Voorbeeld: de iframe laadt /?preview=1 en krijgt de instellingen live via postMessage
  const previewSrc = `/?preview=1${previewEmbed ? '&embed=true' : ''}`;

  useEffect(() => {
    const stuur = () => frame.current?.contentWindow?.postMessage({ type: BERICHT_CONFIG, config }, window.location.origin);
    const timer = setTimeout(stuur, 120);
    const opKlaar = (e: MessageEvent) => {
      if (e.origin === window.location.origin && e.data?.type === BERICHT_KLAAR) stuur();
    };
    window.addEventListener('message', opKlaar);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('message', opKlaar);
    };
  }, [config, previewSrc, previewTeller]);

  useEffect(() => {
    if (!gewijzigd) return;
    const waarschuw = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener('beforeunload', waarschuw);
    return () => window.removeEventListener('beforeunload', waarschuw);
  }, [gewijzigd]);

  function zet<K extends keyof CadeautjeConfig>(sleutel: K, waarde: CadeautjeConfig[K]) {
    setConfig((c) => ({ ...c, [sleutel]: waarde }));
  }

  // Het aantal cadeautjes tussen 1 en 10, en het aantal dat je mag openen daar nooit boven
  function zetAantal(n: number) {
    const aantal = Math.min(MAX_CADEAUTJES, Math.max(1, Math.round(Number.isFinite(n) ? n : 1)));
    setConfig((c) => ({ ...c, aantalCadeautjes: aantal, aantalKiezen: Math.min(c.aantalKiezen, aantal) }));
  }

  function zetKiezen(n: number) {
    setConfig((c) => ({ ...c, aantalKiezen: Math.min(c.aantalCadeautjes, Math.max(1, Math.round(Number.isFinite(n) ? n : 1))) }));
  }

  // Laat in het voorbeeld de onderdelen met deze kleur oplichten (of niets, bij null)
  function markeerKleur(kleur: string | null) {
    frame.current?.contentWindow?.postMessage({ type: BERICHT_MARKEER, kleur }, window.location.origin);
  }

  function zetKleur(naam: Exclude<keyof CadeautjeConfig['kleuren'], 'tegels'>, hex: string) {
    setConfig((c) => ({ ...c, kleuren: { ...c.kleuren, [naam]: hex } }));
  }

  function zetTegel(i: number, hex: string) {
    setConfig((c) => ({ ...c, kleuren: { ...c.kleuren, tegels: c.kleuren.tegels.map((t, j) => (j === i ? hex : t)) } }));
  }

  // Een thema zet de kleuren, het decor en de verpakking. De titel en ondertitel veranderen alleen mee als je ze nog niet zelf hebt aangepast.
  function kiesThema(naam: ThemaNaam) {
    const nieuw = THEMAS[naam];
    setConfig((c) => {
      const oud = THEMAS[c.thema];
      return {
        ...c,
        thema: naam,
        titel: c.titel === oud.titel || c.titel === standaardConfig.titel ? nieuw.titel : c.titel,
        ondertitel: c.ondertitel === oud.ondertitel || c.ondertitel === standaardConfig.ondertitel ? nieuw.ondertitel : c.ondertitel,
        kleuren: { ...nieuw.kleuren, tegels: [...nieuw.kleuren.tegels] },
        opties: { ...c.opties, decor: nieuw.decor, verpakking: nieuw.verpakking },
      };
    });
  }

  function zetLettertype(plek: LettertypePlek, waarde: Lettertype) {
    setConfig((c) => ({ ...c, lettertypes: { ...c.lettertypes, [plek]: waarde } }));
  }

  function zetEigenLettertype(sleutel: EigenSleutel, delen: Partial<CadeautjeConfig['eigenLettertype']>) {
    setConfig((c) => {
      const eigen = { ...c[sleutel], ...delen };
      const keuze = EIGEN_LETTERTYPES.find((e) => e.sleutel === sleutel)?.keuze;
      // Is er geen bestand meer, dan kan geen enkel onderdeel het nog gebruiken
      const lettertypes = eigen.normaal || eigen.vet
        ? c.lettertypes
        : Object.fromEntries(Object.entries(c.lettertypes).map(([plek, k]) => [plek, k === keuze ? '' : k])) as CadeautjeConfig['lettertypes'];
      return { ...c, [sleutel]: eigen, lettertypes };
    });
  }

  function zetOptie<K extends keyof CadeautjeConfig['opties']>(naam: K, waarde: CadeautjeConfig['opties'][K]) {
    setConfig((c) => ({ ...c, opties: { ...c.opties, [naam]: waarde } }));
  }

  function zetTekst(naam: keyof CadeautjeConfig['teksten'], waarde: string) {
    setConfig((c) => ({ ...c, teksten: { ...c.teksten, [naam]: waarde } }));
  }

  function zetKnoppen(deel: Partial<CadeautjeConfig['knoppen']>) {
    setConfig((c) => ({ ...c, knoppen: { ...c.knoppen, ...deel } }));
  }

  // Past een cadeautje aan. Ontbrekende cadeautjes worden eerst aangevuld, zodat de lijst altijd klopt met het aantal.
  function wijzigCadeautje(i: number, deel: Partial<Cadeautje>) {
    setConfig((c) => {
      const nieuw = cadeautjesVoor(c).map(({ nr: _nr, ...rest }) => rest as Cadeautje);
      nieuw[i] = { ...nieuw[i], ...deel };
      // Cadeautjes boven het huidige aantal blijven bewaard, zodat ze terugkomen als je het aantal weer verhoogt
      return { ...c, cadeautjes: [...nieuw, ...c.cadeautjes.slice(nieuw.length)] };
    });
  }

  // Pijltjestoetsen, Home en End wisselen van tabblad
  function opTabToets(e: React.KeyboardEvent, i: number) {
    const n = TABS.length;
    const volgende = e.key === 'ArrowRight' ? (i + 1) % n : e.key === 'ArrowLeft' ? (i - 1 + n) % n : e.key === 'Home' ? 0 : e.key === 'End' ? n - 1 : null;
    if (volgende === null) return;
    e.preventDefault();
    setTab(TABS[volgende]);
    document.getElementById(`tab-${volgende}`)?.focus();
  }

  async function bewaar(): Promise<boolean> {
    setBezig(true);
    setBericht(null);
    const res = await fetch('/api/beheer/config', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      setConfig(data.config);
      setOpgeslagen(JSON.stringify(data.config));
      setBericht({ soort: 'ok', regels: ['Opgeslagen. De pagina is bijgewerkt.'] });
    } else {
      setBericht({ soort: 'fout', regels: data.fouten ?? ['Opslaan is niet gelukt.'] });
    }
    setBezig(false);
    return res.ok;
  }

  async function uitloggen() {
    await fetch('/api/beheer/logout', { method: 'POST' });
    router.refresh();
  }

  // Uitloggen laadt de pagina niet opnieuw, dus de waarschuwing van de browser springt hier niet aan. We vragen het zelf.
  function vraagUitloggen() {
    if (gewijzigd) setUitlogVraag(true);
    else void uitloggen();
  }

  async function bewaarEnLoguit() {
    if (await bewaar()) await uitloggen();
    else setUitlogVraag(false);
  }

  function importeer() {
    // Claude zet de JSON vaak in een codeblok of met een zin ervoor en erna: we pakken alles van de eerste { tot de laatste }
    const van = jsonTekst.indexOf('{');
    const tot = jsonTekst.lastIndexOf('}');
    const kandidaat = van >= 0 && tot > van ? jsonTekst.slice(van, tot + 1) : jsonTekst;
    let ruw: unknown;
    try {
      ruw = JSON.parse(kandidaat);
    } catch {
      setImportBericht({ soort: 'fout', regels: ['Ik kan hier geen geldige JSON in vinden. Kopieer het hele blok van Claude, van { tot en met }.'] });
      return;
    }
    if (!isObject(ruw)) {
      setImportBericht({ soort: 'fout', regels: ['De JSON moet beginnen met { en eindigen met }.'] });
      return;
    }
    const uitkomst = leesConfig(voegSamen(config, ruw));
    if (uitkomst.ok) {
      setConfig(uitkomst.config);
      setImportBericht({ soort: 'ok', regels: ['Geïmporteerd. Controleer het voorbeeld en klik daarna op Opslaan.'] });
    } else {
      setImportBericht({ soort: 'fout', regels: uitkomst.fouten });
    }
  }

  async function kopieerHuisstijl() {
    try {
      await navigator.clipboard.writeText(huisstijlTekst(config));
      setHuisBericht({ soort: 'ok', regels: ['Je kleuren en lettertypes staan op je klembord. Plak ze ergens veilig, bijvoorbeeld in een notitie.'] });
    } catch {
      setHuisPlakVeld(huisstijlTekst(config));
      setHuisBericht({ soort: 'fout', regels: ['Kopiëren lukt niet in deze browser. Selecteer de tekst hieronder en kopieer hem zelf.'] });
    }
  }

  function pasHuisstijlToe(tekst: string) {
    const uitkomst = huisstijlToepassen(config, tekst);
    if (uitkomst.ok) {
      setConfig(uitkomst.config);
      setHuisPlakVeld(null);
      setHuisBericht({ soort: 'ok', regels: ['De kleuren zijn toegepast. Kijk in het voorbeeld en klik op Opslaan als je ze wilt houden.'] });
    } else {
      setHuisBericht({ soort: 'fout', regels: [uitkomst.regel] });
    }
  }

  async function plakHuisstijl() {
    try {
      pasHuisstijlToe(await navigator.clipboard.readText());
    } catch {
      // Sommige browsers laten het klembord niet zomaar lezen: dan plakt de gebruiker zelf in een vak
      setHuisPlakVeld('');
      setHuisBericht({ soort: 'ok', regels: ['Plak je kleuren in het vak hieronder en klik op Toepassen.'] });
    }
  }

  async function kopieer(tekst: string, melding: string) {
    try {
      await navigator.clipboard.writeText(tekst);
      setImportBericht({ soort: 'ok', regels: [melding] });
    } catch {
      setImportBericht({ soort: 'fout', regels: ['Kopiëren lukt niet in deze browser. Selecteer de tekst en kopieer hem zelf.'] });
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <EigenLettertypeStijl eigen={config.eigenLettertype} eigen2={config.eigenLettertype2} />
      <header className="mb-4 flex flex-wrap items-center gap-3">
        <h1 className="mr-auto text-2xl font-bold">Beheer van je cadeautjespagina</h1>
        <a href="/" target="_blank" rel="noopener noreferrer" className={KNOP}>Bekijk de pagina</a>
        <button type="button" onClick={vraagUitloggen} className={KNOP}>Uitloggen</button>
        <button type="button" onClick={bewaar} disabled={bezig || !gewijzigd || !controle.ok} className={KNOP_PRIMAIR}>
          {bezig ? 'Opslaan...' : gewijzigd ? 'Opslaan' : 'Opgeslagen'}
        </button>
      </header>

      {uitlogVraag && (
        <UitlogVenster
          fouten={controle.ok ? [] : controle.fouten}
          bezig={bezig}
          opOpslaan={bewaarEnLoguit}
          opZonderOpslaan={uitloggen}
          opTerug={() => setUitlogVraag(false)}
        />
      )}

      {versie.nieuwste && (
        <div role="status" className="mb-4 flex flex-wrap items-center gap-3 rounded-lg border border-sky-300 bg-sky-50 p-3 text-sm text-sky-900">
          <p className="flex-1">
            <strong>Er is een nieuwe versie van de cadeautje-starter: {versie.nieuwste}.</strong> Jij hebt versie {versie.huidig}.
            Je teksten, kleuren en logo blijven bewaard.
          </p>
          <button type="button" onClick={() => setTab('Updates')} className={KNOP}>Hoe update ik?</button>
        </div>
      )}

      {modus === 'geen' && (
        <div className="mb-4 rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
          Opslaan werkt nog niet, want er is geen Blob-opslag gekoppeld. Ga in Vercel naar Storage, kies Create en dan Blob, en deploy opnieuw.
          Je kunt nu wel alles invullen en via &quot;Importeren en exporteren&quot; bewaren.
        </div>
      )}
      {modus === 'bestand' && (
        <div className="mb-4 rounded-lg border border-sky-300 bg-sky-50 p-3 text-sm text-sky-900">
          Lokale testmodus: je instellingen worden opgeslagen in <code className="font-mono">.cadeautje-config.local.json</code> op je eigen computer.
        </div>
      )}

      {bericht && (
        <div
          role={bericht.soort === 'fout' ? 'alert' : 'status'}
          className={`mb-4 rounded-lg border p-3 text-sm ${bericht.soort === 'ok' ? 'border-emerald-300 bg-emerald-50 text-emerald-900' : 'border-red-300 bg-red-50 text-red-900'}`}
        >
          {bericht.regels.map((r) => <p key={r}>{r}</p>)}
        </div>
      )}
      {!controle.ok && (
        <div role="alert" className="mb-4 rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-900">
          <p className="font-semibold">Dit moet nog even aangepast worden voordat je kunt opslaan:</p>
          <ul className="ml-5 list-disc">{controle.fouten.slice(0, 6).map((f) => <li key={f}>{f}</li>)}</ul>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <section>
          <div role="tablist" aria-label="Onderdelen" className="mb-4 flex flex-wrap gap-1 border-b border-slate-200">
            {TABS.map((t, i) => (
              <button
                key={t}
                id={`tab-${i}`}
                role="tab"
                type="button"
                aria-selected={tab === t}
                aria-controls="tabpaneel"
                tabIndex={tab === t ? 0 : -1}
                onKeyDown={(e) => opTabToets(e, i)}
                onClick={() => setTab(t)}
                className={`-mb-px rounded-t-lg border px-3 py-2 text-sm font-medium ${tab === t ? 'border-slate-200 border-b-slate-50 bg-slate-50 text-emerald-800' : 'border-transparent text-slate-600 hover:text-slate-900'}`}
              >
                {t}
              </button>
            ))}
          </div>

          <div role="tabpanel" id="tabpaneel" aria-labelledby={`tab-${TABS.indexOf(tab)}`}>
          {tab === 'Algemeen' && (
            <div className="space-y-4">
              <Veld label="Titel van de pagina"><input className={INPUT} value={config.titel} maxLength={80} onChange={(e) => zet('titel', e.target.value)} /></Veld>
              <Veld label="Ondertitel"><input className={INPUT} value={config.ondertitel} maxLength={120} onChange={(e) => zet('ondertitel', e.target.value)} /></Veld>
              <Veld label="Tekst onderaan"><input className={INPUT} value={config.footer} maxLength={200} onChange={(e) => zet('footer', e.target.value)} /></Veld>
              <div className="grid gap-4 rounded-lg border border-slate-200 bg-white p-4 sm:grid-cols-2">
                <Veld label="Aantal cadeautjes" hint={`Tussen 1 en ${MAX_CADEAUTJES}. Standaard 5.`}>
                  <input type="number" min={1} max={MAX_CADEAUTJES} className={INPUT} value={config.aantalCadeautjes} onChange={(e) => zetAantal(Number(e.target.value))} />
                </Veld>
                <Veld label="Hoeveel mag de bezoeker er openen?" hint={`Tussen 1 en ${config.aantalCadeautjes}. Standaard 1. Daarna blijven de andere dicht.`}>
                  <input type="number" min={1} max={config.aantalCadeautjes} className={INPUT} value={config.aantalKiezen} onChange={(e) => zetKiezen(Number(e.target.value))} />
                </Veld>
              </div>
              <Veld label="Grootte van de titel" hint="100% is de standaardgrootte. Een lange titel past beter met een kleinere grootte. Op een telefoon is de kaart smal: een heel grote titel breekt daar lange woorden af.">
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={60}
                    max={200}
                    step={5}
                    value={config.titelGrootte}
                    onChange={(e) => zet('titelGrootte', Number(e.target.value))}
                    aria-label="Grootte van de titel in procenten"
                    className="h-2 flex-1 cursor-pointer"
                  />
                  <span className="w-14 text-right text-sm tabular-nums">{config.titelGrootte}%</span>
                  <button type="button" onClick={() => zet('titelGrootte', 100)} disabled={config.titelGrootte === 100} className={KNOP}>Standaard</button>
                </div>
              </Veld>
              <fieldset className="space-y-3 rounded-lg border border-slate-200 bg-white p-4">
                <legend className="px-1 text-sm font-medium">Lettertypes</legend>
                <p className="text-xs text-slate-500">Kies per onderdeel een lettertype. Onder de keuze zie je meteen hoe het eruitziet.</p>
                {(Object.keys(LETTERTYPE_PLEKKEN) as LettertypePlek[]).map((plek) => {
                  const gekozen = lettertypeVoor(config, plek);
                  return (
                    <Veld key={plek} label={LETTERTYPE_PLEKKEN[plek].naam} hint={LETTERTYPE_PLEKKEN[plek].uitleg}>
                      <select className={INPUT} value={gekozen} onChange={(e) => zetLettertype(plek, e.target.value as Lettertype)}>
                        {(Object.keys(LETTERTYPES) as Lettertype[]).map((l) => ({ l, eigen: eigenGebruik.find((e) => e.keuze === l) })).filter(({ l, eigen }) => (l !== 'eigen' && l !== 'eigen2') || eigen?.aanwezig).map(({ l, eigen }) => <option key={l} value={l}>{eigen ? eigen.naam : LETTERTYPES[l].naam}</option>)}
                      </select>
                      <p className="mt-1 text-lg text-slate-700" style={{ fontFamily: LETTERTYPES[gekozen].stack }}>Cadeautje 1 2 3 ✦</p>
                    </Veld>
                  );
                })}
                <div className="space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <p className="text-sm font-medium">Eigen lettertypes (optioneel)</p>
                  <p className="text-xs text-slate-500">
                    Upload tot twee lettertypes die je zelf hebt. Bij elk lettertype upload je een bestand voor gewone tekst en eventueel een voor vette tekst
                    (otf, ttf, woff of woff2, maximaal 2 MB per bestand). Daarna kies je ze hierboven bij elk onderdeel, net als de andere lettertypes.
                  </p>
                  <p className="rounded-lg border border-amber-300 bg-amber-50 p-2 text-xs text-amber-950">
                    <strong>Let op de licentie.</strong> Een lettertype op een website tonen is vaak een andere licentie dan een lettertype op je computer gebruiken. Controleer of jouw licentie webgebruik toestaat.
                    De bestanden laden alleen vanaf deze pagina, maar een bezoeker kan ze met de ontwikkelaarstools van zijn browser nog steeds downloaden. Echt geheim blijft een lettertype op een website nooit.
                  </p>
                  {EIGEN_LETTERTYPES.map(({ sleutel, kop }) => (
                    <div key={sleutel} className="space-y-2 rounded-lg border border-slate-200 bg-white p-3">
                      <p className="text-sm font-semibold">{kop}</p>
                      <Veld label="Naam van het lettertype" hint="Alleen voor jezelf, zodat je het hierboven herkent.">
                        <input className={INPUT} value={config[sleutel].naam} maxLength={40} onChange={(e) => zetEigenLettertype(sleutel, { naam: e.target.value })} placeholder="Bijvoorbeeld de naam van je huisstijllettertype" />
                      </Veld>
                      <div className="grid gap-2 sm:grid-cols-2">
                        <LettertypeUpload label="Gewoon" id={config[sleutel].normaal} onId={(id) => zetEigenLettertype(sleutel, { normaal: id })} onWis={() => zetEigenLettertype(sleutel, { normaal: '' })} />
                        <LettertypeUpload label="Vet (optioneel)" id={config[sleutel].vet} onId={(id) => zetEigenLettertype(sleutel, { vet: id })} onWis={() => zetEigenLettertype(sleutel, { vet: '' })} />
                      </div>
                    </div>
                  ))}
                </div>
              </fieldset>
            </div>
          )}

          {tab === 'Kleuren en logo' && (
            <div className="space-y-6">
              <div>
                <p className="mb-1 text-sm font-medium">Kies een thema</p>
                <p className="mb-3 text-xs text-slate-500">
                  Je gebruikt het thema {THEMAS[config.thema].naam}{kleurenAangepast ? ', met eigen kleuren' : ''}. Een thema zet de kleuren, het decor, de verpakking en de icoontjes.
                  Daarna pas je alles nog aan. Wil je helemaal je eigen huisstijl? Kies dan &quot;Eigen huisstijl&quot; en zet hieronder je kleuren, lettertypes, logo en achtergrond.
                </p>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3" role="group" aria-label="Thema's">
                  {THEMA_SLEUTELS.map((n) => {
                    const t = THEMAS[n];
                    const actief = n === config.thema;
                    return (
                      <button
                        key={n}
                        type="button"
                        onClick={() => kiesThema(n)}
                        aria-pressed={actief}
                        className={`rounded-xl border-2 bg-white p-2 text-left transition-colors ${actief ? 'border-emerald-700 ring-2 ring-emerald-200' : 'border-slate-200 hover:border-slate-400'}`}
                      >
                        <span className="block rounded-lg p-2" style={{ background: t.kleuren.achtergrond }}>
                          <span className="mb-1.5 flex items-center gap-1" style={{ color: t.kleuren.accent }}>
                            <CadeauIcoon naam={t.iconen[0]} className="h-4 w-4" />
                            <span className="block h-1.5 w-10 rounded-full" style={{ background: t.kleuren.accent }} />
                          </span>
                          <span className="flex gap-1">
                            {t.kleuren.tegels.map((c, i) => (
                              <span key={i} className="block h-6 flex-1 rounded" style={{ background: c, border: `1px solid ${t.kleuren.accent}` }} />
                            ))}
                          </span>
                        </span>
                        <span className="mt-2 block text-sm font-semibold">{t.naam}{actief ? ' ✓' : ''}</span>
                        <span className="block text-xs text-slate-500">{t.omschrijving}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <p className="text-xs text-slate-500">
                Wijs een kleur aan: in het voorbeeld lichten de onderdelen op die deze kleur gebruiken.
                {achtergrondActief && ' Je gebruikt een eigen achtergrondafbeelding: de achtergrondkleur zie je alleen even terwijl die laadt.'}
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <KleurVeld sleutel="achtergrond" gebruikt={KLEUR_GEBRUIK.achtergrond} opMarkeer={markeerKleur} label="Achtergrond van de kaart" waarde={config.kleuren.achtergrond} onChange={(h) => zetKleur('achtergrond', h)} />
                <KleurVeld sleutel="accent" gebruikt={KLEUR_GEBRUIK.accent} opMarkeer={markeerKleur} label="Accentkleur" waarde={config.kleuren.accent} onChange={(h) => zetKleur('accent', h)} />
                <KleurVeld sleutel="licht" gebruikt={KLEUR_GEBRUIK.licht} opMarkeer={markeerKleur} label="Lichte kleur" waarde={config.kleuren.licht} onChange={(h) => zetKleur('licht', h)} />
                <KleurVeld sleutel="primair" gebruikt={KLEUR_GEBRUIK.primair} opMarkeer={markeerKleur} label="Primaire kleur" waarde={config.kleuren.primair} onChange={(h) => zetKleur('primair', h)} />
                <KleurVeld sleutel="secundair" gebruikt={KLEUR_GEBRUIK.secundair} opMarkeer={markeerKleur} label="Secundaire kleur" waarde={config.kleuren.secundair} onChange={(h) => zetKleur('secundair', h)} />
                <KleurVeld sleutel="tekst" gebruikt={KLEUR_GEBRUIK.tekst} opMarkeer={markeerKleur} label="Tekstkleur in de popup" waarde={config.kleuren.tekst} onChange={(h) => zetKleur('tekst', h)} />
              </div>

              <div>
                <p className="mb-2 text-sm font-medium">Kleuren van de cadeautjes (ze wisselen elkaar af)</p>
                <div className="grid gap-4 sm:grid-cols-2">
                  {config.kleuren.tegels.map((t, i) => (
                    <KleurVeld key={i} sleutel={`tegel${i + 1}`} gebruikt="Wisselt af met de andere cadeautjeskleuren." opMarkeer={markeerKleur} label={`Cadeautjeskleur ${i + 1}`} waarde={t} onChange={(h) => zetTegel(i, h)} />
                  ))}
                </div>
              </div>

              <div className="rounded-lg border border-slate-200 bg-white p-3">
                <p className="text-sm font-medium">Bewaar je huisstijl</p>
                <p className="mb-2 text-xs text-slate-500">Zet je kleuren en lettertypes op je klembord om ze te bewaren, of plak ze terug. Je teksten en cadeautjes blijven zoals ze zijn.</p>
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={kopieerHuisstijl} className={KNOP}>Kopieer mijn kleuren</button>
                  <button type="button" onClick={plakHuisstijl} className={KNOP}>Plak kleuren</button>
                </div>
                {huisPlakVeld !== null && (
                  <div className="mt-2 space-y-2">
                    <textarea
                      className={`${INPUT} font-mono`}
                      rows={6}
                      value={huisPlakVeld}
                      spellCheck={false}
                      aria-label="Kleuren plakken"
                      onChange={(e) => setHuisPlakVeld(e.target.value)}
                    />
                    <button type="button" onClick={() => pasHuisstijlToe(huisPlakVeld)} disabled={!huisPlakVeld.trim()} className={KNOP_PRIMAIR}>Toepassen</button>
                  </div>
                )}
                {huisBericht && (
                  <p role={huisBericht.soort === 'fout' ? 'alert' : 'status'} className={`mt-2 text-sm ${huisBericht.soort === 'ok' ? 'text-emerald-800' : 'text-red-800'}`}>
                    {huisBericht.regels.join(' ')}
                  </p>
                )}
              </div>

              {waarschuwingen.length > 0 && (
                <div className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
                  {waarschuwingen.map((w) => <p key={w}>{w}</p>)}
                </div>
              )}

              <div className="space-y-3 border-t border-slate-200 pt-4">
                <p className="text-sm font-medium">Logo</p>
                {config.logoUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={config.logoUrl} alt="Je logo" className="max-h-16 max-w-full rounded border border-slate-200 bg-slate-200 p-2" />
                )}
                <Veld label="Link naar je logo" hint="Plak een link die met https:// begint, of upload hieronder een bestand (png, jpg, webp of gif, max 2 MB).">
                  <input className={INPUT} value={config.logoUrl} onChange={(e) => zet('logoUrl', e.target.value.trim())} placeholder="https://" />
                </Veld>
                <div className="flex flex-wrap gap-2">
                  <UploadKnop label="Logo uploaden" onUrl={(url) => zet('logoUrl', url)} />
                  {config.logoUrl && <button type="button" onClick={() => zet('logoUrl', '')} className={KNOP}>Logo weghalen</button>}
                </div>
              </div>

              <details className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <summary className="cursor-pointer text-sm font-medium">Eigen achtergrondafbeelding (optioneel){achtergrondActief && <span className="ml-2 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-800">in gebruik</span>}</summary>
                <div className="mt-3 space-y-3">
                <p className="text-xs text-slate-500">
                  Zet een eigen afbeelding achter je hele pagina. De cadeautjes komen eroverheen. Zolang je een afbeelding gebruikt, doen de achtergrondkleur niet mee.
                  De kleuren van de cadeautjes, de knoppen en het popupvenster blijven gewoon gelden.
                </p>
                <div className="space-y-1 rounded-lg border border-sky-200 bg-sky-50 p-3 text-xs text-sky-950">
                  <p className="font-semibold">Zo maak je hem (voor jouw pagina met {config.aantalCadeautjes} cadeautjes)</p>
                  <ul className="ml-4 list-disc space-y-1">
                    <li><strong>Computer en laptop</strong> (schermen vanaf 768 px breed): <strong>{maten.computer.breedte} × {maten.computer.hoogte} px</strong>. De pagina is dan 768 px breed en ongeveer {maten.computer.hoogte / 2} px hoog. Wij rekenen twee keer zo groot, zodat het ook op een scherm met veel pixels scherp blijft.</li>
                    <li><strong>Telefoon</strong>: <strong>{maten.telefoon.breedte} × {maten.telefoon.hoogte} px</strong>. De pagina is op een telefoon ongeveer 370 px breed. Let op: de pagina in je Kennis Shop-les is meestal smaller dan 768 px en laat dus ook de <strong>telefoonversie</strong> zien. Lever die dus zeker aan.</li>
                    <li>Heb je er maar één? Dan gebruikt de pagina die voor alle schermen. Past de verhouding niet precies, dan wordt de afbeelding bijgesneden en vult hij de pagina helemaal. Houd belangrijke dingen dus in het midden.</li>
                    <li>Verander je het aantal cadeautjes, dan verandert de hoogte van de pagina. Controleer dan de maat opnieuw.</li>
                    <li>Kies rustig beeld waar de cadeautjes goed op afsteken. Jpg of webp, maximaal 2 MB. Een afbeelding met veel rustige ruimte werkt het best.</li>
                  </ul>
                </div>
                {([
                  { sleutel: 'achtergrondAfbeelding', kop: 'Computer en laptop', maat: `${maten.computer.breedte} × ${maten.computer.hoogte} px` },
                  { sleutel: 'achtergrondAfbeeldingMobiel', kop: 'Telefoon', maat: `${maten.telefoon.breedte} × ${maten.telefoon.hoogte} px` },
                ] as const).map(({ sleutel, kop, maat }) => (
                  <div key={sleutel} className="space-y-2 rounded-lg border border-slate-200 bg-white p-3">
                    <p className="text-sm font-semibold">{kop} <span className="font-normal text-slate-500">({maat})</span></p>
                    {config.opties[sleutel] && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={config.opties[sleutel]} alt="" className="max-h-40 rounded-lg border border-slate-200 object-contain" style={{ background: config.kleuren.achtergrond }} />
                    )}
                    <div className="flex flex-wrap items-start gap-2">
                      <UploadKnop label={config.opties[sleutel] ? 'Vervang afbeelding' : 'Afbeelding uploaden'} onUrl={(url) => zetOptie(sleutel, url)} />
                      {config.opties[sleutel] && <button type="button" onClick={() => zetOptie(sleutel, '')} className={KNOP}>Verwijder</button>}
                    </div>
                    <Veld label="Of plak een link" hint="Een link die met https:// begint.">
                      <input className={INPUT} value={config.opties[sleutel]} maxLength={500} onChange={(e) => zetOptie(sleutel, e.target.value.trim())} placeholder="https://" />
                    </Veld>
                  </div>
                ))}
                {achtergrondActief && (
                  <div className="space-y-3 rounded-lg border border-slate-200 bg-white p-3">
                    <fieldset>
                      <legend className="text-sm font-semibold">Kleur van de titel en de tekst op de afbeelding</legend>
                      <div className="mt-1 space-y-1 text-sm">
                        <label className="flex items-center gap-2"><input type="radio" name="achtergrondTekst" checked={config.opties.achtergrondTekst === 'licht'} onChange={() => zetOptie('achtergrondTekst', 'licht')} /> Lichte tekst (voor een donkere afbeelding)</label>
                        <label className="flex items-center gap-2"><input type="radio" name="achtergrondTekst" checked={config.opties.achtergrondTekst === 'donker'} onChange={() => zetOptie('achtergrondTekst', 'donker')} /> Donkere tekst (voor een lichte afbeelding)</label>
                      </div>
                    </fieldset>
                    <Veld label="Laag over de afbeelding" hint={`Een ${config.opties.achtergrondTekst === 'licht' ? 'donkere' : 'lichte'} laag over je afbeelding maakt de titel en de teksten beter leesbaar. 0% laat de afbeelding helemaal zoals hij is.`}>
                      <div className="flex items-center gap-3">
                        <input type="range" min={0} max={80} step={5} value={config.opties.achtergrondLaag} onChange={(e) => zetOptie('achtergrondLaag', Number(e.target.value))} aria-label="Sterkte van de laag over de afbeelding in procenten" className="h-2 flex-1 cursor-pointer" />
                        <span className="w-14 text-right text-sm tabular-nums">{config.opties.achtergrondLaag}%</span>
                      </div>
                    </Veld>
                  </div>
                )}
                </div>
              </details>

              <details className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <summary className="cursor-pointer text-sm font-medium">Eigen achtergrond voor elk geopend cadeautje (optioneel){popupActief && <span className="ml-2 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-800">in gebruik</span>}</summary>
                <div className="mt-3 space-y-3">
                <p className="text-xs text-slate-500">
                  Zet een eigen afbeelding achter de tekst in elk cadeautje dat openstaat. De titel, de tekst en de knoppen komen eroverheen.
                  Een afbeelding voor alle schermen. Zonder afbeelding blijft het cadeautje de lichte kleur van je huisstijl houden.
                </p>
                <div className="space-y-1 rounded-lg border border-sky-200 bg-sky-50 p-3 text-xs text-sky-950">
                  <p className="font-semibold">Zo maak je hem</p>
                  <ul className="ml-4 list-disc space-y-1">
                    <li><strong>{POPUP_ACHTERGROND_MAAT.breedte} × {POPUP_ACHTERGROND_MAAT.hoogte} px</strong>. Het cadeautje is 448 px breed op een computer en ongeveer 330 tot 360 px op een telefoon. De hoogte hangt af van de tekst: ongeveer 330 px bij een kort tekstje, meer met een afbeelding of audio erbij. Wij rekenen twee keer zo groot, zodat het ook op een scherm met veel pixels scherp blijft.</li>
                    <li>De afbeelding vult het hele cadeautje. Past de verhouding niet, dan wordt hij bijgesneden (boven en onder, of links en rechts). Houd belangrijke dingen dus in het midden.</li>
                    <li>Kies rustig beeld, zonder veel details: de tekst moet eroverheen goed te lezen zijn. Jpg of webp, maximaal 2 MB.</li>
                    <li>Het balkje bovenin (&quot;Cadeautje 1 van 5&quot;) en de knop Sluiten houden hun kleur uit je huisstijl.</li>
                  </ul>
                </div>
                <div className="space-y-2 rounded-lg border border-slate-200 bg-white p-3">
                  {popupActief && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={config.opties.popupAchtergrond} alt="" className="max-h-40 rounded-lg border border-slate-200 object-contain" style={{ background: config.kleuren.licht }} />
                  )}
                  <div className="flex flex-wrap items-start gap-2">
                    <UploadKnop label={config.opties.popupAchtergrond ? 'Vervang afbeelding' : 'Afbeelding uploaden'} onUrl={(url) => zetOptie('popupAchtergrond', url)} />
                    {config.opties.popupAchtergrond && <button type="button" onClick={() => zetOptie('popupAchtergrond', '')} className={KNOP}>Verwijder</button>}
                  </div>
                  <Veld label="Of plak een link" hint="Een link die met https:// begint.">
                    <input className={INPUT} value={config.opties.popupAchtergrond} maxLength={500} onChange={(e) => zetOptie('popupAchtergrond', e.target.value.trim())} placeholder="https://" />
                  </Veld>
                </div>
                {popupActief && (
                  <div className="space-y-3 rounded-lg border border-slate-200 bg-white p-3">
                    <fieldset>
                      <legend className="text-sm font-semibold">Kleur van de titel en de tekst in het cadeautje</legend>
                      <div className="mt-1 space-y-1 text-sm">
                        <label className="flex items-center gap-2"><input type="radio" name="popupAchtergrondTekst" checked={config.opties.popupAchtergrondTekst === 'donker'} onChange={() => zetOptie('popupAchtergrondTekst', 'donker')} /> Donkere tekst (voor een lichte afbeelding)</label>
                        <label className="flex items-center gap-2"><input type="radio" name="popupAchtergrondTekst" checked={config.opties.popupAchtergrondTekst === 'licht'} onChange={() => zetOptie('popupAchtergrondTekst', 'licht')} /> Lichte tekst (voor een donkere afbeelding)</label>
                      </div>
                    </fieldset>
                    <Veld label="Laag over de afbeelding" hint={`Een ${config.opties.popupAchtergrondTekst === 'licht' ? 'donkere' : 'lichte'} laag over je afbeelding maakt de tekst beter leesbaar. 0% laat de afbeelding helemaal zoals hij is. Open een cadeautje in het voorbeeld om het resultaat te zien.`}>
                      <div className="flex items-center gap-3">
                        <input type="range" min={0} max={90} step={5} value={config.opties.popupAchtergrondLaag} onChange={(e) => zetOptie('popupAchtergrondLaag', Number(e.target.value))} aria-label="Sterkte van de laag over de achtergrond van het cadeautje in procenten" className="h-2 flex-1 cursor-pointer" />
                        <span className="w-14 text-right text-sm tabular-nums">{config.opties.popupAchtergrondLaag}%</span>
                      </div>
                    </Veld>
                  </div>
                )}
                </div>
              </details>
            </div>
          )}

          {tab === 'Cadeautjes' && (
            <div className="space-y-2">
              <p className="text-sm text-slate-600">
                Klik een cadeautje open om te bepalen wat erin zit. Het aantal cadeautjes en hoeveel de bezoeker er mag openen stel je in bij &quot;Algemeen&quot;.
                Wil je alle teksten door Claude laten schrijven? Kijk dan bij &quot;Importeren en exporteren&quot;.
              </p>
              {voorbeeldCadeautjes.length > 0 && (
                <p className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
                  {voorbeeldCadeautjes.length === lijst.length ? 'Alle cadeautjes hebben nog de voorbeeldtekst.' : `${voorbeeldCadeautjes.length} ${voorbeeldCadeautjes.length === 1 ? 'cadeautje heeft' : 'cadeautjes hebben'} nog de voorbeeldtekst.`}{' '}
                  Pas ze aan voordat je de pagina deelt.
                </p>
              )}
              {lijst.map((c, i) => {
                const icoon = c.icoon || THEMAS[config.thema].iconen[i % THEMAS[config.thema].iconen.length];
                return (
                  <details key={c.nr} className="rounded-lg border border-slate-200 bg-white">
                    <summary className="flex cursor-pointer flex-wrap items-center gap-2 px-3 py-2 text-sm font-medium">
                      <CadeauIcoon naam={icoon} className="h-5 w-5 text-emerald-800" />
                      <span>{c.nr}. {c.titel}</span>
                      {voorbeeldCadeautjes.includes(c.nr) && <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-800">voorbeeldtekst</span>}
                      {c.code.aan && c.code.waarde && <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-800">code</span>}
                      {c.knop.aan && c.knop.url && <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-800">knop</span>}
                    </summary>
                    <div className="space-y-3 border-t border-slate-200 p-3">
                      <Veld label="Titel"><input className={INPUT} value={c.titel} maxLength={80} onChange={(e) => wijzigCadeautje(i, { titel: e.target.value })} /></Veld>
                      <Veld label="Tekst" hint={`${c.tekst.length} van 1500 tekens`}>
                        <textarea className={INPUT} rows={4} value={c.tekst} maxLength={1500} onChange={(e) => wijzigCadeautje(i, { tekst: e.target.value })} />
                      </Veld>
                      <Veld label="Icoon" hint="Automatisch kiest een icoon dat bij je thema past.">
                        <div className="flex items-center gap-3">
                          <select className={INPUT} value={c.icoon} onChange={(e) => wijzigCadeautje(i, { icoon: e.target.value as Cadeautje['icoon'] })}>
                            <option value="">Automatisch (past bij het thema)</option>
                            {ICONEN.map((n) => <option key={n} value={n}>{ICOON_NAMEN[n]}</option>)}
                          </select>
                          <CadeauIcoon naam={icoon} className="h-8 w-8 shrink-0 text-emerald-800" />
                        </div>
                      </Veld>

                      <Veld label="Afbeelding (optioneel)" hint="Een link die met https:// begint, of upload een bestand.">
                        <input className={INPUT} value={c.afbeelding} placeholder="https://" onChange={(e) => wijzigCadeautje(i, { afbeelding: e.target.value.trim() })} />
                      </Veld>
                      <div className="flex flex-wrap gap-2">
                        <UploadKnop onUrl={(url) => wijzigCadeautje(i, { afbeelding: url })} />
                        {c.afbeelding && <button type="button" onClick={() => wijzigCadeautje(i, { afbeelding: '' })} className={KNOP}>Afbeelding weghalen</button>}
                      </div>

                      <fieldset className="space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-3">
                        <legend className="px-1 text-sm font-medium">Code (optioneel)</legend>
                        <label className="flex items-start gap-3 text-sm">
                          <input type="checkbox" checked={c.code.aan} onChange={(e) => wijzigCadeautje(i, { code: { ...c.code, aan: e.target.checked } })} className="mt-0.5 h-4 w-4" />
                          <span>Toon een code met een kopieerknop, bijvoorbeeld een kortingscode.</span>
                        </label>
                        {c.code.aan && (
                          <div className="grid gap-3 sm:grid-cols-2">
                            <Veld label="Code"><input className={`${INPUT} font-mono`} value={c.code.waarde} maxLength={60} onChange={(e) => wijzigCadeautje(i, { code: { ...c.code, waarde: e.target.value } })} placeholder="FEEST10" /></Veld>
                            <Veld label="Tekst boven de code" hint={`Leeg betekent: "${config.teksten.codeLabel || 'Jouw code'}".`}>
                              <input className={INPUT} value={c.code.label} maxLength={40} onChange={(e) => wijzigCadeautje(i, { code: { ...c.code, label: e.target.value } })} />
                            </Veld>
                          </div>
                        )}
                      </fieldset>

                      <fieldset className="space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-3">
                        <legend className="px-1 text-sm font-medium">Knop met link (optioneel)</legend>
                        <label className="flex items-start gap-3 text-sm">
                          <input type="checkbox" checked={c.knop.aan} onChange={(e) => wijzigCadeautje(i, { knop: { ...c.knop, aan: e.target.checked } })} className="mt-0.5 h-4 w-4" />
                          <span>Toon een knop onder de tekst, bijvoorbeeld naar je webshop, een agenda of een les.</span>
                        </label>
                        {c.knop.aan && (
                          <div className="grid gap-3 sm:grid-cols-2">
                            <Veld label="Link" hint="Moet met https:// beginnen.">
                              <input className={INPUT} value={c.knop.url} placeholder="https://" onChange={(e) => wijzigCadeautje(i, { knop: { ...c.knop, url: e.target.value.trim() } })} />
                            </Veld>
                            <Veld label="Tekst op de knop" hint={`Leeg betekent: "${config.knoppen.standaardLabel}".`}>
                              <input className={INPUT} value={c.knop.label} maxLength={40} onChange={(e) => wijzigCadeautje(i, { knop: { ...c.knop, label: e.target.value } })} />
                            </Veld>
                          </div>
                        )}
                      </fieldset>
                    </div>
                  </details>
                );
              })}
            </div>
          )}

          {tab === 'Opties en teksten' && (
            <div className="space-y-6">
              <fieldset className="space-y-3">
                <legend className="mb-1 text-sm font-medium">Wat gebeurt er op de pagina?</legend>
                {([
                  ['confetti', 'Confetti als een cadeautje opengaat'],
                  ['schudden', 'Dichte cadeautjes bewegen zachtjes, om uit te nodigen tot klikken'],
                  ['opnieuwSpelen', 'Knop "Opnieuw spelen" nadat de bezoeker heeft gekozen'],
                  ['restOnthullen', 'Laat na de keuze zien wat er in de andere cadeautjes zat (ze gaan dan ook open)'],
                  ['delen', 'Knop "Deel met anderen" om de pagina te delen (WhatsApp, e-mail en sociale media)'],
                ] as const).map(([naam, uitleg]) => (
                  <label key={naam} className="flex items-start gap-3 text-sm">
                    <input type="checkbox" checked={config.opties[naam]} onChange={(e) => zetOptie(naam, e.target.checked)} className="mt-0.5 h-4 w-4" />
                    <span>{uitleg}</span>
                  </label>
                ))}
              </fieldset>

              {config.opties.delen && (
                <div className="space-y-3">
                  <Veld label="Link bij het delen" hint="Laat leeg om te linken naar de pagina waar de bezoeker nu is. Staat de pagina ingesloten op een andere pagina, bijvoorbeeld op je website of in Kennis Shop? Vul dan het adres van die pagina in.">
                    <input className={INPUT} value={config.opties.delenUrl} onChange={(e) => zetOptie('delenUrl', e.target.value.trim())} placeholder="https://" />
                  </Veld>
                  <Veld label="Tekst bij het delen" hint="Laat leeg voor de standaardtekst. Typ {titel} voor de titel van je pagina. De link komt er vanzelf achter.">
                    <input className={INPUT} value={config.opties.delenTekst} maxLength={200} onChange={(e) => zetOptie('delenTekst', e.target.value)} placeholder={STANDAARD_DEELTEKST} />
                    <p className="mt-1 text-xs text-slate-500">Zo ziet het bericht eruit: {deelBericht(deelTekst(config.titel, config.opties.delenTekst), config.opties.delenUrl || 'https://jouwpagina.nl/')}</p>
                  </Veld>
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <Veld label="Decor" hint="Wat zweeft er zachtjes over de pagina? Een thema kiest een passend decor.">
                  <select className={INPUT} value={config.opties.decor} onChange={(e) => zetOptie('decor', e.target.value as Decor)}>
                    {DECORS.map((d) => <option key={d} value={d}>{DECOR_NAMEN[d]}</option>)}
                  </select>
                </Veld>
                <Veld label="Verpakking" hint="Zo ziet een dicht cadeautje eruit.">
                  <select className={INPUT} value={config.opties.verpakking} onChange={(e) => zetOptie('verpakking', e.target.value as Verpakking)}>
                    {VERPAKKINGEN.map((v) => <option key={v} value={v}>{VERPAKKING_NAMEN[v]}</option>)}
                  </select>
                </Veld>
              </div>

              <fieldset className="space-y-3 rounded-lg border border-slate-200 bg-white p-4">
                <legend className="px-1 text-sm font-medium">Knop in een cadeautje</legend>
                <Veld label="Standaard knoptekst" hint="Geldt voor elk cadeautje met een knop waar je geen eigen tekst voor invult.">
                  <input className={INPUT} value={config.knoppen.standaardLabel} maxLength={40} onChange={(e) => zetKnoppen({ standaardLabel: e.target.value })} />
                </Veld>
                <fieldset>
                  <legend className="text-sm font-medium">Waar opent de link?</legend>
                  <div className="mt-1 space-y-1 text-sm">
                    <label className="flex items-center gap-2"><input type="radio" name="openen" checked={config.knoppen.openen === 'nieuw'} onChange={() => zetKnoppen({ openen: 'nieuw' })} /> In een nieuw venster</label>
                    <label className="flex items-center gap-2"><input type="radio" name="openen" checked={config.knoppen.openen === 'zelfde'} onChange={() => zetKnoppen({ openen: 'zelfde' })} /> In hetzelfde venster (in een iframe verlaat de bezoeker dan je pagina)</label>
                  </div>
                </fieldset>
              </fieldset>

              <fieldset className="space-y-3 rounded-lg border border-slate-200 bg-white p-4">
                <legend className="px-1 text-sm font-medium">Teksten op de pagina</legend>
                <p className="text-xs text-slate-500">
                  Laat een vak leeg voor de standaardtekst. Typ {'{aantal}'} voor het aantal cadeautjes dat de bezoeker mag openen en {'{over}'} voor het aantal dat hij nog mag openen.
                </p>
                {([
                  ['kies', 'Regel boven de cadeautjes', 'Kies 1 cadeautje om te openen.'],
                  ['klaar', 'Regel als de bezoeker heeft gekozen', 'Je hebt gekozen. Veel plezier met je cadeautje!'],
                  ['opnieuw', 'Knop om opnieuw te beginnen', 'Opnieuw spelen'],
                  ['codeLabel', 'Tekst boven een code', 'Jouw code'],
                  ['kopieer', 'Knop om een code te kopiëren', 'Kopieer'],
                  ['gekopieerd', 'Tekst nadat de code is gekopieerd', 'Gekopieerd!'],
                  ['sluit', 'Knop om een cadeautje te sluiten', 'Sluiten'],
                ] as const).map(([naam, label, voorbeeld]) => (
                  <Veld key={naam} label={label}>
                    <input className={INPUT} value={config.teksten[naam]} maxLength={naam === 'klaar' ? 160 : naam === 'kies' ? 120 : 40} onChange={(e) => zetTekst(naam, e.target.value)} placeholder={voorbeeld} />
                  </Veld>
                ))}
              </fieldset>
            </div>
          )}

          {tab === 'Delen' && (
            <DelenTab
              config={config}
              gewijzigd={gewijzigd}
              voorbeeldCadeautjes={voorbeeldCadeautjes}
              voorbeeldTitel={voorbeeldTitel}
              naarTab={setTab}
            />
          )}

          {tab === 'Updates' && <UpdatesTab versie={versie} opVersie={setVersie} gewijzigd={gewijzigd} bezig={bezig} kanOpslaan={controle.ok} opOpslaan={() => void bewaar()} />}

          {tab === 'Importeren en exporteren' && (
            <div className="space-y-4">
              <div className="rounded-lg border border-slate-200 bg-white p-3 text-sm">
                <p className="font-semibold">Teksten laten schrijven door Claude</p>
                <ol className="ml-5 mt-1 list-decimal space-y-1 text-slate-700">
                  <li>Klik op &quot;Kopieer prompt&quot; en plak hem in claude.ai.</li>
                  <li>Vul de stukjes tussen [haakjes] in en laat Claude schrijven.</li>
                  <li>Kopieer het JSON-blok dat Claude teruggeeft en plak het hieronder.</li>
                  <li>Klik op &quot;Importeren&quot;, kijk in het voorbeeld en klik daarna op Opslaan.</li>
                </ol>
                <button type="button" onClick={() => kopieer(PROMPT_TEKSTEN, 'De prompt staat op je klembord. Plak hem nu in claude.ai.')} className={`${KNOP} mt-3`}>
                  Kopieer prompt
                </button>
              </div>

              <Veld label="JSON plakken of exporteren">
                <textarea
                  className={`${INPUT} font-mono`}
                  rows={12}
                  value={jsonTekst}
                  spellCheck={false}
                  onChange={(e) => setJsonTekst(e.target.value)}
                  placeholder='{ "titel": "...", "cadeautjes": [ ... ] }'
                />
              </Veld>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={importeer} disabled={!jsonTekst.trim()} className={KNOP_PRIMAIR}>Importeren</button>
                <button type="button" onClick={() => { setJsonTekst(JSON.stringify(config, null, 2)); setImportBericht(null); }} className={KNOP}>Toon huidige instellingen</button>
                <button type="button" onClick={() => kopieer(JSON.stringify(config, null, 2), 'De instellingen staan op je klembord.')} className={KNOP}>Kopieer huidige instellingen</button>
              </div>
              {importBericht && (
                <div
                  role={importBericht.soort === 'fout' ? 'alert' : 'status'}
                  className={`rounded-lg border p-3 text-sm ${importBericht.soort === 'ok' ? 'border-emerald-300 bg-emerald-50 text-emerald-900' : 'border-red-300 bg-red-50 text-red-900'}`}
                >
                  {importBericht.regels.slice(0, 8).map((r) => <p key={r}>{r}</p>)}
                </div>
              )}
              <details className="text-sm">
                <summary className="cursor-pointer font-medium">Bekijk de prompt</summary>
                <pre className="mt-2 whitespace-pre-wrap rounded-lg border border-slate-200 bg-white p-3 text-xs">{PROMPT_TEKSTEN}</pre>
              </details>
            </div>
          )}
          </div>
        </section>

        <aside className="lg:sticky lg:top-4 lg:self-start">
          <div className="mb-2 flex flex-wrap items-center gap-3 text-sm">
            <span className="font-medium">Voorbeeld:</span>
            <button type="button" onClick={() => setPreviewTeller((t) => t + 1)} className={KNOP}>Opnieuw beginnen</button>
            <label className="flex items-center gap-1.5">
              <input type="checkbox" checked={previewEmbed} onChange={(e) => setPreviewEmbed(e.target.checked)} />
              Zoals ingebed (Kennis Shop)
            </label>
          </div>
          <iframe
            ref={frame}
            key={`${previewSrc}-${previewTeller}`}
            src={previewSrc}
            title="Voorbeeld van je cadeautjespagina"
            className="h-[75vh] min-h-[480px] w-full rounded-xl border border-slate-300 bg-white"
          />
        </aside>
      </div>

      <p className="mt-8 text-center text-xs text-slate-400">Cadeautje-starter, versie {versie.huidig}</p>
    </div>
  );
}
