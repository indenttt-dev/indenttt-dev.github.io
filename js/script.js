/* =========================================================
   The Grand Line Gazette — interactions
   - Mobile menu toggle
   - Click-based active section link
   - Gentle opacity reveal (respects reduced motion)
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {
    const navToggle = document.getElementById("navToggle");
    const navLinks = document.getElementById("navLinks");
    const navItems = navLinks.querySelectorAll("a");
    const topbar = document.getElementById("topbar");

    function setTopbarOffset() {
        const topbarHeight = Math.ceil(topbar.getBoundingClientRect().height);

        document.documentElement.style.setProperty("--topbar-height", topbarHeight + "px");
        document.documentElement.style.setProperty("--anchor-offset", (topbarHeight + 20) + "px");
    }

    setTopbarOffset();
    window.addEventListener("resize", setTopbarOffset);

    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(setTopbarOffset);
    }

    if (navItems.length > 0) {
        navItems[0].classList.add("is-active");
    }

    /* ----- Mobile menu toggle ----- */
    navToggle.addEventListener("click", function () {
        const isOpen = navLinks.classList.toggle("is-open");
        navToggle.classList.toggle("is-open", isOpen);
        navToggle.setAttribute("aria-expanded", String(isOpen));
        navToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    });

    navItems.forEach(function (link) {
        link.addEventListener("click", function () {
            navItems.forEach(function (a) {
                a.classList.remove("is-active");
            });
            link.classList.add("is-active");

            navLinks.classList.remove("is-open");
            navToggle.classList.remove("is-open");
            navToggle.setAttribute("aria-expanded", "false");
            navToggle.setAttribute("aria-label", "Open menu");
        });
    });

    /* ----- Gentle reveal ----- */
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const targets = document.querySelectorAll(".article, [data-reveal]");

    if (prefersReduced) {
        targets.forEach(function (el) {
            el.classList.add("is-visible");
        });
        return;
    }

    targets.forEach(function (el) {
        el.setAttribute("data-reveal", "");
    });

    const revealer = new IntersectionObserver(function (entries, observer) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    targets.forEach(function (el) {
        revealer.observe(el);
    });
});
