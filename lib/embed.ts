import type { Sfeer } from '@/lib/config';

// Afmetingen van de pagina: hoeveel cadeautjes staan er naast elkaar, en hoe hoog wordt het geheel?
// De kolommen horen bij de breedte-klassen in components/Cadeautjes.tsx (BREEDTE). Pas je het ene aan, pas dan ook het andere aan.
// De vaste hoogtes hieronder zijn gemeten in de echte pagina (headless browser, 1 tot 10 cadeautjes, 360 tot 900 px breed)
// en nooit te laag bevonden. Verander je de opmaak van de kaart (marges, kop, tussenruimte), meet ze dan opnieuw.

const KOLOMMEN_TELEFOON: Record<number, number> = { 1: 2, 2: 2, 3: 3, 4: 2, 5: 3, 6: 3, 7: 3, 8: 3, 9: 3, 10: 3 };
const KOLOMMEN_BREED: Record<number, number> = { 1: 3, 2: 3, 3: 3, 4: 4, 5: 5, 6: 3, 7: 4, 8: 4, 9: 3, 10: 5 };

const MAX_KAARTBREEDTE = 896; // de kaart is nooit breder dan max-w-4xl
const GAT_X = 12; // tussenruimte naast elkaar (gap-x-3)
const GAT_Y = 20; // tussenruimte onder elkaar (gap-y-5)
const EMBED_RAND = 16; // ingebed staat er 8 px (p-2) om de kaart heen

const begrens = (aantal: number) => Math.max(1, Math.min(10, Math.round(Number.isFinite(aantal) ? aantal : 5)));

/** Hoeveel cadeautjes staan er naast elkaar, op een telefoon (smal) of op een breder scherm (vanaf 640 px)? */
export function kolommenVoor(aantal: number, breed: boolean): number {
  const n = begrens(aantal);
  return (breed ? KOLOMMEN_BREED : KOLOMMEN_TELEFOON)[n];
}

// Hoogte van de titel: het aantal regels (geschat uit de lengte, een letter is gemiddeld 0,55 keer zo breed als het lettertype hoog) maal de regelhoogte
function titelHoogte(titel: string, schaal: number, beschikbaar: number, breed: boolean): number {
  const lettergrootte = (breed ? 48 : 30) * schaal;
  const perRegel = Math.max(1, Math.floor(beschikbaar / (lettergrootte * 0.55)));
  const regels = Math.max(1, Math.ceil(titel.length / perRegel));
  return regels * lettergrootte * 1.25;
}

/**
 * De hoogte van de kaart zelf (zonder rand eromheen) voor een kaart van deze breedte.
 * Opgebouwd uit: een vast stuk voor ondertitel, instructie, voettekst en marges (gemeten, zonder titel), de titel (geschat),
 * de rijen met cadeautjes, en de illustratie (bovenaan vlaggetjes, onderaan een landschap).
 */
function kaartHoogte(aantal: number, kaartBreedte: number, titel: string, titelGrootte: number, sfeer: Sfeer, metDelen: boolean): number {
  const breed = kaartBreedte >= 624; // vanaf een venster van 640 px: de sm-stand van Tailwind
  const marges = breed ? 80 : 24;
  const k = kolommenVoor(aantal, breed);
  const tegel = (kaartBreedte - marges - (k - 1) * GAT_X) / k;
  const rijen = Math.ceil(begrens(aantal) / k);

  // Gemeten: ondertitel en instructie lopen op een smalle telefoon over twee regels
  const vast = breed ? 290 : kaartBreedte < 384 ? 329 : 276;
  // Illustratie: vlaggetjes vragen extra ruimte bovenaan, de landschappen onderaan
  const boven = sfeer === 'vlaggetjes' ? (breed ? 56 : 24) : 0;
  const onder = sfeer !== 'geen' && sfeer !== 'vlaggetjes' ? (breed ? 104 : 72) : 0;
  // Op een smal scherm staat de knop om te delen op een eigen regel
  const delen = metDelen ? (breed ? 0 : 44) : 0;

  const titelH = titelHoogte(titel, titelGrootte / 100, kaartBreedte - marges, breed);
  return vast + titelH + rijen * tegel + (rijen - 1) * GAT_Y + boven + onder + delen;
}

export interface Maat {
  breedte: number;
  hoogte: number;
}

const afronden = (n: number) => Math.round(n / 10) * 10;

// Eigen achtergrondafbeelding: welke maat past bij jouw pagina? De kaart is 896 px breed op een computer en ongeveer 374 px op een telefoon.
// De afbeelding wordt bijgesneden zodat hij de kaart helemaal vult. We rekenen twee keer zo groot, zodat hij ook op een scherm met veel pixels scherp blijft.
// Met een achtergrondafbeelding staat de illustratie langs de rand uit, dus die telt hier niet mee.
export function achtergrondMaten(aantalCadeautjes: number, titel = '', titelGrootte = 100): { computer: Maat; telefoon: Maat } {
  return {
    computer: { breedte: 2 * MAX_KAARTBREEDTE, hoogte: afronden(2 * kaartHoogte(aantalCadeautjes, MAX_KAARTBREEDTE, titel, titelGrootte, 'geen', false)) },
    telefoon: { breedte: 780, hoogte: afronden(2 * kaartHoogte(aantalCadeautjes, 374, titel, titelGrootte, 'geen', false)) },
  };
}

// Het geopende cadeautje (de popup) is 448 px breed op een computer en op een telefoon ongeveer 330 tot 360 px. De hoogte volgt de inhoud.
export const POPUP_ACHTERGROND_MAAT: Maat = { breedte: 896, hoogte: 1000 };

/**
 * Advies voor de hoogte van het iframe (in pixels), voor een iframe van ongeveer deze breedte.
 * Is het iframe te laag, dan scrolt de pagina in het iframe. Is het te hoog, dan blijft er lege ruimte onder de kaart.
 */
export function adviesIframeHoogte(aantalCadeautjes: number, breedte = 600, titel = '', titelGrootte = 100, metDelen = false, sfeer: Sfeer = 'geen'): number {
  const w = Math.max(280, Math.min(1400, Math.round(Number.isFinite(breedte) ? breedte : 600)));
  const kaart = Math.min(w - EMBED_RAND, MAX_KAARTBREEDTE);
  const hoogte = kaartHoogte(aantalCadeautjes, kaart, titel, titelGrootte, sfeer, metDelen) + EMBED_RAND;
  // Een marge voor verschillen in lettertype en een lange ondertitel, afgerond op 50
  return Math.ceil((hoogte + 40) / 50) * 50;
}
