/**
 * ANIL KUMAR — PORTFOLIO SCRIPT
 * Clean, natural scrolling, floating pill scrollspy, clipboard copy, and lightbox.
 */

document.addEventListener('DOMContentLoaded', () => {
    initScrollspy();
    initSmoothAnchors();
});

/* --------------------------------------------------------------------------
   1. Floating Pill Scrollspy
   -------------------------------------------------------------------------- */
function initScrollspy() {
    const pillButtons = document.querySelectorAll('.pill-btn');
    const sections = document.querySelectorAll('section[id]');

    function updateActivePill() {
        let current = 'hero';
        const scrollPosition = window.scrollY + 200;

        sections.forEach((section) => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            if (scrollPosition >= top && scrollPosition < top + height) {
                current = section.getAttribute('id');
            }
        });

        pillButtons.forEach((btn) => {
            if (btn.getAttribute('data-nav') === current) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    window.addEventListener('scroll', updateActivePill, { passive: true });
    updateActivePill();
}

/* --------------------------------------------------------------------------
   2. Smooth Anchor Navigation
   -------------------------------------------------------------------------- */
function initSmoothAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElem = document.querySelector(targetId);
            if (targetElem) {
                e.preventDefault();
                targetElem.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

function scrollToTimeline() {
    const timeline = document.getElementById('timeline');
    if (timeline) {
        timeline.scrollIntoView({ behavior: 'smooth' });
    }
}

/* --------------------------------------------------------------------------
   3. Clipboard Copy Utility
   -------------------------------------------------------------------------- */
function copyEmail() {
    const email = 'anilkumard707@gmail.com';
    const textEl = document.getElementById('copyTxt');

    navigator.clipboard.writeText(email).then(() => {
        if (textEl) {
            textEl.textContent = 'Copied!';
            setTimeout(() => {
                textEl.textContent = 'Copy Address';
            }, 2200);
        }
    }).catch(() => {
        const temp = document.createElement('input');
        temp.value = email;
        document.body.appendChild(temp);
        temp.select();
        document.execCommand('copy');
        document.body.removeChild(temp);

        if (textEl) {
            textEl.textContent = 'Copied!';
            setTimeout(() => {
                textEl.textContent = 'Copy Address';
            }, 2200);
        }
    });
}

/* --------------------------------------------------------------------------
   4. Certificate Lightbox Modal
   -------------------------------------------------------------------------- */
function openCertModal(src, title) {
    const modal = document.getElementById('certModal');
    const img = document.getElementById('certModalImg');
    const titleEl = document.getElementById('certModalTitle');

    if (!modal || !img) return;

    img.src = src;
    if (titleEl) titleEl.textContent = title || '';
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeCertModal(e) {
    const modal = document.getElementById('certModal');
    if (!modal) return;

    if (e.target === modal || e.target.closest('.modal-close-btn')) {
        modal.classList.remove('open');
        document.body.style.overflow = '';
    }
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const modal = document.getElementById('certModal');
        if (modal && modal.classList.contains('open')) {
            modal.classList.remove('open');
            document.body.style.overflow = '';
        }
    }
});