'use strict';
// Preserve the approved image composition; crop viewports expose only each photograph.
window.LOVE_PROJECT = {
  id: 'love',
  title: 'LOVE',
  category: 'Objects',
  subtitle: 'Character, objects & imagined futures',
  summary: 'A companion with a story. Three studies bring LOVE into focus through a portrait, a sculptural charging object and a seated character study.',
  note: 'Product concept studies for SYMB10. These AI-assisted visualisations explore an imagined companion and its objects; they are not photographs of working hardware.',
  images: [
    {
      src: 'assets/love/approved-study.webp',
      width: 592, height: 584,
      alt: 'Presence — LOVE with pale pink hair and an ivory blouse against a soft pink background',
      crop: { x: 44, y: 296, width: 592, height: 584, sourceWidth: 1536, sourceHeight: 1024 }
    },
    {
      src: 'assets/love/approved-study.webp',
      width: 432, height: 584,
      alt: 'Objects — graphite and ivory charging concept with a vermilion accent, matching case and accessories',
      crop: { x: 648, y: 296, width: 432, height: 584, sourceWidth: 1536, sourceHeight: 1024 }
    },
    {
      src: 'assets/love/approved-study.webp',
      width: 400, height: 584,
      alt: 'Character — LOVE seated on a pink ottoman in an ivory blouse, dark trousers and white trainers',
      crop: { x: 1092, y: 296, width: 400, height: 584, sourceWidth: 1536, sourceHeight: 1024 }
    }
  ]
};
