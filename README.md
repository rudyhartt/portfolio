# Rudy Hartt — Portfolio

A responsive portfolio of 13 project galleries, 55 artwork images and two films, created from the supplied NewPortfolio archive.

## Site

https://rudyhartt.github.io/portfolio/

A buildless static website with category filtering, deep links to projects, keyboard-accessible artwork viewers, native video playback, an about section and email contact. No framework, third-party scripts, tracking, backend or paid service is required.

GitHub Pages serves the root of `main`. This repository intentionally has no CNAME or custom domain configuration. It is independent of all other repositories and websites.

## Editing

- `index.html`: introduction, biography, contact details and metadata.
- `projects.js`: project order, titles, categories, descriptions, image captions and video sources.
- `style.css`: responsive layout, typography and colour.
- `app.js`: filters, project dialogs, image viewer and hash navigation.
- `assets/`: optimised WebP images and H.264 MP4 films.
- `source-assets.csv`: a mapping back to original supplied asset filenames.

To add a project, add an entry to `window.PORTFOLIO_PROJECTS` in `projects.js`, include its assets, and choose an existing filter category. Gallery artwork is displayed without cropping; cover images are cropped for presentation.

For local preview, serve this directory with any static HTTP server, for example `python3 -m http.server 8000`, then open localhost:8000. No build step is needed. Run `node --check app.js`, `node --check projects.js`, and `python3 scripts/check_site.py` for basic validation.

## Source notes

Project groupings and descriptions were prepared from the supplied artwork and professional background documents. Unverified commissions are not presented as client relationships. Studio Ghibli is labelled as an independent concept. Existing brand and character rights remain with their respective owners.

The original ZIP, Pages document and profile/CV PDFs are not published. The biography draws on the professional documents; the public contact uses the supplied professional email. Unused institutional logos are excluded from the deployed assets.

## Verification

Checked desktop and 390px mobile layouts, filtering, project navigation, artwork enlargement, Escape handling and video playback. Media files were decoded and video codecs verified. Invalid project URLs safely return to the work section. All links and asset paths are relative to support a GitHub Pages project subdirectory.

Copyright © Rudy Hartt. All rights reserved for original portfolio artwork and content. No blanket licence is granted to third-party brands or characters.
