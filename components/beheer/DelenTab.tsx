'use client';

import { useEffect, useState } from 'react';
import type { CadeautjeConfig } from '@/lib/config';
import { INPUT, KNOP, Veld, type Bericht } from '@/components/beheer/velden';
import { adviesIframeHoogte } from '@/lib/embed';
import { heeftAchtergrondAfbeelding } from '@/lib/kleur';

interface Props {
  config: CadeautjeConfig;
  /** Zijn er wijzigingen die nog niet zijn opgeslagen? */
  gewijzigd: boolean;
  /** Nummers van cadeautjes die nog de voorbeeldtekst hebben */
  voorbeeldCadeautjes: number[];
  /** Heet de pagina nog zoals in het voorbeeld? */
  voorbeeldTitel: boolean;
  naarTab: (tab: 'Cadeautjes' | 'Algemeen') => void;
}

export default function DelenTab({ config, gewijzigd, voorbeeldCadeautjes, voorbeeldTitel, naarTab }: Props) {
  const [origin, setOrigin] = useState('');
  const [hoogteInvoer, setHoogteInvoer] = useState<number | null>(null);
  // In Kennis Shop is het iframe meestal 450 tot 600 px breed (op een telefoon smaller)
  const [breedte, setBreedte] = useState(600);
  const [bericht, setBericht] = useState<Bericht>(null);
  useEffect(() => setOrigin(window.location.origin), []);

  // De pagina is hoger naarmate er meer cadeautjes zijn en naarmate het iframe breder is
  // Met een eigen achtergrondafbeelding staat de illustratie langs de rand uit
  const sfeer = heeftAchtergrondAfbeelding(config.opties) ? 'geen' : config.opties.sfeer;
  const advies = adviesIframeHoogte(config.aantalCadeautjes, breedte, config.titel, config.titelGrootte, config.opties.delen, sfeer);
  const hoogte = hoogteInvoer ?? advies;
  const link = `${origin}/`;
  const titel = config.titel.replace(/"/g, '&quot;');
  const embedcode = `<iframe src="${origin}/?embed=true" width="100%" height="${hoogte}" frameborder="0" allow="web-share; clipboard-write" title="${titel}"></iframe>`;

  async function kopieer(tekst: string, melding: string) {
    try {
      await navigator.clipboard.writeText(tekst);
      setBericht({ soort: 'ok', regels: [melding] });
    } catch {
      setBericht({ soort: 'fout', regels: ['Kopiëren lukt niet in deze browser. Selecteer de tekst en kopieer hem zelf.'] });
    }
  }

  const aandachtspunten: { tekst: string; actie: { label: string; tab: 'Cadeautjes' | 'Algemeen' } }[] = [];
  if (voorbeeldCadeautjes.length > 0) {
    aandachtspunten.push({
      tekst: `${voorbeeldCadeautjes.length} ${voorbeeldCadeautjes.length === 1 ? 'cadeautje heeft' : 'cadeautjes hebben'} nog de voorbeeldtekst (${voorbeeldCadeautjes.join(', ')}).`,
      actie: { label: 'Naar de cadeautjes', tab: 'Cadeautjes' },
    });
  }
  if (voorbeeldTitel) {
    aandachtspunten.push({ tekst: `De titel is nog de voorbeeldtitel.`, actie: { label: 'Titel aanpassen', tab: 'Algemeen' } });
  }

  return (
    <div className="space-y-6">
      {gewijzigd && (
        <p role="status" className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
          Je hebt wijzigingen die nog niet zijn opgeslagen. Klik eerst op Opslaan, anders zien je klanten ze niet.
        </p>
      )}

      <section className="space-y-2 rounded-lg border border-slate-200 bg-white p-4">
        <h2 className="text-sm font-semibold">Voor je het deelt</h2>
        {aandachtspunten.length === 0 ? (
          <p className="text-sm text-emerald-800">Alles ziet er goed uit. Je kunt de pagina delen.</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {aandachtspunten.map((a) => (
              <li key={a.tekst} className="flex flex-wrap items-center gap-2 text-amber-900">
                <span className="flex-1">{a.tekst}</span>
                <button type="button" onClick={() => naarTab(a.actie.tab)} className={KNOP}>{a.actie.label}</button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-2 rounded-lg border border-slate-200 bg-white p-4">
        <h2 className="text-sm font-semibold">Link naar je pagina</h2>
        <input className={`${INPUT} font-mono`} readOnly value={link} onFocus={(e) => e.currentTarget.select()} aria-label="Link naar je pagina" />
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => kopieer(link, 'De link staat op je klembord.')} className={KNOP}>Kopieer link</button>
          <a href="/" target="_blank" rel="noopener noreferrer" className={`${KNOP} inline-block`}>Open de pagina</a>
        </div>
        <p className="text-xs text-slate-500">
          Een bezoeker onthoudt in zijn eigen browser welk cadeautje hij heeft gekozen. Op een andere telefoon of in een ander venster mag hij dus opnieuw kiezen.
          Er wordt niets over je bezoekers opgeslagen.
        </p>
      </section>

      <section className="space-y-3 rounded-lg border border-slate-200 bg-white p-4">
        <h2 className="text-sm font-semibold">Insluiten op je website of in Kennis Shop</h2>
        <p className="text-xs text-slate-600">
          Plak de embedcode in een html-blok. Is het iframe te laag, dan moet je klant in het iframe scrollen.
          Is het te hoog, dan blijft er lege ruimte onder de pagina. Vul hieronder in hoe breed je iframe ongeveer is, dan reken ik de hoogte uit.
        </p>
        <Veld label="Breedte van je iframe in pixels" hint="Meestal 450 tot 600. Is de kolom waarin je pagina staat breder, vul dan die breedte in.">
          <input
            type="number"
            min={280}
            max={1400}
            className={INPUT}
            value={breedte}
            onChange={(e) => { setBreedte(Math.round(Number(e.target.value))); setHoogteInvoer(null); }}
          />
        </Veld>
        <Veld
          label="Hoogte van het iframe in pixels"
          hint={`Advies voor jouw ${config.aantalCadeautjes} ${config.aantalCadeautjes === 1 ? 'cadeautje' : 'cadeautjes'} bij een iframe van ${breedte} px breed: ${advies} px.`}
        >
          <input
            type="number"
            min={200}
            className={INPUT}
            value={hoogte}
            onChange={(e) => setHoogteInvoer(Math.round(Number(e.target.value)))}
          />
        </Veld>
        <textarea className={`${INPUT} font-mono`} readOnly rows={4} value={embedcode} onFocus={(e) => e.currentTarget.select()} aria-label="Embedcode" />
        <button type="button" onClick={() => kopieer(embedcode, 'De embedcode staat op je klembord.')} className={KNOP}>Kopieer embedcode</button>
        {bericht && (
          <p role={bericht.soort === 'fout' ? 'alert' : 'status'} className={`text-sm ${bericht.soort === 'ok' ? 'text-emerald-800' : 'text-red-800'}`}>
            {bericht.regels.join(' ')}
          </p>
        )}
      </section>
    </div>
  );
}

