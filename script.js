// HARIRAM K - PORTFOLIO JAVASCRIPT (Interactive Edition)

document.addEventListener("DOMContentLoaded", function () {

    const reducedMotion =
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer =
        window.matchMedia("(hover: hover) and (pointer: fine)").matches;


    // 0. Inject styles for all interactive features
    const style = document.createElement("style");
    style.textContent = `
        :root { --accent: #0072ff; }

        #scroll-progress {
            position: fixed; top: 0; left: 0; width: 100%; height: 4px;
            background: linear-gradient(90deg, var(--accent), #00c6ff);
            transform: scaleX(0); transform-origin: left; z-index: 3000;
        }

        #back-to-top {
            position: fixed; right: 20px; bottom: 20px; width: 46px; height: 46px;
            border: none; border-radius: 50%; background: var(--accent); color: #fff;
            font-size: 1.3rem; cursor: pointer; z-index: 2500;
            opacity: 0; visibility: hidden; transform: translateY(10px);
            transition: opacity .3s, transform .3s, visibility .3s;
        }
        #back-to-top.visible { opacity: 1; visibility: visible; transform: translateY(0); }
        #back-to-top:hover { transform: translateY(-3px); }

        #navbar a.active-link { color: var(--accent); border-bottom: 2px solid var(--accent); }

        header { transition: transform .35s ease; }
        header.nav-hidden { transform: translateY(-100%); }

        .js-reveal { opacity: 0; transform: translateY(40px);
            transition: opacity .7s ease, transform .7s ease; }
        .js-reveal.in-view { opacity: 1; transform: none; }

        .ripple-host { position: relative; overflow: hidden; }
        .ripple-wave {
            position: absolute; border-radius: 50%; pointer-events: none;
            background: rgba(255,255,255,.45); transform: scale(0);
            animation: ripple-anim .6s ease-out forwards;
        }
        @keyframes ripple-anim { to { transform: scale(1); opacity: 0; } }

        #cursor-glow {
            position: fixed; top: 0; left: 0; width: 320px; height: 320px;
            margin: -160px 0 0 -160px; border-radius: 50%; pointer-events: none;
            background: radial-gradient(circle, rgba(0,114,255,.18), transparent 65%);
            z-index: 1; opacity: 0; transition: opacity .3s;
        }

        .typing-cursor { display: inline-block; margin-left: 2px;
            animation: blink 1s steps(1) infinite; }
        @keyframes blink { 50% { opacity: 0; } }

        #toast {
            position: fixed; left: 50%; bottom: 30px; transform: translate(-50%, 20px);
            background: #222; color: #fff; padding: 10px 18px; border-radius: 8px;
            font-size: .9rem; opacity: 0; pointer-events: none; z-index: 4000;
            transition: opacity .3s, transform .3s;
        }
        #toast.show { opacity: 1; transform: translate(-50%, 0); }
    `;
    document.head.appendChild(style);


    // Helper: toast notification
    const toast = document.createElement("div");
    toast.id = "toast";
    toast.setAttribute("role", "status");
    document.body.appendChild(toast);

    let toastTimer;
    function showToast(message) {
        toast.textContent = message;
        toast.classList.add("show");
        clearTimeout(toastTimer);
        toastTimer = setTimeout(function () {
            toast.classList.remove("show");
        }, 2200);
    }


    // 1. Mobile Navigation Menu
    const menuToggle = document.getElementById("menu-toggle");
    const navbar = document.getElementById("navbar");

    function closeMenu() {
        navbar.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.textContent = "☰";
    }

    if (menuToggle && navbar) {

        menuToggle.addEventListener("click", function () {
            const isOpen = navbar.classList.toggle("active");
            menuToggle.setAttribute("aria-expanded", String(isOpen));
            menuToggle.textContent = isOpen ? "✕" : "☰";
        });

        navbar.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", closeMenu);
        });

        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape" && navbar.classList.contains("active")) {
                closeMenu();
                menuToggle.focus();
            }
        });

        document.addEventListener("click", function (event) {
            if (
                navbar.classList.contains("active") &&
                !navbar.contains(event.target) &&
                !menuToggle.contains(event.target)
            ) {
                closeMenu();
            }
        });

    }


    // 2. Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {

        link.addEventListener("click", function (event) {

            const targetId = this.getAttribute("href");

            if (targetId && targetId.length > 1) {

                const target = document.querySelector(targetId);

                if (target) {
                    event.preventDefault();
                    target.scrollIntoView({
                        behavior: reducedMotion ? "auto" : "smooth",
                        block: "start"
                    });
                }

            }

        });

    });


    // 3. Current Year in Footer
    const yearElement = document.getElementById("current-year");

    if (yearElement) {
        yearElement.textContent =
            "© " + new Date().getFullYear() + ". All rights reserved.";
    }


    // 4. Skill Card Scroll Animation (staggered)
    const skillCards = document.querySelectorAll(".skill-card");

    if ("IntersectionObserver" in window) {

        const cardObserver = new IntersectionObserver(function (entries) {

            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    const index = Array.prototype.indexOf.call(
                        skillCards, entry.target
                    );
                    entry.target.style.transitionDelay =
                        reducedMotion ? "0ms" : (index % 6) * 90 + "ms";
                    entry.target.classList.add("show");
                    cardObserver.unobserve(entry.target);
                }
            });

        }, { threshold: 0.15 });

        skillCards.forEach(function (card) {
            cardObserver.observe(card);
        });

    } else {

        skillCards.forEach(function (card) {
            card.classList.add("show");
        });

    }


    // 5. Project Card Interaction
    const projectCard = document.querySelector(".project-card");

    if (projectCard) {

        projectCard.setAttribute("tabindex", "0");
        projectCard.setAttribute("role", "button");
        projectCard.setAttribute("aria-pressed", "false");

        const setProjectActive = function (active) {
            projectCard.classList.toggle("project-active", active);
            projectCard.setAttribute("aria-pressed", String(active));
        };

        projectCard.addEventListener("click", function () {
            setProjectActive(!projectCard.classList.contains("project-active"));
        });

        projectCard.addEventListener("keydown", function (event) {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                setProjectActive(!projectCard.classList.contains("project-active"));
            }
        });

        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape") setProjectActive(false);
        });

    }


    // 6. Scroll Progress Bar + Back-to-Top
    const progressBar = document.createElement("div");
    progressBar.id = "scroll-progress";
    progressBar.setAttribute("aria-hidden", "true");
    document.body.prepend(progressBar);

    const backToTop = document.createElement("button");
    backToTop.id = "back-to-top";
    backToTop.type = "button";
    backToTop.setAttribute("aria-label", "Back to top");
    backToTop.textContent = "↑";
    document.body.appendChild(backToTop);

    backToTop.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
    });


    // 7. Navbar hides on scroll down, returns on scroll up
    const header = document.querySelector("header");
    let lastScrollY = window.scrollY;
    let ticking = false;

    function onScroll() {
        const y = window.scrollY;
        const maxScroll =
            document.documentElement.scrollHeight - window.innerHeight;

        progressBar.style.transform =
            "scaleX(" + (maxScroll > 0 ? y / maxScroll : 0) + ")";
        backToTop.classList.toggle("visible", y > 400);

        if (header) {
            const menuOpen = navbar && navbar.classList.contains("active");
            if (y > lastScrollY && y > 150 && !menuOpen) {
                header.classList.add("nav-hidden");
            } else if (y < lastScrollY) {
                header.classList.remove("nav-hidden");
            }
        }

        lastScrollY = y;
        ticking = false;
    }

    window.addEventListener("scroll", function () {
        if (!ticking) {
            window.requestAnimationFrame(onScroll);
            ticking = true;
        }
    }, { passive: true });

    window.addEventListener("resize", onScroll);
    onScroll();


    // 8. Active Nav Link Highlight
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll('#navbar a[href^="#"]');

    if ("IntersectionObserver" in window && sections.length && navLinks.length) {

        const navObserver = new IntersectionObserver(function (entries) {

            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;

                navLinks.forEach(function (link) {
                    const isCurrent =
                        link.getAttribute("href") === "#" + entry.target.id;

                    link.classList.toggle("active-link", isCurrent);

                    if (isCurrent) {
                        link.setAttribute("aria-current", "true");
                    } else {
                        link.removeAttribute("aria-current");
                    }
                });
            });

        }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });

        sections.forEach(function (section) {
            navObserver.observe(section);
        });

    }


    // 9. Section Reveal on Scroll (skips the first section / hero)
    if ("IntersectionObserver" in window && !reducedMotion) {

        const allSections = Array.prototype.slice.call(
            document.querySelectorAll("section")
        ).slice(1);

        const revealObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("in-view");
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        allSections.forEach(function (section) {
            section.classList.add("js-reveal");
            revealObserver.observe(section);
        });

    }


    // 10. Typing Effect: <span data-typing="Word one|Word two"></span>
    document.querySelectorAll("[data-typing]").forEach(function (el) {

        const words = el.getAttribute("data-typing")
            .split("|")
            .map(function (w) { return w.trim(); })
            .filter(Boolean);

        if (!words.length) return;

        if (reducedMotion) {
            el.textContent = words[0];
            return;
        }

        const textNode = document.createElement("span");
        const cursor = document.createElement("span");
        cursor.className = "typing-cursor";
        cursor.textContent = "|";
        cursor.setAttribute("aria-hidden", "true");
        el.textContent = "";
        el.setAttribute("aria-label", words.join(", "));
        el.appendChild(textNode);
        el.appendChild(cursor);

        let wordIndex = 0;
        let charIndex = 0;
        let deleting = false;

        function tick() {
            const word = words[wordIndex];

            charIndex += deleting ? -1 : 1;
            textNode.textContent = word.slice(0, charIndex);

            let delay = deleting ? 40 : 90;

            if (!deleting && charIndex === word.length) {
                deleting = true;
                delay = 1400;
            } else if (deleting && charIndex === 0) {
                deleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                delay = 400;
            }

            setTimeout(tick, delay);
        }

        tick();

    });


    // 11. Animated Counters: <span data-count="12" data-suffix="+">0</span>
    const counters = document.querySelectorAll("[data-count]");

    function runCounter(el) {
        const target = parseFloat(el.getAttribute("data-count")) || 0;
        const suffix = el.getAttribute("data-suffix") || "";

        if (reducedMotion) {
            el.textContent = target + suffix;
            return;
        }

        const duration = 1600;
        const start = performance.now();

        function step(now) {
            const t = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - t, 3);
            el.textContent = Math.round(target * eased) + suffix;
            if (t < 1) requestAnimationFrame(step);
        }

        requestAnimationFrame(step);
    }

    if ("IntersectionObserver" in window && counters.length) {

        const counterObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    runCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(function (el) { counterObserver.observe(el); });

    } else {
        counters.forEach(runCounter);
    }


    // 12. 3D Tilt on Cards (mouse devices only)
    if (finePointer && !reducedMotion) {

        document.querySelectorAll(".skill-card, .project-card").forEach(function (card) {

            card.addEventListener("mousemove", function (event) {
                const rect = card.getBoundingClientRect();
                const x = (event.clientX - rect.left) / rect.width - 0.5;
                const y = (event.clientY - rect.top) / rect.height - 0.5;

                card.style.transition = "transform 0.1s";
                card.style.transform =
                    "perspective(700px) rotateX(" + (-y * 10) + "deg) rotateY(" +
                    (x * 10) + "deg) translateY(-4px)";
            });

            card.addEventListener("mouseleave", function () {
                card.style.transition = "transform 0.4s ease";
                card.style.transform = "";
            });

        });

    }


    // 13. Ripple Effect on Buttons (.btn / .button)
    document.querySelectorAll(".btn, .button").forEach(function (button) {

        button.classList.add("ripple-host");

        button.addEventListener("click", function (event) {
            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height) * 2;
            const wave = document.createElement("span");

            wave.className = "ripple-wave";
            wave.style.width = wave.style.height = size + "px";
            wave.style.left = event.clientX - rect.left - size / 2 + "px";
            wave.style.top = event.clientY - rect.top - size / 2 + "px";

            button.appendChild(wave);
            wave.addEventListener("animationend", function () { wave.remove(); });
        });

    });


    // 14. Cursor Glow that follows the mouse (mouse devices only)
    if (finePointer && !reducedMotion) {

        const glow = document.createElement("div");
        glow.id = "cursor-glow";
        glow.setAttribute("aria-hidden", "true");
        document.body.appendChild(glow);

        let mouseX = 0, mouseY = 0, glowX = 0, glowY = 0;

        document.addEventListener("mousemove", function (event) {
            mouseX = event.clientX;
            mouseY = event.clientY;
            glow.style.opacity = "1";
        });

        document.addEventListener("mouseleave", function () {
            glow.style.opacity = "0";
        });

        (function follow() {
            glowX += (mouseX - glowX) * 0.12;
            glowY += (mouseY - glowY) * 0.12;
            glow.style.transform =
                "translate(" + glowX + "px, " + glowY + "px)";
            requestAnimationFrame(follow);
        })();

    }


    // 15. Copy email to clipboard when a mailto link is clicked
    document.querySelectorAll('a[href^="mailto:"]').forEach(function (link) {

        link.addEventListener("click", function () {
            const email = link.getAttribute("href").replace("mailto:", "").split("?")[0];

            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(email).then(function () {
                    showToast("Email copied: " + email);
                }).catch(function () {});
            }
        });

    });

});
