# CLAUDE.md

Deze map is een cadeautjespagina-starter voor ondernemers (een zusje van advent-starter). Next.js 16 (App Router), React 19, TypeScript en Tailwind 3. Geen database: instellingen staan in Vercel Blob.

## Commands

```bash
npm install
npm run dev        # localhost:3000, beheer op /beheer
npm run build      # productiebuild
npm run typecheck  # tsc --noEmit
```

Omgevingsvariabelen (zie `.env.example`):
- `BEHEER_WACHTWOORD`: wachtwoord voor `/beheer`
- `BLOB_READ_WRITE_TOKEN`: wordt door Vercel gezet zodra een Blob-opslag (public) is gekoppeld

## Hoe het werkt

De ondernemer past alles aan via `/beheer`. Meestal is er dus geen code nodig.

- `config/cadeautje.json`: standaardinstellingen (thema Verjaardag, 5 voorbeeldcadeautjes). Geldt zolang er niets is opgeslagen.
- `lib/config.ts`: het zod-schema, de thema's (`THEMAS`), decors, verpakkingen, iconen en lettertypes. Een nieuwe instelling begint hier. `cadeautjesVoor()` vult de lijst altijd aan tot `aantalCadeautjes`, `icoonVoor()` kiest het icoon. `aantalKiezen` wordt in het schema begrensd op `aantalCadeautjes`.
- `lib/teksten.ts`: standaardteksten op de pagina, met `{aantal}` en `{over}` in eigen teksten (`config.teksten`).
- `lib/opslag.ts`, `lib/blobKeuze.ts`, `lib/configLaden.ts`: bewaren en lezen. Blob in productie (naam met willekeurig stuk, `cadeautje/config-xxxx.json`), een lokaal bestand tijdens `npm run dev`. Val nooit stilzwijgend terug op de voorbeeldtekst als er Blob is gekoppeld, want de editor kan die dan over de echte teksten heen opslaan.
- `components/Cadeautjes.tsx`: de pagina zelf (cadeautjes, popup, opent-status). `components/CadeautjesPagina.tsx` is de wrapper die in het voorbeeld de live instellingen van de editor ontvangt via postMessage (`cadeautje-config`).
- `components/CadeauIcoon.tsx`: de iconen. `components/Cadeaudoos.tsx`: de getekende doos (papier, lint, strik, deksel). `components/Sfeer.tsx`: de illustratie langs de rand van de kaart. `components/Decor.tsx`: zwevend decor.
- `components/beheer/Editor.tsx`: de beheerpagina met live voorbeeld. `DelenTab.tsx`, `UpdatesTab.tsx` en `velden.tsx` horen erbij.
- `app/globals.css`: animaties en stijlen (`.cad-*`).
- `lib/embed.ts`: kolommen per aantal en het advies voor de iframe-hoogte. De kolommen horen bij `BREEDTE` in `Cadeautjes.tsx`: pas je het ene aan, pas dan ook het andere aan. De vaste hoogtes zijn gemeten in de echte pagina (1 tot 10 cadeautjes, 360 tot 900 px): verander je marges, kop of tussenruimte, meet ze dan opnieuw.

### Opent-status

Welke cadeautjes een bezoeker heeft geopend staat alleen in de browser (`localStorage`, sleutel `cadeautje:<vingerafdruk>`). De vingerafdruk komt uit titel, aantallen en inhoud, dus een wijziging in de config reset de status. Alle lees- en schrijfacties staan in try/catch: zonder opslag werkt de pagina gewoon. In het voorbeeld (`preview`) wordt niets bewaard. De inhoud van alle cadeautjes staat bewust in de paginabron (er is geen server-gating zoals bij advent).

### Kleuren

Kleuren komen uit `config.kleuren` en worden in `lib/kleur.ts` omgezet naar CSS-variabelen (`--cad-nacht`, `--cad-goud` en meer, als rgb-triplet). `tailwind.config.ts` koppelt daar Tailwind-kleuren aan (`bg-nacht`, `text-goud`, `bg-licht`, enzovoort). Gebruik in de pagina dus deze namen en geen vaste hex-codes. Tekstkleuren op een gekleurde achtergrond worden automatisch leesbaar gekozen (`leesbaar()`).

### Embed

`/?embed=true` toont dezelfde pagina met een doorzichtige achtergrond en weinig marge, voor in een iframe zoals Kennis Shop. De popup wordt dan in het zichtbare stuk van het iframe gezet (`meetZichtbaar()`). `next.config.ts` laat de pagina overal insluiten (`frame-ancestors *`), `/beheer` alleen binnen deze site.

## Versies en updates

Cursisten hebben een losse kopie van deze repo. Hun inhoud staat in Blob en niet in de code, dus nieuwe code overschrijft die nooit.

- **Versie:** `version` in `package.json`, en per release een tag `v1.2.3` op GitHub. `lib/versie.ts` leest de nieuwste versie en de editor toont een blauwe balk als die nieuwer is.
- **Updaten:** `scripts/update-van-template.mjs` haalt de nieuwste tag op en vervangt de bestanden uit de template. Het raakt nooit aan `config/cadeautje.json`, `.env*`, `.git`, `.github`, `node_modules`, `.next` en `.vercel`.
- **Uitbrengen:** zet bovenaan `CHANGELOG.md` een kop `## v1.2.3`, commit alles en draai `npm run release -- 1.2.3` (met `--droog` om alleen te controleren). Het script bouwt, verhoogt de versie, commit en tagt, maar pusht niets.
- **Spelregels voor wijzigingen:**
  - Instellingen moeten altijd terug te lezen zijn. Een nieuw veld krijgt een standaardwaarde in het schema. Verandert een bestaand veld, zet dan een `preprocess` of `transform` in het schema.
  - Het workflow-bestand kan niet via een update worden vervangen. Houd het klein en laat de logica in het script.
  - `next-env.d.ts` staat bewust in `.gitignore`.

## Afspraken

- Teksten in de interface zijn Nederlands, in de jij-vorm.
- Geen lange streepjes in teksten. Gebruik een dubbele punt, komma of twee zinnen.
- Teksten van de ondernemer worden alleen als tekst getoond, nooit als HTML. Links van knoppen moeten met `https://` beginnen (zie het schema).
- Voeg bij een nieuwe instelling ook toe: het schema in `lib/config.ts`, het formulier in `Editor.tsx`, de Nederlandse veldnaam in `VELDNAMEN` en (indien nodig) de standaardwaarde in `config/cadeautje.json`.
