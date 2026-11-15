// De knop "Deel met anderen": de tekst, de links naar WhatsApp, e-mail en sociale media, en het kopiëren naar het klembord.

export const STANDAARD_DEELTEKST = 'Kijk eens bij "{titel}" en kies een cadeautje om te openen:';

/** De tekst die bij de link komt. Leeg betekent: de standaardtekst. {titel} wordt de titel van de pagina. */
export function deelTekst(titel: string, sjabloon: string): string {
  const basis = sjabloon.trim() || STANDAARD_DEELTEKST;
  return basis.replace(/\{titel\}/gi, () => titel.trim() || 'cadeautjes');
}

/** Tekst en link samen, zoals het op het klembord en in WhatsApp komt. */
export function deelBericht(tekst: string, link: string): string {
  return `${tekst} ${link}`;
}

export interface DeelLinks {
  whatsapp: string;
  mail: string;
  facebook: string;
  linkedin: string;
}

/** De links om de pagina te delen. Alles wordt gecodeerd, dus aanhalingstekens, & en emoji in de tekst breken niets. */
export function deelLinks(titel: string, tekst: string, link: string): DeelLinks {
  const enc = encodeURIComponent;
  return {
    whatsapp: `https://wa.me/?text=${enc(deelBericht(tekst, link))}`,
    mail: `mailto:?subject=${enc(titel.trim() || 'Cadeautjes')}&body=${enc(`${tekst}\n\n${link}`)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${enc(link)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(link)}`,
  };
}

/**
 * Zet tekst op het klembord. In een iframe op een ander adres is de moderne methode vaak geblokkeerd, tenzij de embedcode
 * clipboard-write toestaat. Dan valt dit terug op de oudere methode, die in een klik altijd werkt.
 * Die methode heeft even een tekstveld nodig. Dat zetten we in `houder` (bijvoorbeeld het menu waar de klik vandaan komt), zodat het
 * menu niet denkt dat de focus het verlaat, en daarna zetten we de focus terug.
 */
export async function kopieerNaarKlembord(tekst: string, houder: HTMLElement = document.body): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(tekst);
    return true;
  } catch {
    // Doorgaan met de oudere methode
  }
  const veld = document.createElement('textarea');
  veld.value = tekst;
  veld.setAttribute('readonly', '');
  veld.style.cssText = 'position:fixed;top:0;left:0;opacity:0;pointer-events:none';
  const eerder = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  houder.appendChild(veld);
  veld.select();
  veld.setSelectionRange(0, tekst.length);
  let gelukt = false;
  try {
    gelukt = document.execCommand('copy');
  } catch {
    gelukt = false;
  }
  houder.removeChild(veld);
  eerder?.focus({ preventScroll: true });
  return gelukt;
}
