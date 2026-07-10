/* ============================================================
   SHARED SITE SCRIPT — linked on every page
   ============================================================ */

/* ---------- Nav goes solid after you scroll past the top ---------- */
const siteNav = document.querySelector('nav');
if (siteNav){
  window.addEventListener('scroll', () => {
    siteNav.classList.toggle('solid', window.scrollY > 60);
  });
}

/* ---------- Magnetic buttons (Lando-style hover-follow) ----------
   Any element with class="magnetic" will nudge toward the cursor
   while hovered, then spring back on mouse-leave.               */
document.querySelectorAll('.magnetic').forEach((btn) => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = 'translate(0,0)';
  });
});

/* ---------- Scroll reveal for anything with class="reveal" ---------- */
if (window.gsap && window.ScrollTrigger){
  gsap.registerPlugin(ScrollTrigger);
  document.querySelectorAll('.reveal').forEach((el) => {
    gsap.to(el, {
      opacity: 1, y: 0, duration: 0.8, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 88%' }
    });
  });

  /* ---------- Homepage hero: photo zooms OUT on scroll, then the
     cursive name fades in, pinned for the length of .hero-pin ---------- */
  const heroPhoto = document.querySelector('.hero-photo');
  const heroName  = document.querySelector('.hero-name');
  if (heroPhoto && heroName){
    const heroTl = gsap.timeline({
      scrollTrigger: {
        trigger: '.hero-pin',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.6
      }
    });
    heroTl
      .to(heroPhoto, { scale: 1.0, duration: 1 }, 0)
      .to(heroName, { opacity: 1, duration: 0.6 }, 0.35)
      .to(heroName, { y: -30, duration: 0.65 }, 0.5);
  }
}

/* ============================================================
   HELPER: render blog-style cards into a grid.
   Used by blog.html, engineering.html, writing.html — each of
   those pages just defines its own array and calls this once.
   To add a new post: copy one object in the array, edit it.
   ============================================================ */
function renderCards(containerId, posts){
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = posts.map(p => `
    <a class="post-card reveal" href="${p.link}">
      <div class="post-cover" style="${p.image ? `background-image:url('${p.image}');background-size:cover;background-position:center;` : ''}"></div>
      <div class="post-body">
        <p class="eyebrow">${p.date}${p.tag ? ' &middot; ' + p.tag : ''}</p>
        <h3>${p.title}</h3>
        <p>${p.summary}</p>
        <span class="magnetic">Read More →</span>
      </div>
    </a>
  `).join('');

  // re-run reveal + magnetic setup for the newly injected cards
  if (window.gsap && window.ScrollTrigger){
    el.querySelectorAll('.reveal').forEach((card) => {
      gsap.to(card, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out',
        scrollTrigger: { trigger: card, start: 'top 92%' } });
    });
  }
  el.querySelectorAll('.magnetic').forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = 'translate(0,0)'; });
  });
}

/* ============================================================
   HELPER: photography filter by place / color.
   Call setupPhotoFilters() on the photography page after the
   photo grid exists in the HTML.
   ============================================================ */
function setupPhotoFilters(){
  const buttons = document.querySelectorAll('.filter-btn');
  const tiles = document.querySelectorAll('.photo-tile');
  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      tiles.forEach((tile) => {
        if (filter === 'all' || tile.dataset.tags.split(' ').includes(filter)){
          tile.classList.remove('hidden');
        } else {
          tile.classList.add('hidden');
        }
      });
    });
  });
}
