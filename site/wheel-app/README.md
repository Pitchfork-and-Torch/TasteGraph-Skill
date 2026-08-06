# TasteGraph 3D Pie (local)

Interactive Three.js decision-weight wheel for TasteGraph (public product chrome).

**Cadence:** rebuild/redeploy only on milestones, structural reweight, or explicit "update the pie" - not after every private love batch. Private graph stays offline.

**Last public pie refresh:** graph **1.3.7** - Wheel + Grid toggle; full public-art ingest stills archive.

## Source links (standing - non-negotiable)

When an example still comes from a **public** art / design / type / UI tweet (or similar public post), **always** include source fields:

```js
{
  src: "examples/<register>/0N.jpg",
  caption: "Short visual description",
  credit: "@public_handle",
  href: "https://x.com/public_handle/status/<post_id>",
}
```

- `credit` + `href` together render as **Source @handle** in the detail gallery.
- Caption-only public-art stills are incomplete. Do not ship without a link when the URL is known.
- Synthetic stills may omit `href`; use credit like `Synthetic sample`.
- Never invent post IDs. Never put private machine paths in captions.

Gate before ship: hover every slice and confirm each non-synthetic example opens the correct post.

## Public update log (standing)

Every material public wheel or site ship must append a newest-first entry to:

- `site/public/updates/index.html`
- `site/public/updates/log.json`

Live: https://tastegraph.jonbailey.xyz/updates/

## Run

```bash
cd site/wheel-app
npm install
npm run dev
```

Open http://127.0.0.1:5177/

## Build into site

```bash
npm run build
# copy dist/* -> ../public/wheel/
```

Deploy from `site/`:

```bash
npx wrangler pages deploy public --project-name=tastegraph-jonbailey
```

## Ingest grid (secondary view)

Toggle **Wheel | Grid** in the top bar (or open `/wheel/?view=grid`).

The grid lists every public-art still compressed from offline love-batch screenshots into
`public/ingest/`, catalogued by `public/ingest-stills.json`.

Regenerate on the operator machine (needs offline `~/.grok/meta-collab-os/references/love-*`):

```bash
npm run build-ingest
```

Then `npm run build` and copy `dist/*` into `../public/wheel/`.

## Features

- Exact slice angles (sum 360 deg)
- Hover / legend focus lifts a wedge
- Detail panel with meaning + example stills + **source links**
- **Grid view** of the full ingest still archive (filter by register)
- Orbit drag, zoom, slow auto-spin (respects reduced motion)
- Lightbox for examples
