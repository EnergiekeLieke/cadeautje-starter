// De prompt die een ondernemer in Claude plakt om de inhoud van de cadeautjes te laten schrijven.
// Het resultaat is JSON die in /beheer onder "Importeren en exporteren" past.

export const PROMPT_TEKSTEN = `Ik maak een digitale cadeautjespagina voor mijn klanten: een pagina met een paar ingepakte cadeautjes waarvan de bezoeker er een aantal mag openen. Schrijf de inhoud voor me en geef het resultaat als JSON.

Over mij en de actie:
- Wat ik doe en voor wie: [beschrijf je bedrijf en je klanten]
- Gelegenheid: [bijvoorbeeld Sinterklaas, verjaardag, Pasen, bedankt, vakantie]
- Aantal cadeautjes: [een getal van 1 tot 10]
- Hoeveel cadeautjes de bezoeker mag openen: [een getal, meestal 1]
- Mijn tone of voice: [bijvoorbeeld warm en speels, jij-vorm]
- Wat er in de cadeautjes mag zitten: [bijvoorbeeld kortingen, gratis tips, een kennismaking, een leuke wens]

Regels voor de tekst:
- Schrijf in het Nederlands, in de jij-vorm.
- Gebruik geen lange streepjes. Gebruik een dubbele punt, een komma of twee zinnen.
- Titel van een cadeautje: maximaal 80 tekens. Tekst: maximaal 600 tekens.
- Alleen gewone tekst, geen HTML en geen opmaakcodes.
- Links moeten met https:// beginnen. Verzin geen links: laat "url" leeg en zet "aan" op false als je de link niet weet.
- Verzin geen kortingscodes: laat "waarde" leeg en zet "aan" op false als ik de code niet heb gegeven.

Geef alleen het JSON-blok terug, in precies deze vorm:

{
  "titel": "Titel bovenaan de pagina",
  "ondertitel": "Korte regel onder de titel",
  "footer": "Korte afsluiting onderaan",
  "aantalCadeautjes": 5,
  "aantalKiezen": 1,
  "cadeautjes": [
    {
      "titel": "Titel van het cadeautje",
      "tekst": "Wat de bezoeker krijgt",
      "knop": { "aan": false, "label": "", "url": "" },
      "code": { "aan": false, "label": "", "waarde": "" }
    }
  ]
}

Het aantal cadeautjes in de lijst moet gelijk zijn aan "aantalCadeautjes".`;
