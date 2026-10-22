// HARIRAM K - PORTFOLIO JAVASCRIPT

document.addEventListener("DOMContentLoaded", function () {

    // 1. Mobile Navigation Menu
    const menuToggle = document.getElementById("menu-toggle");
    const navbar = document.getElementById("navbar");

    if (menuToggle && navbar) {

        menuToggle.addEventListener("click", function () {

            const isOpen = navbar.classList.toggle("active");

            menuToggle.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

            menuToggle.textContent = isOpen ? "✕" : "☰";

        });

        // Close menu after clicking a navigation link
        navbar.querySelectorAll("a").forEach(function (link) {

            link.addEventListener("click", function () {

                navbar.classList.remove("active");

                menuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );

                menuToggle.textContent = "☰";

            });

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
                        behavior: "smooth",
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


    // 4. Skill Card Scroll Animation
    const skillCards = document.querySelectorAll(".skill-card");

    if ("IntersectionObserver" in window) {

        const observer = new IntersectionObserver(function (entries) {

            entries.forEach(function (entry) {

                if (entry.isIntersecting) {

                    entry.target.classList.add("show");

                    observer.unobserve(entry.target);

                }

            });

        }, {
            threshold: 0.15
        });

        skillCards.forEach(function (card) {
            observer.observe(card);
        });

    } else {

        skillCards.forEach(function (card) {
            card.classList.add("show");
        });

    }


    // 5. Project Card Interaction
    const projectCard = document.querySelector(".project-card");

    if (projectCard) {

        projectCard.addEventListener("click", function () {

            projectCard.classList.toggle("project-active");

        });

        projectCard.addEventListener("keydown", function (event) {

            if (event.key === "Escape") {
                projectCard.classList.remove("project-active");
            }

        });

    }

});