/* =============================================
   STILLUS HOTEL — script.js
============================================= */

// =====================================
// HEADER SCROLL
// =====================================
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });


// =====================================
// MOBILE MENU
// =====================================
const menuToggle = document.getElementById('menuToggle');
const nav        = document.getElementById('nav');

function closeMenu() {
    nav.classList.remove('open');
    menuToggle.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
}

menuToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    menuToggle.classList.toggle('open', isOpen);
    menuToggle.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
});

nav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

document.addEventListener('click', e => {
    if (!nav.contains(e.target) && !menuToggle.contains(e.target)) closeMenu();
});

document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
});


// =====================================
// ROOM TABS
// =====================================
document.querySelectorAll('.room-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.room-tab').forEach(t => {
            t.classList.remove('active');
            t.setAttribute('aria-selected', 'false');
        });
        document.querySelectorAll('.room-panel').forEach(p => p.classList.remove('active'));

        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');
        document.getElementById('panel-' + tab.dataset.panel).classList.add('active');
    });
});


// =====================================
// SCROLL REVEAL
// =====================================
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


// =====================================
// IMAGE MODAL
// =====================================
let currentGalleryImgs = [];
let currentIdx         = 0;

const modal         = document.getElementById('modal');
const modalImg      = document.getElementById('modalImg');
const modalClose    = document.getElementById('modalClose');
const modalPrev     = document.getElementById('modalPrev');
const modalNext     = document.getElementById('modalNext');
const modalBackdrop = document.getElementById('modalBackdrop');

function openModal(imgs, idx) {
    currentGalleryImgs    = imgs;
    currentIdx            = idx;
    modalImg.src          = imgs[idx].src;
    modalImg.alt          = imgs[idx].alt;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
}

function navigate(dir) {
    currentIdx   = (currentIdx + dir + currentGalleryImgs.length) % currentGalleryImgs.length;
    modalImg.src = currentGalleryImgs[currentIdx].src;
    modalImg.alt = currentGalleryImgs[currentIdx].alt;
}

// Bind gallery images
document.querySelectorAll('.gallery-masonry, .gallery-grid').forEach(gallery => {
    const imgs = Array.from(gallery.querySelectorAll('img'));
    imgs.forEach((img, i) => {
        img.style.cursor = 'pointer';
        img.setAttribute('tabindex', '0');
        img.setAttribute('role', 'button');
        img.addEventListener('click', () => openModal(imgs, i));
        img.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openModal(imgs, i);
            }
        });
    });
});

// Modal controls
modalClose.addEventListener('click', closeModal);
modalBackdrop.addEventListener('click', closeModal);
modalPrev.addEventListener('click', () => navigate(-1));
modalNext.addEventListener('click', () => navigate(1));

document.addEventListener('keydown', e => {
    if (!modal.classList.contains('open')) return;
    if (e.key === 'Escape')     closeModal();
    if (e.key === 'ArrowLeft')  navigate(-1);
    if (e.key === 'ArrowRight') navigate(1);
});

// Touch / swipe support for modal
let touchStartX = 0;
modal.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
}, { passive: true });
modal.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) navigate(diff > 0 ? 1 : -1);
}, { passive: true });


// =====================================
// SMOOTH SCROLL
// =====================================
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        const id = a.getAttribute('href');
        if (!id || id === '#') return;

        const target = document.querySelector(id);
        if (target) {
            e.preventDefault();
            const offset = header.offsetHeight + 16;
            const top    = target.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({ top, behavior: 'smooth' });
            if (history.pushState) history.pushState(null, null, id);
        }
    });
});