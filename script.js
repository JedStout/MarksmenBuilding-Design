// Mobile nav
const toggle = document.querySelector('.nav-toggle');
const nav = document.getElementById('site-nav');
toggle.addEventListener('click', () => {
  const open = nav.classList.toggle('is-open');
  toggle.setAttribute('aria-expanded', open);
});
nav.addEventListener('click', e => {
  if (e.target.tagName === 'A') { nav.classList.remove('is-open'); toggle.setAttribute('aria-expanded', false); }
});

// Portfolio filters
const tiles = [...document.querySelectorAll('.tile')];
document.querySelectorAll('.filter').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter').forEach(b => {
      b.classList.toggle('is-active', b === btn);
      b.setAttribute('aria-selected', b === btn);
    });
    const f = btn.dataset.filter;
    tiles.forEach(t => t.classList.toggle('is-hidden', f !== 'all' && t.dataset.cat !== f));
  });
});

// Lightbox
const lb = document.querySelector('.lightbox');
const lbImg = lb.querySelector('img');
const lbCap = lb.querySelector('figcaption');
let current = 0;
const visible = () => tiles.filter(t => !t.classList.contains('is-hidden'));

function show(i) {
  const list = visible();
  current = (i + list.length) % list.length;
  const t = list[current];
  lbImg.src = t.href;
  lbImg.alt = t.querySelector('img').alt;
  lbCap.textContent = t.querySelector('span').textContent;
}
function close() { lb.hidden = true; document.body.style.overflow = ''; }

tiles.forEach(t => t.addEventListener('click', e => {
  e.preventDefault();
  show(visible().indexOf(t));
  lb.hidden = false;
  document.body.style.overflow = 'hidden';
  lb.querySelector('.lb-close').focus();
}));
lb.querySelector('.lb-close').addEventListener('click', close);
lb.querySelector('.lb-prev').addEventListener('click', () => show(current - 1));
lb.querySelector('.lb-next').addEventListener('click', () => show(current + 1));
lb.addEventListener('click', e => { if (e.target === lb) close(); });
document.addEventListener('keydown', e => {
  if (lb.hidden) return;
  if (e.key === 'Escape') close();
  if (e.key === 'ArrowLeft') show(current - 1);
  if (e.key === 'ArrowRight') show(current + 1);
});

// Contact form → opens the visitor's mail app addressed to data-email
const form = document.querySelector('.contact-form');
form.addEventListener('submit', e => {
  e.preventDefault();
  const note = form.querySelector('.form-note');
  const to = form.dataset.email;
  if (!to) { note.textContent = 'Inquiries are not yet connected — please check back soon.'; return; }
  const d = Object.fromEntries(new FormData(form));
  const body = `Name: ${d.name}\nEmail: ${d.email}\nPhone: ${d.phone}\nProject type: ${d.type}\n\n${d.message}`;
  window.location.href = `mailto:${to}?subject=${encodeURIComponent('Project inquiry — ' + d.type)}&body=${encodeURIComponent(body)}`;
  note.textContent = 'Thank you — your mail app should open with your inquiry ready to send.';
});

// Reveal on scroll
const io = 'IntersectionObserver' in window && new IntersectionObserver(entries => {
  entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
}, { threshold: 0.12 });
document.querySelectorAll('section .wrap > *, .service, .steps li').forEach(el => {
  if (!io) return;
  el.classList.add('reveal');
  io.observe(el);
});

document.getElementById('year').textContent = new Date().getFullYear();
