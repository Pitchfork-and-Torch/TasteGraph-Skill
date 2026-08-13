/**
 * Exact TasteGraph pie weights - degrees from 12 o'clock clockwise.
 *
 * STANDING (2026-08-05): public-art examples MUST include credit + href
 * when the still comes from a public post (X art/design/type/UI tweets, etc.).
 * Shape: { src, caption, credit: "@handle", href: "https://x.com/.../status/..." }
 * Caption-only public-art stills are incomplete. Synthetic stills may omit href.
 * Graph public refresh: 1.3.14 (2026-08-18 wheel+grid ship after 08-18 dump >10 links)
 * STANDING (2026-08-10): any love dump with more than 10 links ships BOTH wheel wedges + grid.
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
    note: "1.3.14 pie: desert night diner + Late Check-In motel + pastoral hill light.",
    examples: [
      {
        src: "examples/music/01-v1314.jpg",
        caption: "Desert night diner - film-seed atmosphere",
        credit: "@m_tomorrowland",
        href: "https://x.com/m_tomorrowland/status/2089468849880203690",
      },
      {
        src: "examples/music/02-v1314.jpg",
        caption: "Late Check-In motel - neon path film-seed",
        credit: "@LouVisual",
        href: "https://x.com/LouVisual/status/2088684778077757532",
      },
      {
        src: "examples/music/03-v1314.jpg",
        caption: "Pastoral hill light - quiet atmosphere still",
        credit: "@BenjaminUIX",
        href: "https://x.com/BenjaminUIX/status/2089689362384707807",
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
    note: "1.3.14 pie: stone computer + cliff motorcycle + less-screen sliver display.",
    examples: [
      {
        src: "examples/myth/01-v1314.jpg",
        caption: "Written in stone - anachronistic high-tech object",
        credit: "@Synthetic_Copy",
        href: "https://x.com/Synthetic_Copy/status/2089790980673143261",
      },
      {
        src: "examples/myth/02-v1314.jpg",
        caption: "Cliff motorcycle - machine as hero",
        credit: "@machineviolence",
        href: "https://x.com/machineviolence/status/2089731093796712952",
      },
      {
        src: "examples/myth/03-v1314.jpg",
        caption: "Less screen - sliver display object-as-hero",
        credit: "@Synthetic_Copy",
        href: "https://x.com/Synthetic_Copy/status/2089544756300816493",
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
    note: "1.3.14 pie: Dryad desert house + limited-palette pixel pool + ramenya warmth shop.",
    examples: [
      {
        src: "examples/sketch/01-v1314.jpg",
        caption: "Dryad desert house - painterly solitary",
        credit: "@LouVisual",
        href: "https://x.com/LouVisual/status/2088919250392027272",
      },
      {
        src: "examples/sketch/02-v1314.jpg",
        caption: "Limited-palette pixel pool",
        credit: "@AnasAbdin",
        href: "https://x.com/AnasAbdin/status/2088464674064826878",
      },
      {
        src: "examples/sketch/03-v1314.jpg",
        caption: "Warmth - pixel coastal shop",
        credit: "@ramenya6",
        href: "https://x.com/ramenya6/status/2088723221113983078",
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
    note: "1.3.14 pie: mnowak cinematic dash + AdityaSur 3D folder chrome.",
    examples: [
      {
        src: "examples/defensive/01-v1314.jpg",
        caption: "Cinematic dashboard - status-first density",
        credit: "@mnowakdesign",
        href: "https://x.com/mnowakdesign/status/2084611335346925670",
      },
      {
        src: "examples/defensive/02-v1314.jpg",
        caption: "3D folder - sealed file chrome",
        credit: "@AdityaSur11",
        href: "https://x.com/AdityaSur11/status/2089706379070304730",
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
    note: "1.3.14 pie: three.js liquid glass + html-in-canvas + 3D rolling stepper.",
    examples: [
      {
        src: "examples/motion/01-v1314.jpg",
        caption: "Infinite liquid glass - WebGL motion cards",
        credit: "@threejs",
        href: "https://x.com/threejs/status/2089745841779347839",
      },
      {
        src: "examples/motion/02-v1314.jpg",
        caption: "html-in-canvas shop explorer",
        credit: "@AlbiaHossain",
        href: "https://x.com/AlbiaHossain/status/2088992022111854765",
      },
      {
        src: "examples/motion/03-v1314.jpg",
        caption: "3D rolling stepper - tactile UI motion",
        credit: "@insporadesign",
        href: "https://x.com/insporadesign/status/2088492083451396215",
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
    note: "1.3.14 pie: metallic gel icons + Polysans specimen + BoardUI dark landing.",
    examples: [
      {
        src: "examples/pro/01-v1314.jpg",
        caption: "Inflated metallic gel app icons",
        credit: "@doganuraldesign",
        href: "https://x.com/doganuraldesign/status/2089732187847262617",
      },
      {
        src: "examples/pro/02-v1314.jpg",
        caption: "Polysans typeface specimen",
        credit: "@JayBorda",
        href: "https://x.com/JayBorda/status/2088912827058909599",
      },
      {
        src: "examples/pro/03-v1314.jpg",
        caption: "BoardUI dark landing - system density",
        credit: "@sitenley",
        href: "https://x.com/sitenley/status/2089121936173367764",
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
    note: "1.3.14 pie: aquatic console + mecha heli cutaway + type-as-portal landscape.",
    examples: [
      {
        src: "examples/speculative/01-v1314.jpg",
        caption: "Aquatic console garden - workstation as terrarium",
        credit: "@goo_vision",
        href: "https://x.com/goo_vision/status/2089744882973712389",
      },
      {
        src: "examples/speculative/02-v1314.jpg",
        caption: "Mecha heli cutaway - research still",
        credit: "@machineviolence",
        href: "https://x.com/machineviolence/status/2088843196142923858",
      },
      {
        src: "examples/speculative/03-v1314.jpg",
        caption: "Type specimen as sunset portal landscape",
        credit: "@neropursue",
        href: "https://x.com/neropursue/status/2088540558436319350",
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
    note: "1.3.14 pie: retro glam chrome hand + Renaissance jeweled face + Kismet lion.",
    examples: [
      {
        src: "examples/fashion/01-v1314.jpg",
        caption: "Retro glam chrome hand in wildflowers",
        credit: "@Palakonweb",
        href: "https://x.com/Palakonweb/status/2088849955893170687",
      },
      {
        src: "examples/fashion/02-v1314.jpg",
        caption: "Renaissance jeweled night face",
        credit: "@AnglsAI",
        href: "https://x.com/AnglsAI/status/2089085522295574602",
      },
      {
        src: "examples/fashion/03-v1314.jpg",
        caption: "Kismet lion print - loud art",
        credit: "@LouVisual",
        href: "https://x.com/LouVisual/status/2089712167192805815",
      },
    ],
  },
];

export function totalDegrees() {
  return SLICES.reduce((s, x) => s + x.deg, 0);
}

export const GRAPH_PUBLIC_VERSION = "1.3.14";
