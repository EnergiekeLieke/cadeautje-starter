// Afmetingen van de pagina: hoeveel cadeautjes staan er naast elkaar, en hoe hoog wordt het geheel?
// De kolommen horen bij de breedte-klassen in components/Cadeautjes.tsx (BREEDTE). Pas je het ene aan, pas dan ook het andere aan.

const KOLOMMEN_TELEFOON: Record<number, number> = { 1: 2, 2: 2, 3: 3, 4: 2, 5: 3, 6: 3, 7: 3, 8: 3, 9: 3, 10: 3 };
const KOLOMMEN_BREED: Record<number, number> = { 1: 3, 2: 3, 3: 3, 4: 4, 5: 5, 6: 3, 7: 4, 8: 4, 9: 3, 10: 5 };

const MAX_KAARTBREEDTE = 896; // de kaart is nooit breder dan max-w-4xl
const GAT = 12; // vaste tussenruimte tussen cadeautjes (gap-3)

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

export interface Maat {
  breedte: number;
  hoogte: number;
}

// Eigen achtergrondafbeelding: welke maat past bij jouw pagina? De kaart is 896 px breed op een computer en ongeveer 374 px op een telefoon.
// De afbeelding wordt bijgesneden zodat hij de kaart helemaal vult. We rekenen twee keer zo groot, zodat hij ook op een scherm met veel pixels scherp blijft.
function kaartHoogte(aantal: number, breed: boolean): number {
  const kaart = breed ? MAX_KAARTBREEDTE : 374;
  const marges = breed ? 80 : 24;
  const k = kolommenVoor(aantal, breed);
  const tegel = (kaart - marges - (k - 1) * GAT) / k;
  const rijen = Math.ceil(begrens(aantal) / k);
  return (breed ? 300 : 320) + rijen * (tegel + GAT);
}

const afronden = (n: number) => Math.round(n / 10) * 10;

export function achtergrondMaten(aantalCadeautjes: number): { computer: Maat; telefoon: Maat } {
  return {
    computer: { breedte: 1792, hoogte: afronden(2 * kaartHoogte(aantalCadeautjes, true)) },
    telefoon: { breedte: 780, hoogte: afronden(2 * kaartHoogte(aantalCadeautjes, false)) },
  };
}

// Het geopende cadeautje (de popup) is 448 px breed op een computer en op een telefoon ongeveer 330 tot 360 px. De hoogte volgt de inhoud.
export const POPUP_ACHTERGROND_MAAT: Maat = { breedte: 896, hoogte: 1000 };

/**
 * Advies voor de hoogte van het iframe (in pixels), voor een iframe van ongeveer deze breedte.
 * Is het iframe te laag, dan scrolt de pagina in het iframe. Is het te hoog, dan blijft er lege ruimte onder de kaart.
 */
export function adviesIframeHoogte(aantalCadeautjes: number, breedte = 600, titel = '', titelGrootte = 100, metDelen = false): number {
  const w = Math.max(280, Math.min(1400, Math.round(Number.isFinite(breedte) ? breedte : 600)));
  const breed = w >= 640; // vanaf 640 px krijgt de pagina grotere marges (de sm-stand van Tailwind)
  const kaart = Math.min(w - 16, MAX_KAARTBREEDTE);
  const marges = breed ? 80 : 24;
  const k = kolommenVoor(aantalCadeautjes, breed);
  const tegel = (kaart - marges - (k - 1) * GAT) / k;
  const rijen = Math.ceil(begrens(aantalCadeautjes) / k);

  const kopEnVoet = w < 400 ? 360 : breed ? 380 : 350;
  const hoogte = kopEnVoet + rijen * tegel + (rijen - 1) * GAT;

  // Op een smal scherm staat de knop om te delen op een eigen regel onder de andere tekst
  const delenHoogte = metDelen ? 44 : 0;

  // Een grotere of kleinere titel past op meer of minder regels en is zelf hoger. We schatten het verschil met de standaardgrootte.
  const titelVerschil = titelGrootte === 100 ? 0 : titelHoogte(titel, titelGrootte / 100, kaart - marges, breed) - titelHoogte(titel, 1, kaart - marges, breed);

  // Ruimte voor een lange titel op twee regels, de resetknop en verschillen in lettertype, afgerond op 50
  return Math.ceil((hoogte + delenHoogte + titelVerschil + 90) / 50) * 50;
}
