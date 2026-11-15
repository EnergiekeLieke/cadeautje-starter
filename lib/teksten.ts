import type { CadeautjeConfig } from '@/lib/config';

// De vaste teksten op de pagina. Heeft de beheerder een eigen tekst ingevuld (config.teksten), dan gaat die voor.
// In een eigen tekst worden {aantal} (hoeveel cadeautjes je mag openen) en {over} (hoeveel je er nog mag) ingevuld.

function vul(sjabloon: string, aantal: number, over: number): string {
  return sjabloon.replace(/\{aantal\}/gi, String(aantal)).replace(/\{over\}/gi, String(over));
}

/** De regel boven de cadeautjes: wat mag de bezoeker nog doen? */
export function kiesTekst(config: CadeautjeConfig, geopend: number): string {
  const aantal = config.aantalKiezen;
  const over = Math.max(0, aantal - geopend);
  if (over === 0) return klaarTekst(config);
  if (config.teksten.kies) return vul(config.teksten.kies, aantal, over);
  // Is er maar een cadeautje, dan valt er niets te kiezen: de bezoeker mag het gewoon openen
  if (config.aantalCadeautjes === 1) return 'Open hieronder je cadeau.';
  if (geopend === 0) return aantal === 1 ? 'Kies 1 cadeautje om te openen.' : `Kies er ${aantal} om te openen.`;
  return over === 1 ? 'Je mag nog 1 cadeautje openen.' : `Je mag nog ${over} cadeautjes openen.`;
}

/** De regel als de bezoeker alles heeft gekozen */
export function klaarTekst(config: CadeautjeConfig): string {
  const aantal = config.aantalKiezen;
  return config.teksten.klaar
    ? vul(config.teksten.klaar, aantal, 0)
    : config.aantalCadeautjes === 1 ? 'Veel plezier met je cadeau!' : 'Je hebt gekozen. Veel plezier met je cadeautje!';
}

export const knopTeksten = (config: CadeautjeConfig) => ({
  opnieuw: config.teksten.opnieuw || 'Opnieuw spelen',
  codeLabel: config.teksten.codeLabel || 'Jouw code',
  kopieer: config.teksten.kopieer || 'Kopieer',
  gekopieerd: config.teksten.gekopieerd || 'Gekopieerd!',
  sluit: config.teksten.sluit || 'Sluiten',
});
