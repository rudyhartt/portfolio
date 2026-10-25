'use strict';
const projects = window.PORTFOLIO_PROJECTS || [];
const grid = document.querySelector('#project-grid');
const projectDialog = document.querySelector('#project-dialog');
const lightbox = document.querySelector('#lightbox');
const filters = ['All work', 'Identity', 'Digital', 'Objects', 'Spaces', 'Moving image', 'Visual studies'];
let currentProject = null;
let currentImage = 0;
let lastFocus = null;
const escapeHTML = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const imgTag = (art, thumbnail = false) => `<img src="${escapeHTML(thumbnail ? art.thumb || art.src : art.src)}" alt="${escapeHTML(art.alt)}" width="${art.width}" height="${art.height}"${art.background ? ` style="background-color:${escapeHTML(art.background)}"` : ''} loading="lazy" decoding="async">`;

document.querySelector('#year').textContent = new Date().getFullYear();
document.querySelector('#total-count').textContent = String(projects.length).padStart(2, '0');
const artworkCount = projects.reduce((total, project) => total + project.images.length + (project.videos || []).length, 0);
document.querySelector('#archive-summary').textContent = `${projects.length} collections / ${artworkCount} works / open a gallery`;
function renderFeaturedWork(selector, selections) {
  const container = document.querySelector(selector);
  if (!container) return;
  container.innerHTML = selections.map(([id, source, title]) => {
    const project = projects.find(item => item.id === id);
    if (!project) return '';
    const art = project.images.find(item => item.src === source) || project.cover;
    return `<a class="feature" href="#project/${escapeHTML(id)}" aria-label="View ${escapeHTML(project.title)}"><figure><div class="feature-art">${imgTag(art)}</div><figcaption><div><h3>${escapeHTML(title)}</h3><p>${escapeHTML(project.subtitle)}</p></div><span class="feature-arrow" aria-hidden="true">↗</span></figcaption></figure></a>`;
  }).join('');
}
renderFeaturedWork('#new-work-grid', [
  ['pool-collage-studies', 'assets/pool/b3-1.webp', 'Pop collisions.'],
  ['pool-objects-with-personality', 'assets/pool/6n-7.webp', 'Small things. Big personalities.'],
  ['pool-pop-fizz', 'assets/pool/7z-9.webp', 'Pop, fizz & colour.'],
  ['pool-character-cast', 'assets/pool/6b-1.webp', 'A cast of characters.']
]);
renderFeaturedWork('#new-motion-grid', [
  ['pool-future-faces', 'assets/pool/7z-8.webp', 'Future faces.'],
  ['pool-printed-imaginations', 'assets/pool/7j-6.webp', 'Printed imaginations.']
]);
renderFeaturedWork('#artist-feature-grid', window.ARTIST_FEATURED || []);
grid.innerHTML = projects.map((project, i) => `<article class="project-card" data-category="${escapeHTML(project.category)}"><a href="#project/${project.id}" aria-label="View ${escapeHTML(project.title)}"><div class="project-cover">${imgTag(project.cover, true)}<span class="project-category">${escapeHTML(project.category)}</span><span class="project-open" aria-hidden="true">↗</span></div><div class="project-info"><h3>${escapeHTML(project.title)}</h3><span>${String(i + 1).padStart(2, '0')} / ${String(projects.length).padStart(2, '0')}</span></div><p class="project-subtitle">${escapeHTML(project.subtitle)}</p></a></article>`).join('');
const availableFilters = filters.filter(category => category === 'All work' || projects.some(p => p.category === category));
document.querySelector('.filters').innerHTML = availableFilters.map((category, i) => `<button type="button" aria-pressed="${i === 0}" data-filter="${escapeHTML(category)}">${escapeHTML(category)}</button>`).join('');
document.querySelector('.filters').addEventListener('click', event => {
  const button = event.target.closest('button');
  if (!button) return;
  document.querySelectorAll('[data-filter]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
  let visible = 0;
  document.querySelectorAll('.project-card').forEach(card => { card.hidden = button.dataset.filter !== 'All work' && card.dataset.category !== button.dataset.filter; if (!card.hidden) visible++; });
  document.querySelector('#filter-status').textContent = `${visible} ${visible === 1 ? 'project' : 'projects'} shown for ${button.dataset.filter}.`;
});

function showProject(id) {
  const project = projects.find(p => p.id === id);
  if (!project) return;
  if (lightbox.open) lightbox.close();
  if (!projectDialog.open) lastFocus = document.activeElement;
  projectDialog.querySelectorAll('video').forEach(video => video.pause());
  currentProject = project;
  const videos = (project.videos || []).map(video => `<figure class="video-figure"><video controls playsinline preload="none" poster="${escapeHTML(video.poster)}" aria-label="${escapeHTML(video.title)}"><source src="${escapeHTML(video.src)}" type="video/mp4">Your browser does not support video. <a href="${escapeHTML(video.src)}">Open the film</a>.</video><figcaption>${escapeHTML(video.title)}</figcaption></figure>`).join('');
  document.querySelector('#project-content').innerHTML = `<div class="detail-heading"><div><p class="eyebrow">${escapeHTML(project.category)}</p><h2 id="detail-title">${escapeHTML(project.title)}</h2></div><div class="detail-description"><p>${escapeHTML(project.summary)}</p>${project.note ? `<p class="project-note">${escapeHTML(project.note)}</p>` : ''}</div></div><div class="detail-gallery">${videos}${project.images.map((art, i) => `<figure${art.width > art.height * 1.5 ? ' class="full"' : ''}><button class="artwork-button" data-image="${i}" aria-label="Enlarge: ${escapeHTML(art.alt)}">${imgTag(art)}</button><figcaption>${escapeHTML(art.alt)}</figcaption></figure>`).join('')}</div>`;
  if (!projectDialog.open) projectDialog.showModal();
  document.body.classList.add('modal-open');
  projectDialog.scrollTop = 0;
  document.querySelector('#close-project').focus({preventScroll:true});
}
function closeProject() {
  if (lightbox.open) lightbox.close();
  projectDialog.querySelectorAll('video').forEach(video => video.pause());
  if (projectDialog.open) projectDialog.close();
  document.body.classList.remove('modal-open');
  if (location.hash.startsWith('#project/')) history.replaceState(null, '', location.pathname + location.search + '#work');
  if (lastFocus instanceof HTMLElement) lastFocus.focus({preventScroll:true});
}
function route() {
  if (location.hash.startsWith('#project/')) {
    let id;
    try { id = decodeURIComponent(location.hash.slice(9)); } catch { closeProject(); return; }
    if (projects.some(project => project.id === id)) showProject(id);
    else closeProject();
  } else if (projectDialog.open) closeProject();
}
function displayImage(index) {
  if (!currentProject || !currentProject.images.length) return;
  const images = currentProject.images;
  currentImage = (index + images.length) % images.length;
  const art = images[currentImage];
  document.querySelector('#lightbox-image').src = art.src;
  document.querySelector('#lightbox-image').alt = art.alt;
  document.querySelector('#lightbox-image').style.backgroundColor = art.background || '';
  document.querySelector('#lightbox-caption').textContent = `${currentImage + 1} / ${images.length} — ${art.alt}`;
  document.querySelector('.lightbox-prev').disabled = images.length === 1;
  document.querySelector('.lightbox-next').disabled = images.length === 1;
  if (!lightbox.open) lightbox.showModal();
}
document.querySelector('#project-content').addEventListener('click', event => { const button = event.target.closest('[data-image]'); if (button) displayImage(Number(button.dataset.image)); });
document.querySelector('#close-project').addEventListener('click', closeProject);
projectDialog.addEventListener('cancel', event => { event.preventDefault(); closeProject(); });
projectDialog.addEventListener('click', event => { if (event.target === projectDialog) { const rect = projectDialog.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) closeProject(); } });
document.querySelector('.lightbox-close').addEventListener('click', () => lightbox.close());
document.querySelector('.lightbox-prev').addEventListener('click', () => displayImage(currentImage - 1));
document.querySelector('.lightbox-next').addEventListener('click', () => displayImage(currentImage + 1));
lightbox.addEventListener('keydown', event => { if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); displayImage(currentImage + (event.key === 'ArrowLeft' ? -1 : 1)); } });
for (const [selector, direction] of [['#previous-project', -1], ['#next-project', 1]]) document.querySelector(selector).addEventListener('click', () => { const index = projects.indexOf(currentProject); location.hash = `project/${projects[(index + direction + projects.length) % projects.length].id}`; });
window.addEventListener('hashchange', route);
route();

// A subtle reading line links the three chapters without adding another nav.
const readingLine = document.querySelector('.reading-line');
let progressQueued = false;
function updateProgress() {
  const travel = document.documentElement.scrollHeight - window.innerHeight;
  if (readingLine) readingLine.style.width = `${travel > 0 ? Math.min(100, window.scrollY / travel * 100) : 0}%`;
  progressQueued = false;
}
window.addEventListener('scroll', () => {
  if (!progressQueued) { progressQueued = true; requestAnimationFrame(updateProgress); }
}, {passive:true});
window.addEventListener('resize', updateProgress);
updateProgress();
