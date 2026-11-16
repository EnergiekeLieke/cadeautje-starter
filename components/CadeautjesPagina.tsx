'use client';

import { useEffect, useState } from 'react';
import Cadeautjes from '@/components/Cadeautjes';
import { leesConfig, type CadeautjeConfig } from '@/lib/config';

// Berichten tussen de editor (/beheer) en het voorbeeld in de iframe
export const BERICHT_CONFIG = 'cadeautje-config';
export const BERICHT_KLAAR = 'cadeautje-klaar';
export const BERICHT_MARKEER = 'cadeautje-markeer';

interface Props {
  config: CadeautjeConfig;
  /** Ingebed in een iframe: doorzichtige achtergrond en weinig marge */
  embed: boolean;
  /** Voorbeeldmodus: ontvangt live instellingen van de editor in plaats van de opgeslagen versie */
  preview: boolean;
  /** De voornaam uit de link (?voornaam=), al schoongemaakt */
  voornaam?: string;
}

export default function CadeautjesPagina({ config, embed, preview, voornaam = '' }: Props) {
  const [actueel, setActueel] = useState(config);
  const [markeer, setMarkeer] = useState<string | null>(null);

  useEffect(() => {
    setActueel(config);
  }, [config]);

  useEffect(() => {
    if (!preview) return;
    const opBericht = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return;
      if (e.data?.type === BERICHT_MARKEER) {
        setMarkeer(typeof e.data.kleur === 'string' ? e.data.kleur : null);
        return;
      }
      if (e.data?.type !== BERICHT_CONFIG) return;
      const uitkomst = leesConfig(e.data.config);
      if (uitkomst.ok) setActueel(uitkomst.config);
    };
    window.addEventListener('message', opBericht);
    window.parent.postMessage({ type: BERICHT_KLAAR }, window.location.origin);
    return () => window.removeEventListener('message', opBericht);
  }, [preview]);

  return <Cadeautjes config={actueel} embed={embed} preview={preview} markeer={markeer} voornaam={voornaam} />;
}
