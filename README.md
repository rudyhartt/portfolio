# Rudy Hartt — Portfolio

A responsive portfolio of 13 project galleries, 55 original artwork images and two films, created from the supplied NewPortfolio archive.

## Site

https://rudyhartt.github.io/portfolio/

V2 connects three visual worlds in sequence: **Paper Riot → Electric Playground → Hyperdream**. Eight featured original projects sit between the worlds, under one RUDY HARTT masthead and one main navigation. The three panoramas are AI-assisted collage interpretations of the supplied original artwork; the project galleries retain the originals.

A buildless static website with category filtering, deep links to projects, keyboard-accessible artwork viewers, native video playback, an about section and email contact. No framework, third-party scripts, tracking, backend or paid service is required.

GitHub Pages serves the root of `main`. This repository intentionally has no CNAME or custom domain configuration. It is independent of all other repositories and websites.

The original design is preserved on the [V1 branch](https://github.com/rudyhartt/portfolio/tree/V1), at commit [`102b4fec8bdb5e9458d3a804ce076d67b3cb0a80`](https://github.com/rudyhartt/portfolio/tree/102b4fec8bdb5e9458d3a804ce076d67b3cb0a80).

## Editing

- `index.html`: three-world sequence, featured projects, biography, contact details and metadata.
- `projects.js`: project order, titles, categories, descriptions, image captions and video sources.
- `immersive.css`: V2 layout, transitions, responsive typography and colour.
- `style.css`: shared base styles, project dialogs and artwork viewer.
- `app.js`: filters, project dialogs, image viewer and hash navigation.
- `assets/`: optimised WebP images, H.264 MP4 films and a DejaVu Sans Bold display-font subset (`display.woff`, with `FONT-LICENSE.txt`).
- `assets/world-{paper,electric,hyperdream}.webp`: collage panoramas, each with a `-small.webp` responsive variant.
- `source-assets.csv`: a mapping back to original supplied asset filenames.

To add a project, add an entry to `window.PORTFOLIO_PROJECTS` in `projects.js`, include its assets, and choose an existing filter category. Gallery artwork is displayed without cropping; cover images are cropped for presentation.

For local preview, serve this directory with any static HTTP server, for example `python3 -m http.server 8000`, then open localhost:8000. No build step is needed.

## Source notes

Project groupings and descriptions were prepared from the supplied artwork and professional background documents. Unverified commissions are not presented as client relationships. Studio Ghibli is labelled as an independent concept. Existing brand and character rights remain with their respective owners.

The original ZIP, Pages document and profile/CV PDFs are not published. The biography draws on the professional documents; the public contact uses the supplied professional email. Unused institutional logos are excluded from the deployed assets.

## Validation

Run `node --check app.js`, `node --check projects.js`, and `python3 scripts/check_site.py`. The asset check covers the retained catalogue, one H1 and main navigation, chapter order, featured project links, responsive image sources and CSS asset URLs. All local links and asset paths must work within the GitHub Pages project subdirectory.

Before publishing, check desktop and 390px mobile layouts, filters, featured project links, gallery navigation, artwork enlargement, Escape handling, focus restoration and video playback. Invalid project URLs should return safely to the work section. These are verification instructions, not a claim that a particular revision has passed browser review.

Copyright © Rudy Hartt. All rights reserved for original portfolio artwork and content. No blanket licence is granted to third-party brands or characters. The bundled font retains its accompanying licence.
