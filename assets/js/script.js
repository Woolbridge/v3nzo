const navbar = document.getElementById('navbar');
const progress = document.getElementById('scrollProgress');
const backTop = document.getElementById('backTop');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
const cursorGlow = document.querySelector('.cursor-glow');
const sections = [...document.querySelectorAll('main section[id]')];
const links = [...document.querySelectorAll('.nav-links a[href^="#"]')];

function updateScrollUI() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = scrollable > 0 ? scrollTop / scrollable : 0;

    progress.style.width = `${ratio * 100}%`;
    navbar.classList.toggle('scrolled', scrollTop > 24);
    backTop.classList.toggle('show', scrollTop > 500);

    let current = sections[0]?.id;
    sections.forEach(section => {
        if (scrollTop >= section.offsetTop - 180) current = section.id;
    });

    links.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${current}`));
}

window.addEventListener('scroll', updateScrollUI, { passive: true });
window.addEventListener('resize', updateScrollUI);
updateScrollUI();

navToggle?.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
});

links.forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle?.setAttribute('aria-expanded', 'false');
    });
});

backTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

if (cursorGlow && window.matchMedia('(pointer: fine)').matches) {
    window.addEventListener('pointermove', event => {
        cursorGlow.style.left = `${event.clientX}px`;
        cursorGlow.style.top = `${event.clientY}px`;
    }, { passive: true });
} else if (cursorGlow) {
    cursorGlow.style.display = 'none';
}

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.14 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
