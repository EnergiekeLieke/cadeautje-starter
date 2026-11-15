import { LETTERTYPES, lettertypeVoor, type CadeautjeConfig, type CadeautjeKleuren } from '@/lib/config';

function hexNaarRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

function luminantie(hex: string): number {
  const [r, g, b] = hexNaarRgb(hex).map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrast(a: string, b: string): number {
  const la = luminantie(a);
  const lb = luminantie(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

/** Kiest uit de kandidaten de kleur die het best leesbaar is op de achtergrond. */
export function leesbaar(achtergrond: string, kandidaten: string[]): string {
  return kandidaten.reduce((beste, k) => (contrast(achtergrond, k) > contrast(achtergrond, beste) ? k : beste));
}

/** Tekstkleur per tegel: automatisch leesbaar, dus ook als iemand een eigen tegelkleur kiest. */
export function tegelKleuren(k: CadeautjeKleuren): { bg: string; tekst: string }[] {
  return k.tegels.map((bg) => ({ bg, tekst: leesbaar(bg, [k.licht, k.tekst, k.accent]) }));
}

export function confettiKleuren(k: CadeautjeKleuren): string[] {
  return [k.accent, '#f3dc8f', k.secundair, k.tegels[2], k.licht];
}

const rgb = (hex: string) => hexNaarRgb(hex).join(' ');

/** Mengt twee kleuren (aandeel 0 tot 1 van de tweede) en geeft een kant-en-klare CSS-kleur terug. */
export function meng(a: string, b: string, aandeel: number): string {
  const [ar, ag, ab] = hexNaarRgb(a);
  const [br, bg, bb] = hexNaarRgb(b);
  const m = (x: number, y: number) => Math.round(x + (y - x) * aandeel);
  return `rgb(${m(ar, br)} ${m(ag, bg)} ${m(ab, bb)})`;
}

/** Zoals `meng`, maar geeft een hex-kleur terug, zodat het resultaat opnieuw gemengd kan worden. */
function mengHex(a: string, b: string, aandeel: number): string {
  const [ar, ag, ab] = hexNaarRgb(a);
  const [br, bg, bb] = hexNaarRgb(b);
  const m = (x: number, y: number) => Math.round(x + (y - x) * aandeel).toString(16).padStart(2, '0');
  return `#${m(ar, br)}${m(ag, bg)}${m(ab, bb)}`;
}

// Een adres in een CSS-url(): aanhalingstekens en schuine strepen achterstevoren kunnen de url niet uit zijn vak laten breken
function cssUrl(adres: string): string {
  return `url("${adres.replace(/["\\\n\r]/g, (c) => encodeURIComponent(c))}")`;
}

// Een link telt pas als hij geldig is: tijdens het typen van een link (bijvoorbeeld 'h' of 'http:/') gebruiken we hem nog niet
export const isGeldigeAfbeeldingUrl = (v: string): boolean => /^https:\/\//i.test(v) || v.startsWith('/');

/** Heeft de pagina een eigen achtergrondafbeelding? Dan vervangt die de achtergrondkleur en de onderkant. */
export function heeftAchtergrondAfbeelding(opties: CadeautjeConfig['opties']): boolean {
  return isGeldigeAfbeeldingUrl(opties.achtergrondAfbeelding) || isGeldigeAfbeeldingUrl(opties.achtergrondAfbeeldingMobiel);
}

/** Heeft elk geopend cadeautje een eigen achtergrondafbeelding? */
export function heeftPopupAchtergrond(opties: CadeautjeConfig['opties']): boolean {
  return isGeldigeAfbeeldingUrl(opties.popupAchtergrond);
}

function achtergrondVariabelen(config: CadeautjeConfig): Record<string, string> {
  const { achtergrondAfbeelding: pc, achtergrondAfbeeldingMobiel: mob, achtergrondTekst, achtergrondLaag } = config.opties;
  if (!heeftAchtergrondAfbeelding(config.opties)) return {};
  return {
    ...(isGeldigeAfbeeldingUrl(pc) ? { '--cad-bg-pc': cssUrl(pc) } : {}),
    ...(isGeldigeAfbeeldingUrl(mob) ? { '--cad-bg-mob': cssUrl(mob) } : {}),
    '--cad-laag-kleur': achtergrondTekst === 'donker' ? '255 255 255' : '0 0 0',
    '--cad-laag': String(achtergrondLaag / 100),
  };
}

// Een eigen afbeelding achter de tekst in elk geopend cadeautje. Bij lichte tekst ligt er een donkere laag over, bij donkere tekst een lichte.
function popupVariabelen(config: CadeautjeConfig): Record<string, string> {
  const { popupAchtergrond, popupAchtergrondTekst, popupAchtergrondLaag } = config.opties;
  if (!heeftPopupAchtergrond(config.opties)) return {};
  return {
    '--cad-popup-bg': cssUrl(popupAchtergrond),
    // Terwijl de afbeelding laadt (of niet laadt) staat de tekst op een kleur die erbij past: lichte tekst op donker, donkere tekst op licht
    '--cad-popup-reserve': rgb(popupAchtergrondTekst === 'licht' ? config.kleuren.achtergrond : config.kleuren.licht),
    '--cad-popup-laag-kleur': popupAchtergrondTekst === 'licht' ? '0 0 0' : '255 255 255',
    '--cad-popup-laag': String(popupAchtergrondLaag / 100),
    '--cad-popup-tekst': rgb(config.kleuren.licht),
  };
}

/** CSS-variabelen die de pagina gebruikt (zie tailwind.config.ts en globals.css). */
export function cssVariabelen(config: CadeautjeConfig): Record<string, string> {
  const k = config.kleuren;
  const metAfbeelding = heeftAchtergrondAfbeelding(config.opties);
  // Met een eigen achtergrondafbeelding bepaalt de keuze licht of donker de tekstkleuren, want de kleur van de kaart zie je dan niet meer
  const lichteAchtergrond = metAfbeelding ? config.opties.achtergrondTekst === 'donker' : luminantie(k.achtergrond) > 0.5;
  return {
    ...achtergrondVariabelen(config),
    ...popupVariabelen(config),
    // Met een afbeelding is dit de kleur terwijl de afbeelding laadt (of niet laadt): passend bij de gekozen tekstkleur, anders is de tekst niet te lezen
    '--cad-nacht': rgb(metAfbeelding && config.opties.achtergrondTekst === 'donker' ? k.licht : k.achtergrond),
    '--cad-goud': rgb(k.accent),
    '--cad-goud-donker': meng(k.accent, '#000000', lichteAchtergrond ? 0.4 : 0.25),
    '--cad-goud-licht': lichteAchtergrond ? meng(k.accent, '#000000', 0.12) : meng(k.accent, '#ffffff', 0.45),
    // Binnenkant van een geopend cadeautje: van licht in het midden naar de accentkleur aan de rand (zachter bij een lichte achtergrond)
    '--cad-binnen-1': meng(k.accent, '#ffffff', lichteAchtergrond ? 0.88 : 0.75),
    '--cad-binnen-2': meng(k.accent, '#ffffff', lichteAchtergrond ? 0.62 : 0.38),
    '--cad-binnen-3': meng(k.accent, '#ffffff', lichteAchtergrond ? 0.35 : 0),
    '--cad-licht': rgb(k.licht),
    '--cad-primair': rgb(k.primair),
    '--cad-secundair': rgb(k.secundair),
    '--cad-inkt': rgb(k.tekst),
    '--cad-opach': metAfbeelding ? rgb(config.opties.achtergrondTekst === 'donker' ? k.tekst : k.licht) : rgb(leesbaar(k.achtergrond, [k.licht, k.tekst])),
    '--cad-oppri': rgb(leesbaar(k.primair, [k.licht, k.tekst])),
    '--cad-opsec': rgb(leesbaar(k.secundair, [k.licht, k.tekst])),
    '--cad-titel-schaal': String(config.titelGrootte / 100),
    '--cad-font-titel': LETTERTYPES[lettertypeVoor(config, 'titel')].stack,
    '--cad-font-onder': LETTERTYPES[lettertypeVoor(config, 'ondertitel')].stack,
    '--cad-font-cadeau': LETTERTYPES[lettertypeVoor(config, 'cadeautjes')].stack,
    '--cad-font-popkop': LETTERTYPES[lettertypeVoor(config, 'popupKop')].stack,
    '--cad-font-poptekst': LETTERTYPES[lettertypeVoor(config, 'popupTekst')].stack,
  };
}

