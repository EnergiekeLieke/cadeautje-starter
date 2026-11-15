import { z } from 'zod';
import { LETTERTYPE_ID_PATROON } from '@/lib/lettertypeBestand';

// ─── Lettertypes ──────────────────────────────────────────────
// Lato, Libre Baskerville en Poppins worden in app/layout.tsx met next/font geladen (van je eigen site, niet van Google).
// Verdana staat al op de meeste computers, daar valt het terug op een vergelijkbaar lettertype.
export const LETTERTYPES = {
  serif:       { naam: 'Klassiek (serif)',     stack: "Georgia, 'Times New Roman', serif" },
  sierlijk:    { naam: 'Sierlijk',             stack: "'Palatino Linotype', Palatino, 'Book Antiqua', serif" },
  sans:        { naam: 'Strak (sans-serif)',   stack: "system-ui, 'Segoe UI', Roboto, Arial, sans-serif" },
  rond:        { naam: 'Rond en vriendelijk',  stack: "'Trebuchet MS', 'Segoe UI', Verdana, sans-serif" },
  lato:        { naam: 'Lato',                 stack: "var(--font-lato), 'Segoe UI', Arial, sans-serif" },
  baskerville: { naam: 'Libre Baskerville',    stack: "var(--font-baskerville), Georgia, 'Times New Roman', serif" },
  poppins:     { naam: 'Poppins',              stack: "var(--font-poppins), 'Segoe UI', Arial, sans-serif" },
  verdana:     { naam: 'Verdana',              stack: "Verdana, Geneva, 'DejaVu Sans', sans-serif" },
  // Het lettertype dat de beheerder zelf uploadt (zie components/EigenLettertypeStijl.tsx). Zonder upload valt het terug op sans-serif.
  eigen:       { naam: 'Eigen lettertype 1',   stack: "'EigenLettertype', system-ui, 'Segoe UI', Arial, sans-serif" },
  eigen2:      { naam: 'Eigen lettertype 2',   stack: "'EigenLettertype2', system-ui, 'Segoe UI', Arial, sans-serif" },
} as const;

export type Lettertype = keyof typeof LETTERTYPES;
export const LETTERTYPE_SLEUTELS = ['serif', 'sierlijk', 'sans', 'rond', 'lato', 'baskerville', 'poppins', 'verdana', 'eigen', 'eigen2'] as const;

// Waar een lettertype voor kan worden ingezet. Leeg betekent: het standaard lettertype van die plek (zie `lettertypeVoor`).
export const LETTERTYPE_PLEKKEN = {
  titel:      { naam: 'Titel',                                  uitleg: 'De grote titel bovenaan en de voettekst.' },
  ondertitel: { naam: 'Ondertitel',                             uitleg: 'Het regeltje onder de titel.' },
  cadeautjes: { naam: 'Tekst op de cadeautjes',                 uitleg: 'De titel op een cadeautje nadat het open is.' },
  popupKop:   { naam: 'Tekst in het cadeautje (kop)',           uitleg: 'De titel van het cadeautje als het openstaat.' },
  popupTekst: { naam: 'Tekst in het cadeautje (inhoud)',        uitleg: 'De tekst, de knop en de code in het cadeautje.' },
} as const;
export type LettertypePlek = keyof typeof LETTERTYPE_PLEKKEN;

// Aantal cadeautjes: standaard 5, maximaal 10
export const MAX_CADEAUTJES = 10;
export const STANDAARD_CADEAUTJES = 5;

// ─── Decor, verpakking en iconen ──────────────────────────────
// Decor is wat er zachtjes over de pagina zweeft. Elk decor gebruikt een van de iconen hieronder.
export const DECORS = ['geen', 'sneeuw', 'hartjes', 'bloemen', 'ballonnen', 'sterren', 'bladeren', 'zon'] as const;
export type Decor = (typeof DECORS)[number];
export const DECOR_NAMEN: Record<Decor, string> = {
  geen: 'Geen decor', sneeuw: 'Sneeuwvlokken', hartjes: 'Hartjes', bloemen: 'Bloemetjes',
  ballonnen: 'Ballonnen', sterren: 'Sterretjes', bladeren: 'Herfstbladeren', zon: 'Zonnetjes',
};

// Hoe een dicht cadeautje is ingepakt
export const VERPAKKINGEN = ['strik', 'lint', 'ster', 'geen'] as const;
export type Verpakking = (typeof VERPAKKINGEN)[number];
export const VERPAKKING_NAMEN: Record<Verpakking, string> = {
  strik: 'Strik bovenop', lint: 'Lint rondom', ster: 'Ster bovenop', geen: 'Alleen het icoon',
};

// De vorm van het cadeautje: een doos met strik, een paasei dat openbreekt of een koffer die opengaat
export const VORMEN = ['doos', 'ei', 'koffer'] as const;
export type Vorm = (typeof VORMEN)[number];
export const VORM_NAMEN: Record<Vorm, string> = { doos: 'Doos met strik', ei: 'Paasei', koffer: 'Koffer' };

// Inpakpapier: het patroon op de doos
export const PAPIEREN = ['stippen', 'strepen', 'sterren', 'hartjes', 'sneeuw', 'eitjes', 'golven', 'blaadjes', 'ruit', 'geen'] as const;
export type Papier = (typeof PAPIEREN)[number];
export const PAPIER_NAMEN: Record<Papier, string> = {
  stippen: 'Stippen', strepen: 'Schuine strepen', sterren: 'Sterretjes', hartjes: 'Hartjes', sneeuw: 'Sneeuwvlokjes',
  eitjes: 'Zigzag', golven: 'Golfjes', blaadjes: 'Blaadjes', ruit: 'Ruitjes', geen: 'Effen',
};

// Sfeer: de illustratie langs de rand van de kaart (vlaggetjes bovenaan, een landschap onderaan)
export const SFEREN = ['vlaggetjes', 'dennen', 'daken', 'gras', 'golven', 'heuvels', 'geen'] as const;
export type Sfeer = (typeof SFEREN)[number];
export const SFEER_NAMEN: Record<Sfeer, string> = {
  vlaggetjes: 'Vlaggetjes bovenaan', dennen: 'Besneeuwde dennen', daken: 'Daken met lichtjes', gras: 'Gras met bloemen',
  golven: 'Zee met zon', heuvels: 'Zachte heuvels', geen: 'Geen illustratie',
};

// De iconen die op een cadeautje kunnen staan (getekend in components/CadeauIcoon.tsx)
export const ICONEN = ['cadeau', 'ster', 'hart', 'ei', 'koffer', 'ballon', 'taart', 'pompoen', 'zon', 'bloem', 'boom', 'sneeuwvlok', 'blad', 'schoen'] as const;
export type IcoonNaam = (typeof ICONEN)[number];
export const ICOON_NAMEN: Record<IcoonNaam, string> = {
  cadeau: 'Cadeau', ster: 'Ster', hart: 'Hart', ei: 'Paasei', koffer: 'Koffer', ballon: 'Ballon', taart: 'Taart',
  pompoen: 'Pompoen', zon: 'Zon', bloem: 'Bloem', boom: 'Kerstboom', sneeuwvlok: 'Sneeuwvlok', blad: 'Blad', schoen: 'Schoen',
};

// ─── Thema's ──────────────────────────────────────────────────
// Een thema is een startpunt: kleuren, decor, verpakking en iconen. Daarna kun je alles nog zelf aanpassen.
// "Eigen huisstijl" is een neutrale basis om met je eigen kleuren, lettertypes, logo en achtergrond te vullen.
// Elk thema is gecontroleerd op leesbaarheid, en tekst op gekleurde vlakken wordt automatisch leesbaar gekozen (zie lib/kleur.ts).
export const THEMAS = {
  verjaardag: {
    naam: 'Verjaardag',
    omschrijving: 'Feestelijk paars met roze en geel, met ballonnen',
    decor: 'ballonnen', verpakking: 'strik', iconen: ['taart', 'ballon', 'cadeau', 'ster'],
    papier: 'stippen', sfeer: 'vlaggetjes',
    vorm: 'doos',
    titel: 'Kies jouw verjaardagscadeautje', ondertitel: 'Je mag er één uitkiezen. Wat zou erin zitten?',
    kleuren: {
      achtergrond: '#3b1d63', accent: '#ffc94d', licht: '#fff7e8',
      primair: '#6a3fa8', secundair: '#d63d77', tekst: '#2b2140',
      tegels: ['#6a3fa8', '#d63d77', '#1f8f89', '#ffe9b8'],
    },
  },
  sint: {
    naam: 'Sinterklaas',
    omschrijving: 'Pakjesavond in rood, blauw en goud',
    decor: 'sterren', verpakking: 'strik', iconen: ['schoen', 'cadeau', 'ster', 'hart'],
    papier: 'sterren', sfeer: 'daken',
    vorm: 'doos',
    titel: 'Pakjesavond: kies een cadeautje', ondertitel: 'De Sint heeft iets voor je meegebracht.',
    kleuren: {
      achtergrond: '#8f1d22', accent: '#f0c75e', licht: '#fff3df',
      primair: '#c4262e', secundair: '#1f3f73', tekst: '#2a1c1c',
      tegels: ['#c4262e', '#1f3f73', '#d9962b', '#fff3df'],
    },
  },
  kerst: {
    naam: 'Kerst',
    omschrijving: 'Klassiek donkergroen met goud en sneeuw',
    decor: 'sneeuw', verpakking: 'lint', iconen: ['boom', 'cadeau', 'ster', 'sneeuwvlok'],
    papier: 'sneeuw', sfeer: 'dennen',
    vorm: 'doos',
    titel: 'Een kerstcadeautje voor jou', ondertitel: 'Kies er een uit onder de boom.',
    kleuren: {
      achtergrond: '#1f3320', accent: '#c9a24b', licht: '#fcebdc',
      primair: '#3b5633', secundair: '#9e3816', tekst: '#2a3a3c',
      tegels: ['#3b5633', '#9e3816', '#758d69', '#fcebdc'],
    },
  },
  nieuwjaar: {
    naam: 'Nieuwjaar',
    omschrijving: 'Middernachtblauw met goud en vuurwerk',
    decor: 'sterren', verpakking: 'ster', iconen: ['ster', 'ballon', 'cadeau'],
    papier: 'stippen', sfeer: 'daken',
    vorm: 'doos',
    titel: 'Een cadeautje voor het nieuwe jaar', ondertitel: 'Kies er een en begin goed.',
    kleuren: {
      achtergrond: '#0e1b3a', accent: '#f4d06f', licht: '#f4f1ea',
      primair: '#24407a', secundair: '#b02e5a', tekst: '#1a2238',
      tegels: ['#24407a', '#b02e5a', '#7e8fc0', '#f4f1ea'],
    },
  },
  valentijn: {
    naam: 'Valentijn',
    omschrijving: 'Romantisch wijnrood en roze met hartjes',
    decor: 'hartjes', verpakking: 'strik', iconen: ['hart', 'cadeau', 'ster'],
    papier: 'hartjes', sfeer: 'heuvels',
    vorm: 'doos',
    titel: 'Een cadeautje van hart tot hart', ondertitel: 'Kies er een om te openen.',
    kleuren: {
      achtergrond: '#5a0f2e', accent: '#ffb3c7', licht: '#fff0f3',
      primair: '#b3123f', secundair: '#7a1f5c', tekst: '#3a1224',
      tegels: ['#b3123f', '#7a1f5c', '#e8708f', '#fff0f3'],
    },
  },
  pasen: {
    naam: 'Pasen',
    omschrijving: 'Zachte lentekleuren, met paaseieren die openbreken',
    decor: 'bloemen', verpakking: 'lint', iconen: ['ei', 'bloem', 'zon'],
    papier: 'eitjes', sfeer: 'gras',
    vorm: 'ei',
    titel: 'Zoek een paasei', ondertitel: 'Welk ei kies jij?',
    kleuren: {
      achtergrond: '#fdf3d8', accent: '#a3571a', licht: '#ffffff',
      primair: '#4f8a60', secundair: '#c75b7a', tekst: '#33402f',
      tegels: ['#4f8a60', '#c75b7a', '#d9a920', '#6fa8bd'],
    },
  },
  ouders: {
    naam: 'Moederdag en Vaderdag',
    omschrijving: 'Warm crème met saliegroen en roze',
    decor: 'bloemen', verpakking: 'strik', iconen: ['bloem', 'hart', 'cadeau'],
    papier: 'blaadjes', sfeer: 'gras',
    vorm: 'doos',
    titel: 'Een cadeautje om te bedanken', ondertitel: 'Kies er een uit.',
    kleuren: {
      achtergrond: '#f6efe6', accent: '#8f4f2f', licht: '#ffffff',
      primair: '#3f6b5c', secundair: '#b8456d', tekst: '#2f2a26',
      tegels: ['#3f6b5c', '#b8456d', '#b98512', '#a8604a'],
    },
  },
  zomer: {
    naam: 'Zomer',
    omschrijving: 'Zonnig geel en turquoise',
    decor: 'zon', verpakking: 'lint', iconen: ['zon', 'bloem', 'ballon'],
    papier: 'strepen', sfeer: 'heuvels',
    vorm: 'doos',
    titel: 'Een zomers cadeautje', ondertitel: 'Kies er eentje en geniet.',
    kleuren: {
      achtergrond: '#fff1c9', accent: '#b8420f', licht: '#ffffff',
      primair: '#1b7f7f', secundair: '#d9442a', tekst: '#2c3a3a',
      tegels: ['#1b7f7f', '#d9442a', '#b7800f', '#2f8a73'],
    },
  },
  vakantie: {
    naam: 'Vakantie',
    omschrijving: 'Zeeblauw, zon en koraal, met koffers die opengaan',
    decor: 'zon', verpakking: 'lint', iconen: ['koffer', 'zon', 'bloem'],
    papier: 'golven', sfeer: 'golven',
    vorm: 'koffer',
    titel: 'Kies jouw vakantiekoffer', ondertitel: 'Wat zit er in jouw koffer?',
    kleuren: {
      achtergrond: '#0f4c6e', accent: '#ffd166', licht: '#fdf6e3',
      primair: '#1b7f9e', secundair: '#e0583a', tekst: '#1f2f3a',
      tegels: ['#1b7f9e', '#e0583a', '#2f9a85', '#fdf6e3'],
    },
  },
  halloween: {
    naam: 'Halloween',
    omschrijving: 'Donker paars met pompoenoranje',
    decor: 'bladeren', verpakking: 'ster', iconen: ['pompoen', 'ster', 'cadeau'],
    papier: 'ruit', sfeer: 'daken',
    vorm: 'doos',
    titel: 'Trick or treat?', ondertitel: 'Kies een cadeautje, als je durft.',
    kleuren: {
      achtergrond: '#1c1230', accent: '#ff9a1f', licht: '#fff1dc',
      primair: '#5a2d82', secundair: '#c24a08', tekst: '#231a33',
      tegels: ['#5a2d82', '#c24a08', '#2f7d4f', '#fff1dc'],
    },
  },
  bedankt: {
    naam: 'Bedankt',
    omschrijving: 'Rustig crème, petrol en terracotta, voor klanten en gasten',
    decor: 'geen', verpakking: 'lint', iconen: ['hart', 'cadeau', 'bloem'],
    papier: 'ruit', sfeer: 'heuvels',
    vorm: 'doos',
    titel: 'Bedankt! Kies een cadeautje', ondertitel: 'Als dank voor jouw vertrouwen.',
    kleuren: {
      achtergrond: '#f2efe8', accent: '#7d5f25', licht: '#ffffff',
      primair: '#2f5d62', secundair: '#b4663a', tekst: '#26302f',
      tegels: ['#2f5d62', '#b4663a', '#5b8a84', '#8a6a2f'],
    },
  },
  eigen: {
    naam: 'Eigen huisstijl',
    omschrijving: 'Neutrale basis: zet zelf je kleuren, lettertypes, logo en achtergrond',
    decor: 'geen', verpakking: 'strik', iconen: ['cadeau'],
    papier: 'stippen', sfeer: 'geen',
    vorm: 'doos',
    titel: 'Kies een cadeautje', ondertitel: 'Je mag er een uitkiezen.',
    kleuren: {
      achtergrond: '#26324a', accent: '#e9b44c', licht: '#faf6ef',
      primair: '#3d5a80', secundair: '#d4553a', tekst: '#25303b',
      tegels: ['#3d5a80', '#d4553a', '#4f7c8f', '#faf6ef'],
    },
  },
} as const;

export type ThemaNaam = keyof typeof THEMAS;
export const THEMA_SLEUTELS = Object.keys(THEMAS) as ThemaNaam[];
export const STANDAARD_THEMA: ThemaNaam = 'verjaardag';

/** Staan de kleuren nog precies zoals in het thema? Zo niet, dan zijn ze aangepast. */
export function kleurenGelijkAanThema(k: { achtergrond: string; accent: string; licht: string; primair: string; secundair: string; tekst: string; tegels: string[] }, thema: ThemaNaam): boolean {
  const lijst = (x: typeof k) => [x.achtergrond, x.accent, x.licht, x.primair, x.secundair, x.tekst, ...x.tegels].map((c) => c.toLowerCase()).join();
  return lijst(k) === lijst({ ...THEMAS[thema].kleuren, tegels: [...THEMAS[thema].kleuren.tegels] });
}

// ─── Schema ───────────────────────────────────────────────────
const hex = z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Gebruik een kleurcode zoals #c9a24b');

// Afbeeldingen en logo: een https-link, een pad op deze site of leeg
const afbeeldingUrl = z
  .string()
  .max(500, 'Deze link is te lang')
  .refine((v) => v === '' || /^https:\/\//i.test(v) || v.startsWith('/'), 'Gebruik een link die met https:// begint');

const knopUrl = z
  .string()
  .max(500, 'Deze link is te lang')
  .refine((v) => v === '' || /^https:\/\//i.test(v), 'Gebruik een link die met https:// begint');

const basis = THEMAS[STANDAARD_THEMA];

const kleurenSchema = z.object({
  achtergrond: hex.default(basis.kleuren.achtergrond),
  accent:      hex.default(basis.kleuren.accent),
  licht:       hex.default(basis.kleuren.licht),
  primair:     hex.default(basis.kleuren.primair),
  secundair:   hex.default(basis.kleuren.secundair),
  tekst:       hex.default(basis.kleuren.tekst),
  tegels:      z.array(hex).length(4, 'Geef precies 4 tegelkleuren op').default([...basis.kleuren.tegels]),
});

const procent = (max: number, standaard: number) =>
  z.number({ error: 'Kies hoe sterk de laag over de afbeelding is' }).int('Een heel getal graag').min(0, 'Minimaal 0%').max(max, `Maximaal ${max}%`).default(standaard);

const optiesSchema = z.object({
  decor:       z.enum(DECORS, { error: 'Kies een van de beschikbare opties' }).default(basis.decor),
  // Confetti als een cadeautje opengaat
  confetti:    z.boolean().default(true),
  verpakking:  z.enum(VERPAKKINGEN, { error: 'Kies een van de beschikbare opties' }).default(basis.verpakking),
  vorm:        z.enum(VORMEN, { error: 'Kies een van de beschikbare opties' }).default(basis.vorm),
  papier:      z.enum(PAPIEREN, { error: 'Kies een van de beschikbare opties' }).default(basis.papier),
  sfeer:       z.enum(SFEREN, { error: 'Kies een van de beschikbare opties' }).default(basis.sfeer),
  // Dichte cadeautjes bewegen zachtjes, om uit te nodigen tot klikken
  schudden:    z.boolean().default(true),
  // Na de laatste keuze mag de bezoeker opnieuw beginnen (met de knop onder de cadeautjes)
  opnieuwSpelen: z.boolean().default(true),
  // Na de laatste keuze gaan de overige cadeautjes ook open (om te laten zien wat erin zat)
  restOnthullen: z.boolean().default(false),
  // Eigen afbeelding als achtergrond van de hele pagina. De cadeautjes komen erover. Zolang er een is, doet de achtergrondkleur niet mee.
  // achtergrondTekst is de kleur van de titel en de tekst op de afbeelding, achtergrondLaag hoe sterk een donkere (bij lichte tekst) of lichte laag eroverheen ligt.
  achtergrondAfbeelding:       afbeeldingUrl.default(''),
  achtergrondAfbeeldingMobiel: afbeeldingUrl.default(''),
  achtergrondTekst:            z.enum(['licht', 'donker'], { error: 'Kies een van de beschikbare opties' }).default('licht'),
  achtergrondLaag:             procent(80, 30),
  // Eigen afbeelding als achtergrond van elk geopend cadeautje (de popup), met de tekst erover.
  popupAchtergrond:            afbeeldingUrl.default(''),
  popupAchtergrondTekst:       z.enum(['donker', 'licht'], { error: 'Kies een van de beschikbare opties' }).default('donker'),
  popupAchtergrondLaag:        procent(90, 50),
  // Knop "Deel met anderen"
  delen:       z.boolean().default(false),
  // Leeg betekent: de standaardtekst. {titel} wordt de titel van de pagina.
  delenTekst:  z.string().trim().max(200, 'De tekst bij het delen is te lang (maximaal 200 tekens)').default(''),
  // Link die gedeeld wordt. Leeg betekent: de pagina waar de bezoeker nu is.
  delenUrl:    knopUrl.default(''),
});

const knoppenSchema = z.object({
  standaardLabel: z.string().trim().min(1, 'Vul een standaard knoptekst in').max(40, 'De standaard knoptekst is te lang (maximaal 40 tekens)').default('Naar mijn cadeau'),
  openen:         z.enum(['nieuw', 'zelfde'], { error: 'Kies een van de beschikbare opties' }).default('nieuw'),
});

// Alle vaste teksten op de pagina. Leeg betekent: de standaardtekst (zie `teksten.ts`).
// {aantal} is hoeveel cadeautjes je mag openen, {over} hoeveel je er nog mag.
const tekstVeld = (max: number) => z.string().trim().max(max, `Deze tekst is te lang (maximaal ${max} tekens)`).default('');
const tekstenSchema = z.object({
  kies:         tekstVeld(120),
  klaar:        tekstVeld(160),
  opnieuw:      tekstVeld(40),
  codeLabel:    tekstVeld(40),
  kopieer:      tekstVeld(30),
  gekopieerd:   tekstVeld(30),
  sluit:        tekstVeld(30),
});

// Een knop met link in een cadeautje. `aan` bewaart de keuze wel/geen knop, ook als de link blijft staan.
// Ontbreekt `aan` (JSON van Claude), dan staat de knop aan zodra er een link is.
const knopSchema = z
  .object({
    aan:   z.boolean().optional(),
    label: z.string().trim().max(40, 'De knoptekst is te lang (maximaal 40 tekens)').default(''),
    url:   knopUrl.default(''),
  })
  .transform((k) => ({ ...k, aan: k.aan ?? Boolean(k.url) }))
  .refine((k) => !k.aan || k.url !== '', { message: 'Vul de link in of zet de knop uit', path: ['url'] });

// Een code (bijvoorbeeld een kortingscode) die de bezoeker kan kopiëren
const codeSchema = z
  .object({
    aan:    z.boolean().optional(),
    label:  z.string().trim().max(40, 'Het label bij de code is te lang (maximaal 40 tekens)').default(''),
    waarde: z.string().trim().max(60, 'De code is te lang (maximaal 60 tekens)').default(''),
  })
  .transform((c) => ({ ...c, aan: c.aan ?? Boolean(c.waarde) }))
  .refine((c) => !c.aan || c.waarde !== '', { message: 'Vul de code in of zet de code uit' });

export const cadeautjeSchema = z.object({
  titel: z.string().trim().min(1, 'Geef dit cadeautje een titel').max(80, 'De titel is te lang (maximaal 80 tekens)'),
  tekst: z.string().max(1500, 'De tekst is te lang (maximaal 1500 tekens)').default(''),
  // Leeg betekent: automatisch een icoon uit het thema
  icoon: z.enum([...ICONEN, ''], { error: 'Kies een van de beschikbare opties' }).default(''),
  knop: knopSchema.default({ aan: false, label: '', url: '' }),
  code: codeSchema.default({ aan: false, label: '', waarde: '' }),
  afbeelding: afbeeldingUrl.default(''),
});

const lettertypeKeuze = z.enum([...LETTERTYPE_SLEUTELS, ''], { error: 'Kies een van de beschikbare opties' }).default('');
// Een geüpload lettertype: alleen de naam in de opslag, nooit het adres. Het bestand wordt via /api/lettertype uitgeleverd.
const lettertypeBestand = z.string().max(200).refine((v) => v === '' || LETTERTYPE_ID_PATROON.test(v), 'Ongeldig lettertypebestand').default('');
const eigenLettertypeSchema = z.object({
  naam: z.string().trim().max(40, 'De naam van het lettertype is te lang (maximaal 40 tekens)').default(''),
  normaal: lettertypeBestand,
  vet: lettertypeBestand,
});

const lettertypesSchema = z.object({
  titel: lettertypeKeuze,
  ondertitel: lettertypeKeuze,
  cadeautjes: lettertypeKeuze,
  popupKop: lettertypeKeuze,
  popupTekst: lettertypeKeuze,
});

export const configSchema = z
  .object({
    titel:      z.string().trim().min(1, 'Geef de pagina een titel').max(80, 'De titel is te lang (maximaal 80 tekens)'),
    ondertitel: z.string().trim().max(120, 'De ondertitel is te lang').default(''),
    footer:     z.string().trim().max(200, 'De voettekst is te lang').default(''),
    logoUrl:    afbeeldingUrl.default(''),
    // Grootte van de titel in procenten van de standaardgrootte
    titelGrootte: z.number({ error: 'Kies een grootte voor de titel' }).int('Een heel getal graag').min(60, 'De titel mag niet kleiner dan 60%').max(200, 'De titel mag niet groter dan 200%').default(100),
    lettertype: z.enum(LETTERTYPE_SLEUTELS, { error: 'Kies een van de beschikbare opties' }).default('serif'),
    lettertypes: lettertypesSchema.prefault({}),
    eigenLettertype: eigenLettertypeSchema.prefault({}),
    eigenLettertype2: eigenLettertypeSchema.prefault({}),
    thema:      z.enum(THEMA_SLEUTELS as [ThemaNaam, ...ThemaNaam[]], { error: 'Kies een van de beschikbare thema\'s' }).default(STANDAARD_THEMA),
    aantalCadeautjes: z.number({ error: 'Kies hoeveel cadeautjes er zijn' }).int('Een heel getal graag').min(1, 'Minimaal 1 cadeautje').max(MAX_CADEAUTJES, `Maximaal ${MAX_CADEAUTJES} cadeautjes`).default(STANDAARD_CADEAUTJES),
    // Hoeveel cadeautjes de bezoeker mag openen. Nooit meer dan er cadeautjes zijn (zie de transform hieronder).
    aantalKiezen: z.number({ error: 'Kies hoeveel cadeautjes de bezoeker mag openen' }).int('Een heel getal graag').min(1, 'Minimaal 1').max(MAX_CADEAUTJES, `Maximaal ${MAX_CADEAUTJES}`).default(1),
    kleuren:    kleurenSchema.prefault({}),
    opties:     optiesSchema.prefault({}),
    knoppen:    knoppenSchema.prefault({}),
    teksten:    tekstenSchema.prefault({}),
    cadeautjes: z.array(cadeautjeSchema).max(MAX_CADEAUTJES, `Maximaal ${MAX_CADEAUTJES} cadeautjes`),
  })
  // Verlaag je het aantal cadeautjes onder het aantal dat je mag openen, dan passen we het laatste aan in plaats van te weigeren
  .transform((c) => ({ ...c, aantalKiezen: Math.min(c.aantalKiezen, c.aantalCadeautjes) }));

export type CadeautjeConfig = z.infer<typeof configSchema>;
export type Cadeautje = z.infer<typeof cadeautjeSchema>;
export type CadeautjeKleuren = CadeautjeConfig['kleuren'];

// ─── Hulpfuncties ─────────────────────────────────────────────
const VELDNAMEN: Record<string, string> = {
  titel: 'titel', ondertitel: 'ondertitel', footer: 'voettekst', logoUrl: 'logo', thema: 'thema',
  aantalCadeautjes: 'aantal cadeautjes', aantalKiezen: 'aantal om te openen',
  tekst: 'tekst', icoon: 'icoon', knop: 'knop', code: 'code', waarde: 'code', label: 'label',
  url: 'link', afbeelding: 'afbeelding', kleuren: 'kleuren', tegels: 'tegelkleuren',
  achtergrond: 'achtergrondkleur', accent: 'accentkleur', licht: 'lichte kleur', primair: 'primaire kleur',
  secundair: 'secundaire kleur', lettertype: 'lettertype', cadeautjes: 'cadeautjes', opties: 'opties',
  knoppen: 'knoppen', standaardLabel: 'standaard knoptekst', openen: 'openen', aan: 'aan',
  decor: 'decor', vorm: 'vorm van de cadeautjes', papier: 'inpakpapier', sfeer: 'illustratie', confetti: 'confetti', verpakking: 'verpakking', schudden: 'schudden',
  opnieuwSpelen: 'opnieuw spelen', restOnthullen: 'rest onthullen', delen: 'knop om te delen',
  delenTekst: 'tekst bij het delen', delenUrl: 'link bij het delen',
  popupAchtergrond: 'achtergrond van het cadeautje', popupAchtergrondTekst: 'tekstkleur in het cadeautje',
  popupAchtergrondLaag: 'laag over de achtergrond van het cadeautje',
  achtergrondAfbeelding: 'achtergrondafbeelding (computer)', achtergrondAfbeeldingMobiel: 'achtergrondafbeelding (telefoon)',
  achtergrondTekst: 'tekstkleur op de achtergrond', achtergrondLaag: 'laag over de achtergrond',
  titelGrootte: 'grootte van de titel', lettertypes: 'lettertypes',
  eigenLettertype: 'eigen lettertype 1', eigenLettertype2: 'eigen lettertype 2',
  normaal: 'gewoon lettertypebestand', vet: 'vet lettertypebestand',
  popupKop: 'kop in het cadeautje', popupTekst: 'tekst in het cadeautje',
  teksten: 'teksten', kies: 'tekst bij het kiezen', klaar: 'tekst na het kiezen', opnieuw: 'knoptekst opnieuw spelen',
  codeLabel: 'label bij de code', kopieer: 'knoptekst kopiëren', gekopieerd: 'tekst na het kopiëren', sluit: 'knoptekst sluiten',
};

/** Het lettertype voor een plek. Is er niets gekozen, dan geldt: sans voor lopende tekst, het titel-lettertype voor de rest. */
export function lettertypeVoor(config: Pick<CadeautjeConfig, 'lettertype' | 'lettertypes'>, plek: LettertypePlek): Lettertype {
  const keuze = config.lettertypes[plek];
  if (keuze !== '') return keuze;
  return plek === 'ondertitel' || plek === 'popupTekst' ? 'sans' : config.lettertype;
}

function padNaarTekst(pad: PropertyKey[]): string {
  if (pad[0] === 'cadeautjes' && typeof pad[1] === 'number') {
    const rest = pad.slice(2).map((p) => VELDNAMEN[String(p)] ?? String(p)).join(', ');
    return `Cadeautje ${pad[1] + 1}${rest ? `, ${rest}` : ''}`;
  }
  return pad.map((p) => VELDNAMEN[String(p)] ?? String(p)).join(', ') || 'Instellingen';
}

export function foutenNaarRegels(error: z.ZodError): string[] {
  return error.issues.map((i) => `${padNaarTekst(i.path)}: ${i.message}`);
}

/** Valideert willekeurige invoer (bijv. geplakte JSON) en geeft een nette config of Nederlandse foutregels terug. */
export function leesConfig(invoer: unknown): { ok: true; config: CadeautjeConfig } | { ok: false; fouten: string[] } {
  const uitkomst = configSchema.safeParse(invoer);
  if (uitkomst.success) return { ok: true, config: uitkomst.data };
  return { ok: false, fouten: foutenNaarRegels(uitkomst.error) };
}

/** Vult ontbrekende cadeautjes aan, zodat er altijd precies `aantalCadeautjes` zijn. */
export function cadeautjesVoor(config: CadeautjeConfig): (Cadeautje & { nr: number })[] {
  return Array.from({ length: config.aantalCadeautjes }, (_, i) => ({
    nr: i + 1,
    ...(config.cadeautjes[i] ?? { titel: `Cadeautje ${i + 1}`, tekst: '', icoon: '' as const, knop: { aan: false, label: '', url: '' }, code: { aan: false, label: '', waarde: '' }, afbeelding: '' }),
  }));
}

/** Het icoon van een cadeautje: de eigen keuze, anders een icoon uit het thema (om de beurt). */
export function icoonVoor(config: Pick<CadeautjeConfig, 'thema'>, cadeautje: Pick<Cadeautje, 'icoon'>, index: number): IcoonNaam {
  if (cadeautje.icoon !== '') return cadeautje.icoon;
  const lijst = THEMAS[config.thema].iconen;
  return lijst[index % lijst.length];
}
