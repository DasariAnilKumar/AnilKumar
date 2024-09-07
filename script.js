
    function checkScroll() {
        var elements = document.querySelectorAll('.timeline-item');
        elements.forEach(function(element) {
            var position = element.getBoundingClientRect();
            if(position.top < window.innerHeight && position.bottom >= 0) {
                element.classList.add('show');
            }
        });
    }

    function highlightBox(index) {
        var dots = document.querySelectorAll('.timeline-dot');
        var contents = document.querySelectorAll('.timeline-content');

        dots.forEach((dot, i) => {
            if (i === index) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });

        contents.forEach((content, i) => {
            if (i === index) {
                content.classList.add('active');
            } else {
                content.classList.remove('active');
            }
        });
    }

window.addEventListener('scroll', checkScroll);
window.addEventListener('load', checkScroll);

        function isElementInViewport(el) {
            const rect = el.getBoundingClientRect();
            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
        }

        function handleScroll() {
            const cards = document.querySelectorAll('.skill-card');
            cards.forEach(card => {
                if (isElementInViewport(card)) {
                    card.classList.add('visible');
                }
            });
        }

        document.addEventListener('DOMContentLoaded', () => {
            handleScroll(); // Check initial state
            window.addEventListener('scroll', handleScroll);
            window.addEventListener('resize', handleScroll);

            const progressBars = document.querySelectorAll('.skill-progress');
            progressBars.forEach(bar => {
                const randomPercentage = Math.floor(Math.random() * (80 - 70 + 1)) + 70;
                setTimeout(() => {
                    bar.style.width = `${randomPercentage}%`;
                }, 300);
            });
        });

function isElementInViewport(el) {
            const rect = el.getBoundingClientRect();
            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
        }

        function handleScroll() {
            const cards = document.querySelectorAll('.skill-card');
            cards.forEach((card, index) => {
                if (isElementInViewport(card)) {
                    setTimeout(() => {
                        card.classList.add('visible');
                    }, index * 100); // Staggered animation
                }
            });
        }

        document.addEventListener('DOMContentLoaded', () => {
            handleScroll(); // Check initial state
            window.addEventListener('scroll', handleScroll);
            window.addEventListener('resize', handleScroll);

            const progressBars = document.querySelectorAll('.skill-progress');
            progressBars.forEach(bar => {
                const randomPercentage = Math.floor(Math.random() * (80 - 70 + 1)) + 70;
                setTimeout(() => {
                    bar.style.width = `${randomPercentage}%`;
                }, 300);
            });
        });