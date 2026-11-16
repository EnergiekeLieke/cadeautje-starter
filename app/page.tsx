import CadeautjesPagina from '@/components/CadeautjesPagina';
import { isIngelogd } from '@/lib/beheerAuth';
import { laadConfig } from '@/lib/configLaden';
import { schoneVoornaam } from '@/lib/voornaam';

type Params = Record<string, string | string[] | undefined>;
const eerste = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export default async function Page({ searchParams }: { searchParams: Promise<Params> }) {
  const params = await searchParams;
  const config = await laadConfig();
  const embed = eerste(params.embed);
  // ?preview=1: het voorbeeld binnen de editor. Alleen voor een ingelogde beheerder.
  const preview = (await isIngelogd()) && eerste(params.preview) === '1';

  // ?voornaam=Lieke: overal waar {voornaam} in je teksten staat, komt die naam. In het voorbeeld van de editor zie je "Voornaam", zodat je ziet waar hij komt.
  const voornaam = schoneVoornaam(params.voornaam) || (preview ? 'Voornaam' : '');

  return (
    <CadeautjesPagina
      config={config}
      voornaam={voornaam}
      // ?embed=true: dezelfde pagina voor in een iframe (bijv. in Kennis Shop), met een doorzichtige achtergrond
      embed={embed === 'true' || embed === '1'}
      preview={preview}
    />
  );
}
