import type { CadeautjeConfig } from '@/lib/config';

// Een persoonlijke begroeting: de bezoeker komt met ?voornaam=Lieke op de pagina (bijvoorbeeld via een link in een mail),
// en overal waar de beheerder {voornaam} schrijft, komt die naam te staan.
// De opgeslagen teksten blijven ongewijzigd: we vullen de naam alleen in bij het tonen.

const MAX_LENGTE = 40;
// Een ongevulde placeholder (%FIRSTNAME%, {{naam}}, [naam]) of HTML is nooit een naam
const ONGELDIG = /[%{}[\]<>]/;

/** Maakt van de waarde uit de link een nette voornaam, of een lege tekst als het geen echte naam is. */
export function schoneVoornaam(waarde: string | string[] | undefined | null): string {
  const eerste = Array.isArray(waarde) ? waarde[0] : waarde;
  const naam = (eerste ?? '').trim().slice(0, MAX_LENGTE);
  if (!naam || ONGELDIG.test(naam)) return '';
  return naam.charAt(0).toUpperCase() + naam.slice(1);
}

const PLAATSHOUDER = /\{voornaam\}/i;

/**
 * Vult {voornaam} in. Is er geen naam, dan verdwijnt de plaatshouder samen met het spatietje ervoor,
 * zodat "Hey {voornaam}!" gewoon "Hey!" wordt en nooit "Hey !".
 */
export function vulVoornaamIn(tekst: string, voornaam: string): string {
  if (!PLAATSHOUDER.test(tekst)) return tekst;
  if (voornaam) return tekst.replace(/\{voornaam\}/gi, voornaam);
  return tekst
    .replace(/\s*\{voornaam\}/gi, '')
    // "{voornaam}, welkom" wordt anders ", welkom"
    .replace(/^[\s,;:]+/, '');
}

/**
 * Geeft een kopie van de instellingen waarin {voornaam} is ingevuld, in alle teksten die een bezoeker leest.
 * Links, codes en afbeeldingen blijven zoals ze zijn. Staat er nergens {voornaam}, dan krijg je dezelfde instellingen terug.
 */
export function metVoornaam(config: CadeautjeConfig, voornaam: string): CadeautjeConfig {
  if (!PLAATSHOUDER.test(JSON.stringify(config))) return config;
  const v = (t: string) => vulVoornaamIn(t, voornaam);
  const teksten = Object.fromEntries(
    Object.entries(config.teksten).map(([sleutel, waarde]) => [sleutel, typeof waarde === 'string' ? v(waarde) : waarde]),
  ) as CadeautjeConfig['teksten'];
  return {
    ...config,
    titel: v(config.titel),
    ondertitel: v(config.ondertitel),
    footer: v(config.footer),
    teksten,
    knoppen: { ...config.knoppen, standaardLabel: v(config.knoppen.standaardLabel) },
    opties: { ...config.opties, delenTekst: v(config.opties.delenTekst) },
    cadeautjes: config.cadeautjes.map((c) => ({
      ...c,
      titel: v(c.titel),
      tekst: v(c.tekst),
      knop: { ...c.knop, label: v(c.knop.label) },
      code: { ...c.code, label: v(c.code.label) },
    })),
  };
}
