import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { SLICES, GRAPH_PUBLIC_VERSION } from "./slices.js";

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const host = document.getElementById("canvas-host");
const panelEmpty = document.getElementById("panel-empty");
const panelDetail = document.getElementById("panel-detail");
const legendEl = document.getElementById("legend");
const hintEl = document.getElementById("hint");

/** @type {{ items?: Array<Record<string, unknown>>, count?: number } | null} */
let contributingSources = null;

const CATALOG_BUST = "20260818b";

async function loadContributingSources() {
  const base = import.meta.env.BASE_URL || "/";
  const url = `${base}contributing-sources.json?v=${GRAPH_PUBLIC_VERSION || "1"}&r=${CATALOG_BUST}`;
  try {
    const res = await fetch(url, { cache: "no-cache" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    contributingSources = await res.json();
  } catch (err) {
    console.warn("[TasteGraph pie] contributing-sources load failed", err);
    contributingSources = { items: [], count: 0 };
  }
  renderAllSourcesList();
}

function sourceMetaLine(item) {
  const bits = [];
  if (item.kind) bits.push(String(item.kind));
  if (item.batch) bits.push(String(item.batch));
  if (item.featured) bits.push("featured still");
  return bits.join(" · ");
}

function renderSourceList(listEl, items) {
  if (!listEl) return;
  listEl.innerHTML = "";
  if (!items.length) {
    const li = document.createElement("li");
    li.innerHTML = `<span class="s-title">No additional links in this set.</span>`;
    listEl.appendChild(li);
    return;
  }
  items.forEach((item) => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = String(item.url || "#");
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    const handle = document.createElement("span");
    handle.className = "s-handle";
    handle.textContent = item.handle ? `@${item.handle}` : "Source";
    const title = document.createElement("span");
    title.className = "s-title";
    title.textContent = String(item.title || "Public post");
    const meta = document.createElement("span");
    meta.className = "s-meta" + (item.featured ? " s-featured" : "");
    meta.textContent = sourceMetaLine(item);
    a.append(handle, title, meta);
    li.appendChild(a);
    listEl.appendChild(li);
  });
}

function renderAllSourcesList() {
  const items = Array.isArray(contributingSources?.items) ? contributingSources.items : [];
  const countEl = document.getElementById("all-sources-count");
  if (countEl) countEl.textContent = String(items.length || contributingSources?.count || 0);
  renderSourceList(document.getElementById("all-sources-list"), items);
}

function renderRegisterSources(sliceId) {
  const items = Array.isArray(contributingSources?.items) ? contributingSources.items : [];
  const reg = items.filter((it) => {
    const regs = Array.isArray(it.registers) ? it.registers : [];
    return regs.includes(sliceId);
  });
  // Prefer non-featured first in "more", but include all so nothing is lost
  const more = reg.filter((it) => !it.featured);
  const rest = reg.filter((it) => it.featured);
  const ordered = [...more, ...rest];
  const countEl = document.getElementById("reg-sources-count");
  if (countEl) countEl.textContent = String(ordered.length);
  renderSourceList(document.getElementById("reg-sources-list"), ordered);
  const fold = document.getElementById("reg-sources-fold");
  if (fold) fold.hidden = ordered.length === 0;
}

// Brighter display colors so wedges read on dark stage
const FACE = {
  music: 0x3d2a18,
  myth: 0x6a655c,
  sketch: 0xf0e2c8,
  defensive: 0x143528,
  motion: 0x1a3a4a,
  pro: 0x2a3548,
  speculative: 0x2a2850,
  fashion: 0x4a1840,
};

// --- UI ---
function fillLegend() {
  legendEl.innerHTML = "";
  SLICES.forEach((s, i) => {
    const li = document.createElement("li");
    li.dataset.index = String(i);
    const hex = `#${s.accent.toString(16).padStart(6, "0")}`;
    li.innerHTML = `<span class="sw" style="background:${hex}"></span><span class="nm">${s.name}</span><span class="pc">${s.pct}%</span>`;
    li.addEventListener("mouseenter", () => setActive(i, true));
    li.addEventListener("focus", () => setActive(i, true));
    li.addEventListener("click", () => setActive(i, true));
    li.tabIndex = 0;
    legendEl.appendChild(li);
  });
}

function setPanel(slice) {
  if (!slice) {
    panelEmpty.classList.remove("is-hidden");
    panelDetail.classList.add("is-hidden");
    return;
  }
  panelEmpty.classList.add("is-hidden");
  panelDetail.classList.remove("is-hidden");
  panelDetail.style.animation = "none";
  void panelDetail.offsetWidth;
  panelDetail.style.animation = "";

  document.getElementById("d-pct").textContent = `${slice.pct}%`;
  document.getElementById("d-kicker").textContent = slice.role;
  document.getElementById("d-title").textContent = slice.name;
  document.getElementById("d-body").textContent = slice.body;
  document.getElementById("d-deg").textContent = `${slice.deg} deg exact`;
  document.getElementById("d-role").textContent = slice.short;
  document.getElementById("d-note").textContent = slice.note;

  const gal = document.getElementById("d-gallery");
  gal.innerHTML = "";
  // Vite base is "/" in dev and "/wheel/" in production - never hardcode root paths
  const base = import.meta.env.BASE_URL || "/";
  // Standing: public-art examples should ship with credit + href (source links).
  // Mount figures in the DOM first (so images actually load), reveal on success,
  // remove on error - never leave a broken/missing tile in the wedge panel.
  slice.examples.forEach((ex) => {
    const srcPath = String(ex.src || "").replace(/^\//, "");
    if (!srcPath) return;
    const src = base + srcPath;
    const fig = document.createElement("figure");
    fig.classList.add("is-pending");
    const img = document.createElement("img");
    img.alt = ex.caption || "";
    // Eager: only 2-3 per wedge; lazy + deferred mount never fired load events.
    img.loading = "eager";
    img.decoding = "async";
    const cap = document.createElement("figcaption");
    const title = document.createElement("span");
    title.className = "cap-title";
    title.textContent = ex.caption || "";
    cap.appendChild(title);
    if (ex.href) {
      const a = document.createElement("a");
      a.className = "cap-source";
      a.href = ex.href;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.textContent = ex.credit ? `Source ${ex.credit}` : "Source on X";
      a.addEventListener("click", (e) => e.stopPropagation());
      cap.appendChild(a);
    } else if (ex.credit) {
      const cr = document.createElement("span");
      cr.className = "cap-source muted";
      cr.textContent = ex.credit;
      cap.appendChild(cr);
    }
    fig.append(img, cap);
    fig.addEventListener("click", () =>
      openLightbox(src, ex.caption, {
        title: ex.caption,
        credit: ex.credit,
        href: ex.href,
      })
    );
    const reflowHero = () => {
      const ready = [...gal.querySelectorAll("figure.is-ready")];
      ready.forEach((f, i) => f.classList.toggle("is-hero", i === 0));
    };
    const reveal = () => {
      fig.classList.remove("is-pending");
      fig.classList.add("is-ready");
      reflowHero();
    };
    const drop = () => {
      fig.remove();
      img.removeAttribute("src");
      reflowHero();
    };
    img.onload = reveal;
    img.onerror = drop;
    gal.appendChild(fig);
    img.src = src;
    if (img.complete) {
      if (img.naturalWidth > 0) reveal();
      else drop();
    }
  });

  renderRegisterSources(slice.id);

  [...legendEl.children].forEach((li) => {
    li.classList.toggle("is-active", Number(li.dataset.index) === SLICES.indexOf(slice));
  });
}

const lb = document.createElement("div");
lb.className = "lightbox";
lb.setAttribute("role", "dialog");
lb.setAttribute("aria-modal", "true");
lb.setAttribute("aria-label", "Still preview");
lb.innerHTML = `
  <button type="button" class="lightbox-close" aria-label="Close">Close</button>
  <div class="lightbox-stage">
    <img alt="" />
    <div class="lightbox-credit" hidden>
      <div class="lb-credit-text">
        <p class="lb-kicker">Found on X</p>
        <p class="lb-title"></p>
        <p class="lb-handle"></p>
      </div>
      <a class="lb-source" target="_blank" rel="noopener noreferrer">
        <span class="lb-source-label">Open original</span>
        <span class="lb-source-arrow" aria-hidden="true">→</span>
      </a>
      <p class="lb-source-muted" hidden>Source link not recovered for this still</p>
    </div>
  </div>
`;
document.body.appendChild(lb);
const lbImg = lb.querySelector("img");
const lbCredit = lb.querySelector(".lightbox-credit");
const lbTitle = lb.querySelector(".lb-title");
const lbHandle = lb.querySelector(".lb-handle");
const lbSource = lb.querySelector(".lb-source");
const lbSourceMuted = lb.querySelector(".lb-source-muted");
const lbKicker = lb.querySelector(".lb-kicker");

function closeLightbox() {
  lb.classList.remove("is-open");
  lbSource.removeAttribute("href");
}

lb.querySelector(".lightbox-close").addEventListener("click", closeLightbox);
lb.addEventListener("click", (e) => {
  if (e.target === lb) closeLightbox();
});
// Keep clicks inside the stage from closing; source link navigates normally
lb.querySelector(".lightbox-stage")?.addEventListener("click", (e) => e.stopPropagation());

/**
 * @param {string} src
 * @param {string} [alt]
 * @param {{ title?: string, credit?: string, href?: string } | null} [meta]
 */
function openLightbox(src, alt, meta = null) {
  const title = String(meta?.title || alt || "").trim();
  const credit = String(meta?.credit || "").trim();
  const href = String(meta?.href || "").trim();
  const handle = credit.replace(/^@/, "");

  // Fail closed: never leave a broken lightbox image on screen
  lbImg.onerror = () => {
    closeLightbox();
  };
  lbImg.src = src;
  lbImg.alt = title || alt || "TasteGraph still";

  if (lbCredit) {
    lbCredit.hidden = false;
    if (lbTitle) lbTitle.textContent = title || "Public still";
    if (lbHandle) {
      if (handle) {
        lbHandle.hidden = false;
        lbHandle.textContent = `@${handle}`;
      } else {
        lbHandle.hidden = true;
        lbHandle.textContent = "";
      }
    }
    if (lbKicker) {
      lbKicker.textContent = href || handle ? "Found on X" : "Still";
    }
    if (href) {
      lbSource.hidden = false;
      lbSource.href = href;
      lbSource.setAttribute(
        "aria-label",
        handle ? `Open original post by @${handle}` : "Open original post"
      );
      if (lbSourceMuted) lbSourceMuted.hidden = true;
      const label = lbSource.querySelector(".lb-source-label");
      if (label) {
        label.textContent = handle ? `Open original · @${handle}` : "Open original post";
      }
    } else {
      lbSource.hidden = true;
      lbSource.removeAttribute("href");
      if (lbSourceMuted) {
        lbSourceMuted.hidden = false;
        lbSourceMuted.textContent = handle
          ? `Shared by @${handle} (post link not recovered)`
          : "Source link not recovered for this still";
      }
    }
  }

  lb.classList.add("is-open");
}
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeLightbox();
});

fillLegend();
loadContributingSources(); // sources catalog load

// --- View mode: Wheel | Grid (ingest archive) ---
/** @type {"wheel" | "grid"} */
let viewMode = "wheel";
/** @type {{ items?: Array<Record<string, unknown>>, count?: number } | null} */
let ingestCatalog = null;
let ingestFallback = false;
let gridFilter = "all";
let wheelRaf = 0;
let wheelLoopRunning = false;
let wheelReady = false;

const REGISTER_LABELS = {
  all: "All",
  music: "Music",
  myth: "Myth-tech",
  sketch: "Sketch",
  defensive: "Defensive",
  motion: "Motion",
  pro: "Pro UI",
  speculative: "Speculative",
  fashion: "Fashion",
};

async function loadIngestStills() {
  const base = import.meta.env.BASE_URL || "/";
  const url = `${base}ingest-stills.json?v=${GRAPH_PUBLIC_VERSION || "1"}&r=${CATALOG_BUST}`;
  try {
    const res = await fetch(url, { cache: "no-cache" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    ingestCatalog = await res.json();
    const n = Array.isArray(ingestCatalog?.items) ? ingestCatalog.items.length : 0;
    if (n < 50) throw new Error(`catalog too small (${n})`);
    ingestFallback = false;
  } catch (err) {
    console.warn("[TasteGraph pie] ingest-stills load failed", err);
    ingestFallback = true;
    // Fallback: featured wheel stills only. Do not present this as the archive.
    ingestCatalog = {
      count: 0,
      items: SLICES.flatMap((s) =>
        (s.examples || []).map((ex) => ({
          src: ex.src,
          title: ex.caption,
          credit: ex.credit,
          href: ex.href,
          registers: [s.id],
          featured: true,
          batch: "featured-wheel",
          kind: "image",
        }))
      ),
    };
  }
  buildGridFilters();
  renderIngestGrid();
}

function buildGridFilters() {
  const hostEl = document.getElementById("grid-filters");
  if (!hostEl) return;
  hostEl.innerHTML = "";
  const items = Array.isArray(ingestCatalog?.items) ? ingestCatalog.items : [];
  const present = new Set();
  items.forEach((it) => {
    (Array.isArray(it.registers) ? it.registers : []).forEach((r) => present.add(String(r)));
  });
  const order = ["all", ...SLICES.map((s) => s.id)];
  order.forEach((id) => {
    if (id !== "all" && !present.has(id)) return;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "grid-filter" + (gridFilter === id ? " is-active" : "");
    btn.dataset.filter = id;
    btn.textContent = REGISTER_LABELS[id] || id;
    btn.setAttribute("aria-pressed", gridFilter === id ? "true" : "false");
    btn.addEventListener("click", () => {
      gridFilter = id;
      buildGridFilters();
      renderIngestGrid();
    });
    hostEl.appendChild(btn);
  });
}

function renderIngestGrid() {
  const grid = document.getElementById("ingest-grid");
  const countEl = document.getElementById("grid-count");
  if (!grid) return;
  const base = import.meta.env.BASE_URL || "/";
  let items = Array.isArray(ingestCatalog?.items) ? ingestCatalog.items : [];
  if (gridFilter !== "all") {
    items = items.filter((it) => {
      const regs = Array.isArray(it.registers) ? it.registers : [];
      return regs.includes(gridFilter);
    });
  }
  const sub = document.getElementById("grid-sub");
  if (countEl) {
    if (ingestFallback) {
      countEl.textContent = `${items.length} featured only`;
    } else {
      const total = ingestCatalog?.count ?? items.length;
      countEl.textContent =
        gridFilter === "all"
          ? `${total || items.length} stills ingested`
          : `${items.length} · ${REGISTER_LABELS[gridFilter] || gridFilter}`;
    }
  }
  if (sub) {
    sub.textContent = ingestFallback
      ? "Full archive (400+ stills) failed to load. Hard-refresh. This view is the 23 featured wheel stills only."
      : "Screenshots of public posts that informed TasteGraph. Click for lightbox; open Source for the post.";
  }
  grid.innerHTML = "";
  if (!items.length) {
    const empty = document.createElement("p");
    empty.className = "ingest-empty";
    empty.textContent =
      gridFilter === "all"
        ? "No stills in the public ingest catalog yet."
        : "No stills tagged to this register. Try All.";
    grid.appendChild(empty);
    return;
  }
  items.forEach((it) => {
    const srcPath = String(it.src || "").replace(/^\//, "");
    if (!srcPath) return;
    const src = base + srcPath;
    const fig = document.createElement("figure");
    fig.className = "ingest-card is-pending";
    fig.tabIndex = 0;
    const img = document.createElement("img");
    img.alt = String(it.title || it.credit || "TasteGraph still");
    // Must be in the DOM for lazy-load; we append first then set src.
    img.loading = "lazy";
    img.decoding = "async";
    if (it.featured) {
      const badge = document.createElement("span");
      badge.className = "cap-badge";
      badge.textContent = "Featured";
      fig.appendChild(badge);
    }
    const cap = document.createElement("figcaption");
    const title = document.createElement("span");
    title.className = "cap-title";
    title.textContent = String(it.title || "Still");
    cap.appendChild(title);
    if (it.href) {
      const a = document.createElement("a");
      a.className = "cap-source";
      a.href = String(it.href);
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.textContent = it.credit ? `Source ${it.credit}` : "Source on X";
      a.addEventListener("click", (e) => e.stopPropagation());
      cap.appendChild(a);
    } else if (it.credit) {
      const cr = document.createElement("span");
      cr.className = "cap-source muted";
      cr.textContent = String(it.credit);
      cap.appendChild(cr);
    }
    fig.append(img, cap);
    const open = () =>
      openLightbox(src, String(it.title || ""), {
        title: String(it.title || ""),
        credit: String(it.credit || ""),
        href: String(it.href || ""),
      });
    fig.addEventListener("click", open);
    fig.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        open();
      }
    });
    // In DOM first so lazy can fire; hide until success; remove if broken.
    const reveal = () => {
      fig.classList.remove("is-pending");
      fig.classList.add("is-ready");
    };
    const drop = () => {
      fig.remove();
      img.removeAttribute("src");
    };
    img.onload = reveal;
    img.onerror = drop;
    grid.appendChild(fig);
    img.src = src;
    if (img.complete) {
      if (img.naturalWidth > 0) reveal();
      else drop();
    }
  });
}

function setViewMode(mode, { pushUrl = true } = {}) {
  const next = mode === "grid" ? "grid" : "wheel";
  viewMode = next;
  const wheelStage = document.getElementById("stage-wheel");
  const gridStage = document.getElementById("stage-grid");
  const wheelBtn = document.getElementById("view-wheel");
  const gridBtn = document.getElementById("view-grid");
  const footPrimary = document.getElementById("foot-primary");
  const isGrid = next === "grid";

  document.body.classList.toggle("is-grid-view", isGrid);

  if (wheelStage) {
    wheelStage.classList.toggle("is-hidden", isGrid);
    wheelStage.hidden = isGrid;
  }
  if (gridStage) {
    gridStage.classList.toggle("is-hidden", !isGrid);
    gridStage.hidden = !isGrid;
  }
  if (wheelBtn) {
    wheelBtn.classList.toggle("is-active", !isGrid);
    wheelBtn.setAttribute("aria-selected", !isGrid ? "true" : "false");
  }
  if (gridBtn) {
    gridBtn.classList.toggle("is-active", isGrid);
    gridBtn.setAttribute("aria-selected", isGrid ? "true" : "false");
  }
  if (hintEl) {
    hintEl.textContent = isGrid
      ? "Scroll the archive · Click a still · Filter by register"
      : "Drag to orbit · Scroll to zoom · Hover a slice";
  }
  if (footPrimary) {
    footPrimary.textContent = isGrid
      ? "Public-art stills · source-linked when known"
      : "Exact arcs · sum 100% = 360°";
  }

  if (wheelReady && typeof controls !== "undefined" && controls) {
    controls.autoRotate = !isGrid && !reduceMotion;
    controls.enabled = !isGrid;
  }

  if (isGrid) {
    wheelLoopRunning = false;
    if (!ingestCatalog) loadIngestStills();
    else renderIngestGrid();
  } else if (wheelReady) {
    startWheelLoop();
    requestAnimationFrame(() => {
      try {
        resize();
      } catch {
        /* resize not bound yet */
      }
    });
  }

  if (pushUrl) {
    try {
      const url = new URL(window.location.href);
      if (isGrid) url.searchParams.set("view", "grid");
      else url.searchParams.delete("view");
      // Keep path; replace history without reload
      window.history.replaceState({ view: next }, "", url.pathname + url.search + url.hash);
    } catch {
      /* ignore */
    }
  }
}

function initViewToggle() {
  document.querySelectorAll(".view-btn[data-view]").forEach((btn) => {
    btn.addEventListener("click", () => setViewMode(btn.getAttribute("data-view") || "wheel"));
  });
  let initial = "wheel";
  try {
    const params = new URLSearchParams(window.location.search);
    const q = (params.get("view") || "").toLowerCase();
    const hash = (window.location.hash || "").replace(/^#/, "").toLowerCase();
    if (q === "grid" || hash === "grid") initial = "grid";
  } catch {
    /* ignore */
  }
  setViewMode(initial, { pushUrl: false });
}

// Catalog preloads early so first Grid click is instant.
loadIngestStills();

// --- Three ---
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0b10);

const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
camera.position.set(0, 6.5, 8.5);

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: false,
  powerPreference: "high-performance",
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.25;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
host.appendChild(renderer.domElement);

// Environment for materials to read
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.07;
controls.minDistance = 5;
controls.maxDistance = 16;
controls.maxPolarAngle = Math.PI * 0.49;
controls.target.set(0, 0.4, 0);
controls.enablePan = false;
controls.autoRotate = !reduceMotion;
controls.autoRotateSpeed = 0.6;

// Lights - richer gold key + cool fill + rim
scene.add(new THREE.AmbientLight(0xffffff, 0.38));
const key = new THREE.DirectionalLight(0xfff1d6, 2.15);
key.position.set(5.5, 11, 4.5);
key.castShadow = true;
key.shadow.mapSize.set(2048, 2048);
key.shadow.camera.near = 1;
key.shadow.camera.far = 30;
key.shadow.camera.left = -8;
key.shadow.camera.right = 8;
key.shadow.camera.top = 8;
key.shadow.camera.bottom = -8;
key.shadow.bias = -0.00025;
scene.add(key);
scene.add(new THREE.DirectionalLight(0x7eb8d8, 0.7).translateX(-7).translateY(5).translateZ(-4));
const rimLight = new THREE.DirectionalLight(0xd4a85a, 0.55);
rimLight.position.set(-2, 3, 8);
scene.add(rimLight);
const hemi = new THREE.HemisphereLight(0xf0e8d8, 0x0a0c14, 0.72);
scene.add(hemi);

/** Procedural maps: brushed enamel + noise grain for each register color. */
function makeSliceMaps(baseHex, accentHex, seed = 1) {
  const size = 256;
  const color = document.createElement("canvas");
  color.width = size;
  color.height = size;
  const cctx = color.getContext("2d");
  const bh = `#${baseHex.toString(16).padStart(6, "0")}`;
  const ah = `#${accentHex.toString(16).padStart(6, "0")}`;
  // radial enamel falloff
  const g = cctx.createRadialGradient(size * 0.35, size * 0.3, size * 0.05, size * 0.5, size * 0.55, size * 0.72);
  g.addColorStop(0, ah);
  g.addColorStop(0.35, bh);
  g.addColorStop(1, "#0a0b10");
  cctx.fillStyle = g;
  cctx.fillRect(0, 0, size, size);
  // brushed streaks
  cctx.globalAlpha = 0.12;
  for (let i = 0; i < 90; i++) {
    const y = ((i * 37 + seed * 13) % size);
    cctx.strokeStyle = i % 3 === 0 ? "#ffffff" : "#000000";
    cctx.lineWidth = 1 + (i % 2);
    cctx.beginPath();
    cctx.moveTo(0, y);
    cctx.lineTo(size, y + ((i % 5) - 2));
    cctx.stroke();
  }
  // grain
  cctx.globalAlpha = 0.18;
  for (let i = 0; i < 4200; i++) {
    const x = (Math.sin(seed * 12.3 + i * 1.7) * 0.5 + 0.5) * size;
    const y = (Math.cos(seed * 9.1 + i * 2.3) * 0.5 + 0.5) * size;
    cctx.fillStyle = i % 2 ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.55)";
    cctx.fillRect(x, y, 1.2, 1.2);
  }
  // gold fleck
  cctx.globalAlpha = 0.22;
  cctx.fillStyle = "#e8c98a";
  for (let i = 0; i < 80; i++) {
    const x = ((i * 97 + seed * 41) % size);
    const y = ((i * 53 + seed * 19) % size);
    cctx.fillRect(x, y, 1.5, 1.5);
  }
  cctx.globalAlpha = 1;

  const rough = document.createElement("canvas");
  rough.width = size;
  rough.height = size;
  const rctx = rough.getContext("2d");
  rctx.fillStyle = "#6a6a6a";
  rctx.fillRect(0, 0, size, size);
  for (let i = 0; i < 3000; i++) {
    const x = (i * 61 + seed * 7) % size;
    const y = (i * 29 + seed * 3) % size;
    const v = 40 + ((i * 17) % 160);
    rctx.fillStyle = `rgb(${v},${v},${v})`;
    rctx.fillRect(x, y, 2, 2);
  }
  // smoother bands
  rctx.globalAlpha = 0.35;
  for (let y = 0; y < size; y += 6) {
    const v = 90 + (y % 40);
    rctx.fillStyle = `rgb(${v},${v},${v})`;
    rctx.fillRect(0, y, size, 3);
  }

  const map = new THREE.CanvasTexture(color);
  map.colorSpace = THREE.SRGBColorSpace;
  map.wrapS = map.wrapT = THREE.RepeatWrapping;
  map.repeat.set(1.2, 1.2);
  map.anisotropy = 4;

  const roughnessMap = new THREE.CanvasTexture(rough);
  roughnessMap.wrapS = roughnessMap.wrapT = THREE.RepeatWrapping;
  roughnessMap.repeat.set(1.6, 1.6);

  // reuse color as bump source (desaturated feel via roughness pairing)
  const bumpMap = map.clone();
  bumpMap.colorSpace = THREE.NoColorSpace;

  return { map, roughnessMap, bumpMap };
}

function makeGroundTexture() {
  const size = 512;
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  const ctx = c.getContext("2d");
  const g = ctx.createRadialGradient(size / 2, size / 2, size * 0.08, size / 2, size / 2, size * 0.5);
  g.addColorStop(0, "#1a1d28");
  g.addColorStop(0.55, "#101218");
  g.addColorStop(1, "#07080c");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  ctx.globalAlpha = 0.15;
  for (let i = 0; i < 8000; i++) {
    ctx.fillStyle = i % 2 ? "#ffffff" : "#000000";
    ctx.fillRect(Math.random() * size, Math.random() * size, 1, 1);
  }
  // faint gold ring etch
  ctx.globalAlpha = 0.2;
  ctx.strokeStyle = "#d4a85a";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size * 0.31, 0, Math.PI * 2);
  ctx.stroke();
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// Ground disc
const ground = new THREE.Mesh(
  new THREE.CircleGeometry(6.4, 96),
  new THREE.MeshStandardMaterial({
    map: makeGroundTexture(),
    color: 0xffffff,
    metalness: 0.22,
    roughness: 0.88,
  })
);
ground.rotation.x = -Math.PI / 2;
ground.position.y = 0;
ground.receiveShadow = true;
scene.add(ground);

// Gold guide ring - slightly brighter bevel presence
const ring = new THREE.Mesh(
  new THREE.TorusGeometry(3.22, 0.028, 16, 128),
  new THREE.MeshPhysicalMaterial({
    color: 0xd4a85a,
    metalness: 0.92,
    roughness: 0.22,
    emissive: 0xd4a85a,
    emissiveIntensity: 0.32,
    clearcoat: 0.55,
    clearcoatRoughness: 0.25,
  })
);
ring.rotation.x = Math.PI / 2;
ring.position.y = 0.03;
scene.add(ring);

// Soft gold dust particles around pie (disabled for reduced motion)
let dust = null;
if (!reduceMotion) {
  const dustCount = 140;
  const dustGeo = new THREE.BufferGeometry();
  const pos = new Float32Array(dustCount * 3);
  for (let i = 0; i < dustCount; i++) {
    const a = Math.random() * Math.PI * 2;
    const r = 2.2 + Math.random() * 2.4;
    pos[i * 3] = Math.cos(a) * r;
    pos[i * 3 + 1] = 0.2 + Math.random() * 1.6;
    pos[i * 3 + 2] = Math.sin(a) * r;
  }
  dustGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  dust = new THREE.Points(
    dustGeo,
    new THREE.PointsMaterial({
      color: 0xe8c98a,
      size: 0.035,
      transparent: true,
      opacity: 0.45,
      depthWrite: false,
      sizeAttenuation: true,
    })
  );
  scene.add(dust);
}

const INNER = 0.85;
const OUTER = 3.0;
const DEPTH = 0.65;
const HOVER_LIFT = 0.28;

const pie = new THREE.Group();
pie.position.y = 0.04;
scene.add(pie);

const sliceMeshes = [];

/**
 * Ring sector in shape XY, then extruded and laid flat on XZ.
 * Angles: standard math (0 = +X, CCW). Clockwise-from-12 mapped outside.
 */
function makeRingSector(startAngle, endAngle) {
  // Always draw CCW from min span? We want wedge of size (startAngle - endAngle) clockwise.
  // Convert: outer arc goes from startAngle to endAngle clockwise (clockwise = true in absarc).
  const shape = new THREE.Shape();
  shape.absarc(0, 0, OUTER, startAngle, endAngle, true);
  shape.absarc(0, 0, INNER, endAngle, startAngle, false);

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: DEPTH,
    bevelEnabled: true,
    bevelThickness: 0.045,
    bevelSize: 0.04,
    bevelSegments: 3,
    curveSegments: 64,
  });
  // Extrude along +Z; lay flat: Z becomes Y height
  geo.rotateX(-Math.PI / 2);
  return geo;
}

// 12 o'clock in shape space = +Y = PI/2
// Clockwise theta degrees from 12 o'clock:
// angle = PI/2 - thetaRad
let cursorDeg = 0;
SLICES.forEach((slice, index) => {
  const startDeg = cursorDeg;
  const endDeg = cursorDeg + slice.deg;
  cursorDeg = endDeg;

  const startAngle = Math.PI / 2 - THREE.MathUtils.degToRad(startDeg);
  const endAngle = Math.PI / 2 - THREE.MathUtils.degToRad(endDeg);
  const midAngle = (startAngle + endAngle) / 2;

  const geo = makeRingSector(startAngle, endAngle);
  // lift so bottom sits on ground
  geo.translate(0, DEPTH / 2, 0);
  geo.computeVertexNormals();

  const face = FACE[slice.id] ?? slice.color;
  const maps = makeSliceMaps(face, slice.accent, index + 1);
  const mat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    map: maps.map,
    roughnessMap: maps.roughnessMap,
    bumpMap: maps.bumpMap,
    bumpScale: 0.035,
    metalness: 0.28,
    roughness: 0.48,
    emissive: slice.accent,
    emissiveIntensity: 0.16,
    envMapIntensity: 1.15,
    clearcoat: 0.42,
    clearcoatRoughness: 0.28,
    sheen: 0.35,
    sheenRoughness: 0.55,
    sheenColor: new THREE.Color(slice.rim),
    side: THREE.DoubleSide,
  });

  const mesh = new THREE.Mesh(geo, mat);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.userData = {
    index,
    slice,
    targetY: 0,
    midAngle,
    baseEmissive: 0.16,
    hoverEmissive: 0.38,
  };

  // bright top edge lines
  const edges = new THREE.EdgesGeometry(geo, 22);
  mesh.add(
    new THREE.LineSegments(
      edges,
      new THREE.LineBasicMaterial({
        color: slice.rim,
        transparent: true,
        opacity: 0.72,
      })
    )
  );

  pie.add(mesh);
  sliceMeshes.push(mesh);

  // Label above mid of slice
  // After rotateX(-90): shape (x,y) -> world (x, h, -y)
  const label = makeLabelSprite(slice.short, `${slice.pct}%`, slice.rim);
  const lr = (INNER + OUTER) * 0.52;
  label.position.set(
    Math.cos(midAngle) * lr,
    DEPTH + 0.35,
    -Math.sin(midAngle) * lr
  );
  pie.add(label);
  mesh.userData.label = label;
  mesh.userData.labelBaseY = DEPTH + 0.35;
});

// Center hub - polished metal core
const hubMaps = makeSliceMaps(0x161922, 0xd4a85a, 99);
const hubMat = new THREE.MeshPhysicalMaterial({
  color: 0xffffff,
  map: hubMaps.map,
  roughnessMap: hubMaps.roughnessMap,
  bumpMap: hubMaps.bumpMap,
  bumpScale: 0.02,
  metalness: 0.72,
  roughness: 0.28,
  emissive: 0xd4a85a,
  emissiveIntensity: 0.22,
  clearcoat: 0.65,
  clearcoatRoughness: 0.2,
  envMapIntensity: 1.3,
});
const hub = new THREE.Mesh(new THREE.CylinderGeometry(INNER - 0.06, INNER - 0.06, DEPTH + 0.12, 64), hubMat);
hub.position.y = DEPTH / 2 + 0.02;
hub.castShadow = true;
pie.add(hub);

const hubLabel = makeLabelSprite("TASTEGRAPH", GRAPH_PUBLIC_VERSION || "1.3.4", 0xd4a85a);
hubLabel.position.set(0, DEPTH + 0.5, 0);
hubLabel.scale.set(1.5, 0.75, 1);
pie.add(hubLabel);

// Soft contact shadow disc under pie
const shadowMat = new THREE.MeshBasicMaterial({
  color: 0x000000,
  transparent: true,
  opacity: 0.35,
  depthWrite: false,
});
const shadowDisc = new THREE.Mesh(new THREE.CircleGeometry(3.1, 48), shadowMat);
shadowDisc.rotation.x = -Math.PI / 2;
shadowDisc.position.y = 0.02;
pie.add(shadowDisc);

function makeLabelSprite(title, sub, color) {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 256;
  const ctx = c.getContext("2d");
  ctx.clearRect(0, 0, 512, 256);
  // plate
  ctx.fillStyle = "rgba(12, 13, 18, 0.88)";
  roundRect(ctx, 56, 56, 400, 144, 26);
  ctx.fill();
  ctx.strokeStyle = `#${Number(color).toString(16).padStart(6, "0")}`;
  ctx.globalAlpha = 0.7;
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.globalAlpha = 1;
  ctx.fillStyle = `#${Number(color).toString(16).padStart(6, "0")}`;
  ctx.font = "700 44px Satoshi, Segoe UI, system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(title, 256, 120);
  ctx.fillStyle = "#d8d2c6";
  ctx.font = "600 34px Satoshi, Segoe UI, system-ui, sans-serif";
  ctx.fillText(sub, 256, 168);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  const spr = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false })
  );
  spr.scale.set(1.25, 0.62, 1);
  return spr;
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// Interaction
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2(2, 2); // offscreen default
let activeIndex = -1;
let overCanvas = false;

function setActive(index) {
  activeIndex = index;
  sliceMeshes.forEach((m, i) => {
    const on = i === index;
    m.userData.targetY = on ? HOVER_LIFT : 0;
    const baseE = m.userData.baseEmissive ?? 0.16;
    const hoverE = m.userData.hoverEmissive ?? 0.38;
    m.userData.targetEmissive = on ? hoverE : baseE;
    if (m.userData.label) {
      m.userData.label.material.opacity = on ? 1 : 0.9;
      m.userData.label.scale.set(on ? 1.4 : 1.25, on ? 0.7 : 0.62, 1);
    }
  });
  setPanel(index >= 0 ? SLICES[index] : null);
  if (hintEl) {
    hintEl.textContent =
      index >= 0
        ? `${SLICES[index].name} - ${SLICES[index].pct}%`
        : "Drag to orbit - Scroll to zoom - Hover a slice";
  }
}

function onPointerMove(event) {
  const rect = renderer.domElement.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  overCanvas = true;
}

renderer.domElement.addEventListener("pointermove", onPointerMove);
renderer.domElement.addEventListener("pointerenter", () => {
  if (!reduceMotion) controls.autoRotate = false;
});
renderer.domElement.addEventListener("pointerleave", () => {
  overCanvas = false;
  pointer.set(2, 2);
  if (!reduceMotion) controls.autoRotate = true;
});
renderer.domElement.addEventListener("pointerdown", () => {
  renderer.domElement.style.cursor = "grabbing";
  if (!reduceMotion) controls.autoRotate = false;
});
renderer.domElement.addEventListener("pointerup", () => {
  renderer.domElement.style.cursor = "grab";
});

function pick() {
  if (!overCanvas) return;
  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObjects(sliceMeshes, false);
  if (hits.length) {
    const idx = hits[0].object.userData.index;
    if (idx !== activeIndex) setActive(idx);
    renderer.domElement.style.cursor = "pointer";
  } else {
    renderer.domElement.style.cursor = "grab";
  }
}

function resize() {
  const w = Math.max(host.clientWidth, 1);
  const h = Math.max(host.clientHeight, 1);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h, false);
}
window.addEventListener("resize", resize);
// ensure layout has settled
requestAnimationFrame(() => {
  resize();
  // force a second pass after fonts/layout
  setTimeout(resize, 100);
});

const clock = new THREE.Clock();
function tick() {
  if (viewMode !== "wheel") {
    wheelLoopRunning = false;
    wheelRaf = 0;
    return;
  }
  const dt = Math.min(clock.getDelta(), 0.05);
  pick();

  sliceMeshes.forEach((m) => {
    m.position.y = THREE.MathUtils.damp(m.position.y, m.userData.targetY, 12, dt);
    const te = m.userData.targetEmissive ?? m.userData.baseEmissive ?? 0.16;
    m.material.emissiveIntensity = THREE.MathUtils.damp(m.material.emissiveIntensity, te, 10, dt);
    if (m.userData.label) {
      m.userData.label.position.y = m.userData.labelBaseY + m.position.y;
    }
  });

  if (dust && !reduceMotion) {
    dust.rotation.y += dt * 0.08;
    const arr = dust.geometry.attributes.position.array;
    const t = clock.elapsedTime;
    for (let i = 0; i < arr.length; i += 3) {
      arr[i + 1] += Math.sin(t * 0.7 + i) * 0.0008;
    }
    dust.geometry.attributes.position.needsUpdate = true;
  }

  controls.update();
  renderer.render(scene, camera);
  wheelRaf = requestAnimationFrame(tick);
}

function startWheelLoop() {
  if (!wheelReady) return;
  if (viewMode !== "wheel") return;
  if (wheelLoopRunning) return;
  wheelLoopRunning = true;
  wheelRaf = requestAnimationFrame(tick);
}

// Keyboard: cycle slices (wheel mode only)
window.addEventListener("keydown", (e) => {
  if (viewMode !== "wheel") return;
  if (e.key === "ArrowRight" || e.key === "ArrowDown") {
    e.preventDefault();
    setActive((activeIndex + 1 + SLICES.length) % SLICES.length);
  } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
    e.preventDefault();
    setActive((activeIndex - 1 + SLICES.length) % SLICES.length);
  } else if (e.key === "Escape" && !lb.classList.contains("is-open")) {
    // re-focus Myth-tech (Kali default)
    setActive(1);
  }
});

// Default Myth-tech so Kali stills show immediately (Music was mostly old-looking)
setActive(1);

// Three is ready - wire view toggle and start wheel loop if needed
wheelReady = true;
initViewToggle();
if (viewMode === "wheel") startWheelLoop();

// Hide boot overlay after first paint
function hideBoot() {
  const boot = document.getElementById("boot");
  if (boot) boot.classList.add("is-done");
}
requestAnimationFrame(() => {
  if (viewMode === "wheel") renderer.render(scene, camera);
  hideBoot();
});
setTimeout(hideBoot, 900);

window.__tastePie = { setActive, SLICES, sliceMeshes, scene, camera, setViewMode };
console.info("[TasteGraph pie] slices:", sliceMeshes.length);
