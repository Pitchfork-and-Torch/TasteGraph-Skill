/**
 * Exact TasteGraph pie weights - degrees from 12 o'clock clockwise.
 *
 * STANDING (2026-08-05): public-art examples MUST include credit + href
 * when the still comes from a public post (X art/design/type/UI tweets, etc.).
 * Shape: { src, caption, credit: "@handle", href: "https://x.com/.../status/..." }
 * Caption-only public-art stills are incomplete. Synthetic stills may omit href.
 * Graph public refresh: 1.3.15 (2026-09-02 wheel+grid ship after 09-02 dump >10 links)
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
    note: "1.3.15 pie: CLIAMP TUI dusk + pink dune walker + cliff temple over sea.",
    examples: [
      {
        src: "examples/music/01-v1315.jpg",
        caption: "CLIAMP TUI player over dusk road",
        credit: "@iamdothash",
        href: "https://x.com/iamdothash/status/2091620859907850652",
      },
      {
        src: "examples/music/02-v1315.jpg",
        caption: "Pink dune walker - atmosphere field",
        credit: "@unseenai",
        href: "https://x.com/unseenai/status/2094000827660734917",
      },
      {
        src: "examples/music/03-v1315.jpg",
        caption: "Cliff temple over dark sea",
        credit: "@NEXUS_TO_NOVA",
        href: "https://x.com/NEXUS_TO_NOVA/status/2094058896138584492",
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
    note: "1.3.15 pie: Stoneify moss Maps icon + halfzoid bull-machine + jet light-trail.",
    examples: [
      {
        src: "examples/myth/01-v1315.jpg",
        caption: "Stoneify moss Maps icon - object-as-hero",
        credit: "@doganuraldesign",
        href: "https://x.com/doganuraldesign/status/2091940837080924509",
      },
      {
        src: "examples/myth/02-v1315.jpg",
        caption: "Halfzoid bull-machine object hero",
        credit: "@machineviolence",
        href: "https://x.com/machineviolence/status/2094094082964443590",
      },
      {
        src: "examples/myth/03-v1315.jpg",
        caption: "Jet light-trail object in void",
        credit: "@Palakonweb",
        href: "https://x.com/Palakonweb/status/2094027778769420561",
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
    note: "1.3.15 pie: halftone cherry lips + Magritte object queue + halftone taxi road.",
    examples: [
      {
        src: "examples/sketch/01-v1315.jpg",
        caption: "Halftone cherry lips print",
        credit: "@LouiseVisual",
        href: "https://x.com/LouiseVisual/status/2092355119849308165",
      },
      {
        src: "examples/sketch/02-v1315.jpg",
        caption: "Surreal object queue on concrete",
        credit: "@GlennHasABeard",
        href: "https://x.com/GlennHasABeard/status/2092410119594152152",
      },
      {
        src: "examples/sketch/03-v1315.jpg",
        caption: "Halftone taxi on checker road",
        credit: "@LouiseVisual",
        href: "https://x.com/LouiseVisual/status/2092355119849308165",
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
    note: "1.3.15 pie: Grok Bot agent passport + Swiss neo-industrial mapping OS.",
    examples: [
      {
        src: "examples/defensive/01-v1315.jpg",
        caption: "Agent passport - grants, limits, kill switch",
        credit: "@Av1dlive",
        href: "https://x.com/Av1dlive/status/2093292927716118625",
      },
      {
        src: "examples/defensive/02-v1315.jpg",
        caption: "Swiss neo-industrial mapping OS",
        credit: "@kyleanthony",
        href: "https://x.com/kyleanthony/status/2094765910502298082",
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
    note: "1.3.15 pie: designed-in-glass shards + pixel ripple button + stroboscopic dunk.",
    examples: [
      {
        src: "examples/motion/01-v1315.jpg",
        caption: "Designed in glass - shattered material UI",
        credit: "@insporadesign",
        href: "https://x.com/insporadesign/status/2093920203918737775",
      },
      {
        src: "examples/motion/02-v1315.jpg",
        caption: "Pixel ripple button - tactile micro-UI",
        credit: "@raul_dronca",
        href: "https://x.com/raul_dronca/status/2093270659824529461",
      },
      {
        src: "examples/motion/03-v1315.jpg",
        caption: "Stroboscopic dunk - motion trail still",
        credit: "@lepadphone",
        href: "https://x.com/lepadphone/status/2091908290838204746",
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
    note: "1.3.15 pie: API keyhole landing + vgpu agent docs + Studio Pond fishing hero.",
    examples: [
      {
        src: "examples/pro/01-v1315.jpg",
        caption: "API keyhole landing - product metaphor",
        credit: "@DesignByMoein",
        href: "https://x.com/DesignByMoein/status/2091946138551386283",
      },
      {
        src: "examples/pro/02-v1315.jpg",
        caption: "vgpu - WebGPU library designed for agents",
        credit: "@matiNotFound",
        href: "https://x.com/matiNotFound/status/2093012548031254932",
      },
      {
        src: "examples/pro/03-v1315.jpg",
        caption: "Studio Pond fishing-site hero",
        credit: "@thedesignely",
        href: "https://x.com/thedesignely/status/2092202909035364546",
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
    note: "1.3.15 pie: Geomanist stone arch + glitter galaxy + starfield statue.",
    examples: [
      {
        src: "examples/speculative/01-v1315.jpg",
        caption: "Geomanist type as stone-arch landscape",
        credit: "@JayBorda",
        href: "https://x.com/JayBorda/status/2091477370872168895",
      },
      {
        src: "examples/speculative/02-v1315.jpg",
        caption: "Glitter galaxy still - research texture",
        credit: "@doganuraldesign",
        href: "https://x.com/doganuraldesign/status/2094130855056675287",
      },
      {
        src: "examples/speculative/03-v1315.jpg",
        caption: "Starfield statue - delusional optimist",
        credit: "@PermaDelusional",
        href: "https://x.com/PermaDelusional/status/2093354074166980981",
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
    note: "1.3.15 pie: Grace Kelly editorial + GitS-vibe baddie + neon snake-from-eye.",
    examples: [
      {
        src: "examples/fashion/01-v1315.jpg",
        caption: "Grace Kelly editorial - warm studio light",
        credit: "@blasfemiadigit",
        href: "https://x.com/blasfemiadigit/status/2094839257097539896",
      },
      {
        src: "examples/fashion/02-v1315.jpg",
        caption: "GitS-vibe baddie portrait",
        credit: "@PureAestheticsz",
        href: "https://x.com/PureAestheticsz/status/2094788234752430106",
      },
      {
        src: "examples/fashion/03-v1315.jpg",
        caption: "Neon snake-from-eye portrait",
        credit: "@kattlatte",
        href: "https://x.com/kattlatte/status/2095185502118797759",
      },
    ],
  },
];

export function totalDegrees() {
  return SLICES.reduce((s, x) => s + x.deg, 0);
}

export const GRAPH_PUBLIC_VERSION = "1.3.15";
