/**
 * Exact TasteGraph pie weights - degrees from 12 o'clock clockwise.
 *
 * STANDING (2026-08-05): public-art examples MUST include credit + href
 * when the still comes from a public post (X art/design/type/UI tweets, etc.).
 * Shape: { src, caption, credit: "@handle", href: "https://x.com/.../status/..." }
 * Caption-only public-art stills are incomplete. Synthetic stills may omit href.
 * Graph public refresh: 1.3.7 (2026-08-06 ingest grid view + full still archive)
 */
export const SLICES = [
  {
    id: "music",
    name: "Intimate music",
    short: "MUSIC",
    pct: 17,
    deg: 61.2,
    color: 0x2a1f14,
    accent: 0xd4a85a,
    rim: 0xe8c98a,
    role: "Atmosphere register",
    body:
      "Medium-high emotional density with intentional voids. Ember, gold, blood-moon red, and cool mist against forest or star void. Atmosphere as product - not sparse SaaS emptiness. Motion stays ambient and light.",
    note: "Peak when the room, road, or void itself feels like a track. Graph 1.3.6: overhead angels + solitary void figure + GM surreal morning.",
    examples: [
      {
        src: "examples/music/01-v136.jpg",
        caption: "From above - angelic overhead atmosphere pack",
        credit: "@booterart",
        href: "https://x.com/booterart/status/2085452684598169809",
      },
      {
        src: "examples/music/02-v136.jpg",
        caption: "Solitary figure still - void intimacy at scale",
        credit: "@solisolsoli",
        href: "https://x.com/solisolsoli/status/2085221828780236871",
      },
      {
        src: "examples/music/03-v136.jpg",
        caption: "GM surreal morning still - atmosphere as greeting",
        credit: "@kak_dc",
        href: "https://x.com/kak_dc/status/2085320562654564801",
      },
    ],
  },
  {
    id: "myth",
    name: "Myth-tech",
    short: "MYTH-TECH",
    pct: 14,
    deg: 50.4,
    color: 0x4a453c,
    accent: 0x3cff6a,
    rim: 0xc8c2b6,
    role: "Object-as-hero register",
    body:
      "One crafted object or scale figure owns the frame. Sacred technical objects that alter weight and memory. Megalithic mass-in-space luxury. Finish must feel museum-final, not raw intrigue.",
    note: "Polish gate applies. Object replaces effect soup. 1.3.6: GalacticStones megalith + dark fantasy deep dive.",
    examples: [
      {
        src: "examples/myth/01-v136.jpg",
        caption: "Megalithic mass-in-space - object as ultimate luxury",
        credit: "@GalacticStones",
        href: "https://x.com/GalacticStones/status/2085378752830464155",
      },
      {
        src: "examples/myth/02-v136.jpg",
        caption: "Dark fantasy deep - will you go deep with me",
        credit: "@cromsovertures",
        href: "https://x.com/cromsovertures/status/2085288481601753121",
      },
    ],
  },
  {
    id: "sketch",
    name: "Sketchbook",
    short: "SKETCH",
    pct: 14,
    deg: 50.4,
    color: 0xe8dcc4,
    accent: 0x1e3a6e,
    rim: 0x2a2418,
    role: "Handmade register",
    body:
      "Travel ink diary and loose watercolor figure language on cream or white field. Soft landscape wash. Pixel craft as honest handmade signal. Object-as-hero; chrome nearly invisible.",
    note: "TasteTest peak + 1.3.6 sref figure pack + pixel commission board.",
    examples: [
      {
        src: "examples/sketch/01-v136.jpg",
        caption: "Midjourney sref figure pack - wash and hand feel",
        credit: "@sergeantsref",
        href: "https://x.com/sergeantsref/status/2085490096648695843",
      },
      {
        src: "examples/sketch/02-v136.jpg",
        caption: "Pixel art commission board - handmade grid craft",
        credit: "@ElMetallico1",
        href: "https://x.com/ElMetallico1/status/2085272074881282186",
      },
    ],
  },
  {
    id: "defensive",
    name: "Defensive systems",
    short: "DEFENSIVE",
    pct: 12,
    deg: 43.2,
    color: 0x0c1412,
    accent: 0x5f9a72,
    rim: 0xa8d4b4,
    role: "Trust register",
    body:
      "Cool dark surfaces, status-first hierarchy, higher information density when structure is crystal clear. Product icons and brand style systems that read as sealed and deliberate. Fail-closed honesty.",
    note: "Clarity over spectacle. 1.3.6: package icon craft + Noctura brand style pack.",
    examples: [
      {
        src: "examples/defensive/01-v136.jpg",
        caption: "Package icon - product signal without noise",
        credit: "@Delahuntagram",
        href: "https://x.com/Delahuntagram/status/2085293552553402450",
      },
      {
        src: "examples/defensive/02-v136.jpg",
        caption: "Noctura style pack - brand system as sealed craft",
        credit: "@OVolosin82152",
        href: "https://x.com/OVolosin82152/status/2085444030893064259",
      },
    ],
  },
  {
    id: "motion",
    name: "Motion craft",
    short: "MOTION",
    pct: 12,
    deg: 43.2,
    color: 0x12202a,
    accent: 0x7eb8c4,
    rim: 0xa8d8e0,
    role: "Motion philosophy",
    body:
      "Motion explains state - never decoration only. Claymation craft, story-series pacing, stills that seed film. Stack: CSS first, light JS, GSAP scroll, Three.js last. Reduced motion non-negotiable.",
    note: "Still-as-film-seed. 1.3.6: claymation tennis pack + after-school series still (video sources in catalog).",
    examples: [
      {
        src: "examples/motion/01-v136.jpg",
        caption: "Tennis time claymation - motion in the still",
        credit: "@gizakdag",
        href: "https://x.com/gizakdag/status/2085347706638143589",
      },
      {
        src: "examples/motion/02-v136.jpg",
        caption: "After school SR mini series - story beat as frame",
        credit: "@skitchism",
        href: "https://x.com/skitchism/status/2085255616231321963",
      },
    ],
  },
  {
    id: "pro",
    name: "Pro product UI",
    short: "PRO UI",
    pct: 12,
    deg: 43.2,
    color: 0x1a2030,
    accent: 0x7eb8c4,
    rim: 0xc8d0dc,
    role: "Product register",
    body:
      "Medium density, calm hierarchy, data-legible. Hero explorations with illustration discipline. SaaS agency heroes that convert without spam. Delete unused UI first. Tokens over raw hex chaos.",
    note: "Competence is the aesthetic. 1.3.6: chxrxg hero explorations + AfnanFatimas AI/SaaS hero.",
    examples: [
      {
        src: "examples/pro/01-v136.jpg",
        caption: "Hero explorations with unused illustrations",
        credit: "@chxrxg",
        href: "https://x.com/chxrxg/status/2085350177158901778",
      },
      {
        src: "examples/pro/02-v136.jpg",
        caption: "Hero section for AI agencies, SaaS, and startups",
        credit: "@AfnanFatimas",
        href: "https://x.com/AfnanFatimas/status/2084996341953098182",
      },
    ],
  },
  {
    id: "speculative",
    name: "Speculative mythos",
    short: "SPECULATIVE",
    pct: 12,
    deg: 43.2,
    color: 0x161428,
    accent: 0x8aa0c4,
    rim: 0xb0b8e0,
    role: "Research gravity",
    body:
      "Approachable mythos with research weight: rare oddities, high-signal world stills, dark fantasy depth. Starfield intimacy - not vaporwave mash. Still can seed a full film.",
    note: "Gravity + invitation. 1.3.6: rare circuit cat + high-signal world + dark fantasy deep.",
    examples: [
      {
        src: "examples/speculative/01-v136.jpg",
        caption: "Rare cat circuit-board - oddity as myth object",
        credit: "@rare_jpg",
        href: "https://x.com/rare_jpg/status/2085286254719992306",
      },
      {
        src: "examples/speculative/02-v136.jpg",
        caption: "High-signal AI world still - research gravity",
        credit: "@houseofuday_",
        href: "https://x.com/houseofuday_/status/2085363939672801705",
      },
      {
        src: "examples/speculative/03-v136.jpg",
        caption: "Dark fantasy depth - invitation into the deep",
        credit: "@cromsovertures",
        href: "https://x.com/cromsovertures/status/2085288481601753121",
      },
    ],
  },
  {
    id: "fashion",
    name: "Fashion / loud art",
    short: "FASHION",
    pct: 7,
    deg: 25.2,
    color: 0x2a1020,
    accent: 0xff4d9a,
    rim: 0xffb0d0,
    role: "Art planet only",
    body:
      "High-contrast editorial, gothic fairy physical paint, and glitch noise-pop figures. Allowed on fashion and pure art planets. Hard ban as product UI chrome - neon vomit stays an anti.",
    note: "Register split: art yes, dashboard no. 1.3.6: physical gothic paint + glitch noise pop.",
    examples: [
      {
        src: "examples/fashion/01-v136.jpg",
        caption: "Physical art - gothic fairy crows, vines, blue ribbons",
        credit: "@iamlaurael",
        href: "https://x.com/iamlaurael/status/2085396076933099941",
      },
      {
        src: "examples/fashion/02-v136.jpg",
        caption: "Glitch noise pop figure - loud art planet only",
        credit: "@DRUGONDRAGON",
        href: "https://x.com/DRUGONDRAGON/status/2085346561119428638",
      },
    ],
  },
];

export function totalDegrees() {
  return SLICES.reduce((s, x) => s + x.deg, 0);
}

export const GRAPH_PUBLIC_VERSION = "1.3.8";
