# Thrive Course Map Prototype

A static prototype for turning Thrive Collective's `When Willpower Fails` resources into a soft, map-led learning experience.

## What This Is

- A browser-only prototype.
- No backend required.
- Progress is saved in the learner's browser with `localStorage`.
- Built to deploy cleanly on Cloudflare Pages.

## Local Preview

Open `index.html` in a browser.

## Cloudflare Pages

Use these settings:

- Framework preset: `None`
- Build command: leave blank
- Build output directory: `/`

The `_headers` file marks the prototype as `noindex` so search engines should not index it.

## Not Included

The WhatsApp export and source extraction folder are intentionally ignored by Git and should not be deployed.
