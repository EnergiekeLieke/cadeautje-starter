# Cadeautje-starter

Een speelse cadeautjespagina voor het hele jaar. Je klanten zien 1 tot 10 ingepakte cadeautjes en mogen er zelf een of meer uitkiezen om te openen. Wat erin zit bepaal jij: een tip, een korting, een kennismaking, een weggever of een link naar je aanbod. Je vult alles in via een eigen beheerpagina. Geen code nodig.

Gebruik hem voor Sinterklaas, Kerst, een verjaardag, Pasen, Valentijn, Moederdag en Vaderdag, de zomer, Halloween, Nieuwjaar, als bedankje voor klanten, of met een kleurenset in je eigen huisstijl.

## In 4 stappen live

### Stap 1: kopieer deze repo en zet hem online

Klik op de knop hieronder. Vercel maakt dan in je eigen GitHub-account een kopie en zet die online, inclusief de opslag voor je instellingen.

[![Deploy met Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FEnergiekeLieke%2Fcadeautje-starter&project-name=mijn-cadeautjes&repository-name=mijn-cadeautjes&env=BEHEER_WACHTWOORD&envDescription=Kies%20zelf%20een%20wachtwoord%20voor%20je%20beheerpagina&stores=%5B%7B%22type%22%3A%22blob%22%2C%22access%22%3A%22public%22%7D%5D)

Tijdens het importeren vraagt Vercel om:

1. **BEHEER_WACHTWOORD**: kies zelf een wachtwoord. Hiermee log je straks in op je beheerpagina. Bewaar het goed.
2. **Blob-opslag**: laat deze aanmaken zoals Vercel voorstelt (kies **Public** als daar naar gevraagd wordt). Hier worden je teksten, kleuren en logo bewaard.

Klik op **Deploy** en wacht tot het klaar is. Vercel geeft je een link, bijvoorbeeld `mijn-cadeautjes.vercel.app`.

### Stap 2: log in op je beheerpagina

Ga naar je link en plak `/beheer` erachter, bijvoorbeeld `mijn-cadeautjes.vercel.app/beheer`. Log in met het wachtwoord uit stap 1.

### Stap 3: maak hem van jou

Je ziet links de instellingen en rechts direct een voorbeeld.

- **Algemeen**: titel, ondertitel, tekst onderaan, het **aantal cadeautjes** (1 tot 10, standaard 5) en **hoeveel de bezoeker er mag openen** (standaard 1), en de lettertypes (ook je eigen lettertype uploaden).
- **Thema en kleuren**: kies een thema (Verjaardag, Sinterklaas, Kerst, Nieuwjaar, Valentijn, Pasen, Moederdag en Vaderdag, Zomer, Vakantie, Halloween, Bedankt of Eigen huisstijl). Een thema zet de kleuren, het decor, de verpakking en de icoontjes. Daarna pas je alles aan: vul je eigen kleurcodes in (zoals `#3b5633`), upload je logo, en zet eventueel een eigen achtergrondafbeelding achter de pagina of achter elk geopend cadeautje.
- **Cadeautjes**: bepaal per cadeautje de titel en tekst, het icoon, een afbeelding, een **code met kopieerknop** (bijvoorbeeld een kortingscode) en een **knop met link** (bijvoorbeeld naar je webshop of een les in Kennis Shop).
- **Opties**: confetti, zachte beweging, de knop "Opnieuw spelen", wel of niet laten zien wat er in de andere cadeautjes zat, het decor (sneeuw, hartjes, bloemen, ballonnen, sterretjes, herfstbladeren of zon), de verpakking (strik, lint, ster of alleen het icoon), het inpakpapier (stippen, strepen, sterretjes, hartjes en meer), een illustratie langs de rand van de kaart (vlaggetjes, besneeuwde dennen, daken met lichtjes, gras met bloemen, zee met zon of zachte heuvels), de knop **Deel met anderen** en alle vaste teksten op de pagina.
- **Delen**: je link, een kant-en-klare embedcode om te kopiëren en een korte controle voordat je de pagina deelt.

Klik rechtsboven op **Opslaan** als je tevreden bent.

Tip: in het voorbeeld kun je zelf cadeautjes openen. Met **Opnieuw beginnen** begin je weer vanaf nul.

### Stap 4: zet hem in je Kennis Shop of website

Open in je beheerpagina het tabblad **Delen** en klik op **Kopieer embedcode**. Je krijgt dan code zoals hieronder, al met jouw link en de juiste hoogte erin:

```html
<iframe src="https://mijn-cadeautjes.vercel.app/?embed=true" width="100%" height="900" frameborder="0" title="Cadeautjes"></iframe>
```

Let op: zet de maat als losse onderdelen (`width` en `height`) in de code en niet in een `style`. Kennis Shop haalt `style` er namelijk vaak uit, en dan krijg je een piepklein vakje.

## Laat Claude de teksten schrijven

Open het tabblad **Importeren**:

1. Klik op **Kopieer prompt** en plak hem in claude.ai.
2. Vul de stukjes tussen [haakjes] in over jouw bedrijf, de gelegenheid en wat er in de cadeautjes mag zitten.
3. Kopieer het JSON-blok dat Claude teruggeeft en plak het in het tekstvak.
4. Klik op **Importeren**, bekijk het voorbeeld en klik op **Opslaan**.

Je kleuren en logo blijven staan, alleen de teksten worden vervangen.

## Hoe werkt het voor de bezoeker?

- De bezoeker kiest een cadeautje, het deksel gaat eraf en de inhoud verschijnt in een popup.
- Heeft hij zijn keuzes gebruikt, dan blijven de andere cadeautjes dicht. Een geopend cadeautje kan hij nog eens bekijken.
- De bezoeker onthoudt zijn keuze alleen in zijn eigen browser (localStorage). Er wordt niets over bezoekers opgeslagen en er zijn geen cookies. Op een andere telefoon of in een ander venster mag hij dus opnieuw kiezen.
- Verander je een cadeautje, dan begint iedere bezoeker weer met een schone lei.
- Let op: de inhoud van alle cadeautjes staat in de paginabron. Een bezoeker die slim zoekt kan dus spieken. Voor een speelse actie is dat prima, voor iets dat echt geheim moet blijven is deze starter niet bedoeld.

## Updates

Komt er een nieuwe versie van de cadeautje-starter uit? Dan zie je in je beheerpagina een blauwe balk. Wat er nieuw is, staat in [CHANGELOG.md](CHANGELOG.md). Je teksten, kleuren en logo staan in je eigen opslag en blijven altijd bewaard. Open het tabblad **Updates** voor de stappen.

## Lokaal draaien

Maak een bestand `.env.local` met daarin `BEHEER_WACHTWOORD=kies-zelf-iets`. Draai dan `npm install` en `npm run dev`. De pagina draait op `localhost:3000` en de beheerpagina op `localhost:3000/beheer`. Lokaal worden je instellingen bewaard in `.cadeautje-config.local.json`.

## Licentie

BouwClub-licentie: je mag deze starter gebruiken en aanpassen voor jezelf en je klanten, maar niet doorverkopen of verspreiden. Zie [LICENSE](LICENSE).
