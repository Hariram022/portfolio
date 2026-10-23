// 1. Mobile menu
const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');
function setMenu(open) {
  navLinks.classList.toggle('open', open);
  menuBtn.setAttribute('aria-expanded', open);
  menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
}
menuBtn.addEventListener('click', () => setMenu(!navLinks.classList.contains('open')));
navLinks.addEventListener('click', e => { if (e.target.tagName === 'A') setMenu(false); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

// 2. Light / dark theme
const root = document.documentElement;
const themeBtn = document.getElementById('themeBtn');
function setTheme(t) {
  root.dataset.theme = t;
  themeBtn.textContent = t === 'dark' ? '☀' : '☾';
  themeBtn.setAttribute('aria-label', t === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
  try { localStorage.setItem('theme', t); } catch (e) {}
}
let saved = 'dark';
try { saved = localStorage.getItem('theme') || 'dark'; } catch (e) {}
setTheme(saved);
themeBtn.addEventListener('click', () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'));

// 3. Project filter
const filterBtns = document.querySelectorAll('[data-filter]');
const projects = document.querySelectorAll('.project');
filterBtns.forEach(btn => btn.addEventListener('click', () => {
  filterBtns.forEach(b => { b.classList.toggle('active', b === btn); b.setAttribute('aria-pressed', b === btn); });
  projects.forEach(p => { p.hidden = btn.dataset.filter !== 'all' && p.dataset.cat !== btn.dataset.filter; });
}));

// 4. Expand / collapse project details
document.querySelectorAll('.more').forEach(btn => btn.addEventListener('click', () => {
  const details = btn.nextElementSibling;
  const open = details.hidden;
  details.hidden = !open;
  btn.setAttribute('aria-expanded', open);
  btn.textContent = open ? 'Hide details' : 'Show details';
}));

// 5. Greeting by visitor type
const greeting = document.getElementById('greeting');
document.querySelectorAll('[data-who]').forEach(btn => btn.addEventListener('click', () => {
  greeting.textContent = 'Welcome, ' + btn.dataset.who + '. I\u2019m';
}));

// 6. Contact form validation (does not send anything)
const form = document.getElementById('form');
const status = document.getElementById('status');
function check(id, errId, message, valid) {
  const field = document.getElementById(id);
  const err = document.getElementById(errId);
  const ok = valid(field.value.trim());
  field.setAttribute('aria-invalid', !ok);
  err.textContent = ok ? '' : message;
  return ok;
}
form.addEventListener('submit', e => {
  e.preventDefault();
  const results = [
    check('name', 'nameErr', 'Enter your name.', v => v.length > 0),
    check('email', 'emailErr', 'Enter a valid email address.', v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)),
    check('msg', 'msgErr', 'Write a message of at least 10 characters.', v => v.length >= 10)
  ];
  status.textContent = results.every(Boolean)
    ? 'Your details look good. This form cannot send messages, so please email farmtoearm@gmail.com.'
    : '';
});

// 7. Back-to-top button
const topBtn = document.getElementById('topBtn');
window.addEventListener('scroll', () => { topBtn.hidden = window.scrollY < 400; });
topBtn.addEventListener('click', () => window.scrollTo({ top: 0 }));

// Highlight current section in nav
const links = [...navLinks.querySelectorAll('a')];
const observer = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (en.isIntersecting) links.forEach(a => a.classList.toggle('active', a.hash === '#' + en.target.id));
  });
}, { rootMargin: '-45% 0px -50% 0px' });
document.querySelectorAll('main section[id]').forEach(s => observer.observe(s));

document.getElementById('year').textContent = new Date().getFullYear();

// 8. Image slider
const track = document.getElementById('track');
const slides = track.children;
const dots = document.getElementById('dots');
let cur = 0, startX = 0;
for (let i = 0; i < slides.length; i++) {
  const d = document.createElement('button');
  d.className = 'dot';
  d.setAttribute('aria-label', 'Show project ' + (i + 1));
  d.addEventListener('click', () => go(i));
  dots.appendChild(d);
}
function go(i) {
  cur = (i + slides.length) % slides.length;
  track.style.transform = 'translateX(-' + cur * 100 + '%)';
  [...dots.children].forEach((d, n) => d.classList.toggle('on', n === cur));
}
document.getElementById('prev').addEventListener('click', () => go(cur - 1));
document.getElementById('next').addEventListener('click', () => go(cur + 1));
document.getElementById('slider').addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft') go(cur - 1);
  if (e.key === 'ArrowRight') go(cur + 1);
});
track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
track.addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - startX;
  if (Math.abs(dx) > 50) go(cur + (dx < 0 ? 1 : -1));
});
go(0);
