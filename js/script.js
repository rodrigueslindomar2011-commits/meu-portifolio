/* =========================================================
   MEU PORTIFÓLIO
   JavaScript principal
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTOS PRINCIPAIS
    ===================================================== */

    const menuButton = document.getElementById("menuButton");
    const nav = document.getElementById("nav");

    const navLinks = document.querySelectorAll(".nav-link");

    const sections = document.querySelectorAll("main section");

    const projectsTrack = document.getElementById("projectsTrack");
    const prevProject = document.getElementById("prevProject");
    const nextProject = document.getElementById("nextProject");

    const dots = document.querySelectorAll(".dot");

    const backTop = document.querySelector(".back-top");


    /* =====================================================
       MENU MOBILE
    ===================================================== */

    if (menuButton && nav) {

        menuButton.addEventListener("click", () => {

            nav.classList.toggle("active");

            const isOpen = nav.classList.contains("active");

            menuButton.setAttribute(
                "aria-expanded",
                isOpen
            );

            menuButton.innerHTML = isOpen
                ? '<i class="fa-solid fa-xmark"></i>'
                : '<i class="fa-solid fa-bars"></i>';

        });

    }


    /* =====================================================
       FECHAR MENU AO CLICAR EM LINK INTERNO
       NÃO INTERFERE EM LINKS EXTERNOS
    ===================================================== */

    navLinks.forEach(link => {

        link.addEventListener("click", () => {

            const href = link.getAttribute("href");

            /*
               Só fecha o menu automaticamente para
               links internos do próprio portfólio.
            */

            if (href && href.startsWith("#")) {

                if (nav) {
                    nav.classList.remove("active");
                }

                if (menuButton) {

                    menuButton.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                    menuButton.innerHTML =
                        '<i class="fa-solid fa-bars"></i>';

                }

            }

        });

    });


    /* =====================================================
       NAVEGAÇÃO ATIVA
    ===================================================== */

    function atualizarNavegacao() {

        let currentSection = "";

        sections.forEach(section => {

            const sectionTop =
                section.offsetTop - 160;

            const sectionHeight =
                section.offsetHeight;

            if (
                window.scrollY >= sectionTop &&
                window.scrollY < sectionTop + sectionHeight
            ) {

                currentSection = section.id;

            }

        });

        navLinks.forEach(link => {

            link.classList.remove("active");

            const target =
                link.getAttribute("href");

            if (
                target === `#${currentSection}`
            ) {

                link.classList.add("active");

            }

        });

    }

    window.addEventListener(
        "scroll",
        atualizarNavegacao
    );

    atualizarNavegacao();


    /* =====================================================
       PROTEÇÃO DOS LINKS EXTERNOS
    ===================================================== */

    /*
       Links externos continuam sendo links normais.
       O JavaScript não cancela o comportamento deles.

       São considerados externos:
       - https://
       - http://
       - mailto:
       - tel:
       - whatsapp
    */

    const externalLinks =
        document.querySelectorAll(
            'a[href^="http://"], ' +
            'a[href^="https://"], ' +
            'a[href^="mailto:"], ' +
            'a[href^="tel:"]'
        );

    externalLinks.forEach(link => {

        link.addEventListener("click", event => {

            /*
               IMPORTANTE:
               Não usar preventDefault() aqui.
               O navegador deve abrir normalmente.
            */

            event.stopPropagation();

        });

    });


    /* =====================================================
       CARROSSEL DE PROJETOS
    ===================================================== */

    let currentProject = 0;

    const projectCards =
        document.querySelectorAll(".project-card");

    const totalProjects =
        projectCards.length;


    function getVisibleProjects() {

        if (window.innerWidth <= 850) {
            return 1;
        }

        return 2;

    }


    function getMaxPosition() {

        const visible =
            getVisibleProjects();

        return Math.max(
            0,
            totalProjects - visible
        );

    }


    function atualizarCarrossel() {

        if (
            !projectsTrack ||
            totalProjects === 0
        ) {
            return;
        }

        const gap = 22;

        const cardWidth =
            projectCards[0].offsetWidth + gap;

        const maxPosition =
            getMaxPosition();

        if (currentProject > maxPosition) {
            currentProject = maxPosition;
        }

        if (currentProject < 0) {
            currentProject = 0;
        }

        const translateX =
            currentProject * cardWidth;

        projectsTrack.style.transform =
            `translateX(-${translateX}px)`;

        atualizarDots();
        atualizarBotoes();

    }


    /* =====================================================
       BOTÃO PRÓXIMO
    ===================================================== */

    if (nextProject) {

        nextProject.addEventListener(
            "click",
            () => {

                const maxPosition =
                    getMaxPosition();

                if (
                    currentProject <
                    maxPosition
                ) {

                    currentProject++;

                } else {

                    currentProject = 0;

                }

                atualizarCarrossel();

            }
        );

    }


    /* =====================================================
       BOTÃO ANTERIOR
    ===================================================== */

    if (prevProject) {

        prevProject.addEventListener(
            "click",
            () => {

                const maxPosition =
                    getMaxPosition();

                if (currentProject > 0) {

                    currentProject--;

                } else {

                    currentProject = maxPosition;

                }

                atualizarCarrossel();

            }
        );

    }


    /* =====================================================
       DOTS DO CARROSSEL
    ===================================================== */

    function atualizarDots() {

        if (!dots.length) {
            return;
        }

        dots.forEach((dot, index) => {

            dot.classList.remove("active");

            if (index === currentProject) {

                dot.classList.add("active");

            }

        });

    }


    dots.forEach((dot, index) => {

        dot.addEventListener(
            "click",
            () => {

                const maxPosition =
                    getMaxPosition();

                currentProject =
                    Math.min(
                        index,
                        maxPosition
                    );

                atualizarCarrossel();

            }
        );

    });


    /* =====================================================
       ESTADO DOS BOTÕES
    ===================================================== */

    function atualizarBotoes() {

        if (totalProjects <= 1) {
            return;
        }

        if (prevProject) {

            prevProject.setAttribute(
                "aria-label",
                currentProject === 0
                    ? "Ir para o último projeto"
                    : "Projeto anterior"
            );

        }

        if (nextProject) {

            nextProject.setAttribute(
                "aria-label",
                currentProject === getMaxPosition()
                    ? "Voltar para o primeiro projeto"
                    : "Próximo projeto"
            );

        }

    }


    /* =====================================================
       TECLADO — SETAS
    ===================================================== */

    document.addEventListener(
        "keydown",
        event => {

            const tag =
                document.activeElement.tagName;

            if (
                tag === "INPUT" ||
                tag === "TEXTAREA" ||
                tag === "SELECT"
            ) {
                return;
            }

            if (event.key === "ArrowRight") {

                const maxPosition =
                    getMaxPosition();

                currentProject =
                    currentProject < maxPosition
                        ? currentProject + 1
                        : 0;

                atualizarCarrossel();

            }

            if (event.key === "ArrowLeft") {

                const maxPosition =
                    getMaxPosition();

                currentProject =
                    currentProject > 0
                        ? currentProject - 1
                        : maxPosition;

                atualizarCarrossel();

            }

        }
    );


    /* =====================================================
       SWIPE / ARRASTAR NO CELULAR
    ===================================================== */

    let touchStartX = 0;
    let touchEndX = 0;

    if (projectsTrack) {

        projectsTrack.addEventListener(
            "touchstart",
            event => {

                touchStartX =
                    event.touches[0].clientX;

            },
            { passive: true }
        );


        projectsTrack.addEventListener(
            "touchend",
            event => {

                touchEndX =
                    event.changedTouches[0].clientX;

                verificarSwipe();

            },
            { passive: true }
        );

    }


    function verificarSwipe() {

        const distance =
            touchStartX - touchEndX;

        const minimumSwipe = 50;

        if (
            Math.abs(distance) <
            minimumSwipe
        ) {
            return;
        }

        const maxPosition =
            getMaxPosition();

        if (distance > 0) {

            currentProject =
                currentProject < maxPosition
                    ? currentProject + 1
                    : 0;

        } else {

            currentProject =
                currentProject > 0
                    ? currentProject - 1
                    : maxPosition;

        }

        atualizarCarrossel();

    }


    /* =====================================================
       REDIMENSIONAMENTO DA TELA
    ===================================================== */

    let resizeTimer;

    window.addEventListener(
        "resize",
        () => {

            clearTimeout(resizeTimer);

            resizeTimer = setTimeout(
                () => {

                    atualizarCarrossel();

                },
                100
            );

        }
    );


    /* =====================================================
       AUTOPLAY DO CARROSSEL
    ===================================================== */

    let autoplay;

    function iniciarAutoplay() {

        pararAutoplay();

        autoplay = setInterval(
            () => {

                const maxPosition =
                    getMaxPosition();

                if (maxPosition <= 0) {
                    return;
                }

                currentProject =
                    currentProject < maxPosition
                        ? currentProject + 1
                        : 0;

                atualizarCarrossel();

            },
            6000
        );

    }


    function pararAutoplay() {

        if (autoplay) {

            clearInterval(autoplay);

            autoplay = null;

        }

    }


    if (projectsTrack) {

        iniciarAutoplay();

        projectsTrack.addEventListener(
            "mouseenter",
            pararAutoplay
        );

        projectsTrack.addEventListener(
            "mouseleave",
            iniciarAutoplay
        );

        projectsTrack.addEventListener(
            "touchstart",
            pararAutoplay,
            { passive: true }
        );

        projectsTrack.addEventListener(
            "touchend",
            iniciarAutoplay,
            { passive: true }
        );

    }


    /* =====================================================
       BOTÃO VOLTAR AO TOPO
    ===================================================== */

    if (backTop) {

        backTop.addEventListener(
            "click",
            event => {

                event.preventDefault();

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

            }
        );

    }


    /* =====================================================
       ANIMAÇÃO DAS SEÇÕES
    ===================================================== */

    const animatedElements =
        document.querySelectorAll(
            ".skill-card, .project-card, .timeline-item, .about-content, .about-image, .contact-box"
        );


    if ("IntersectionObserver" in window) {

        const observer =
            new IntersectionObserver(
                entries => {

                    entries.forEach(entry => {

                        if (
                            entry.isIntersecting
                        ) {

                            entry.target.classList.add(
                                "show-element"
                            );

                            observer.unobserve(
                                entry.target
                            );

                        }

                    });

                },
                {
                    threshold: 0.12
                }
            );


        animatedElements.forEach(
            element => {

                element.classList.add(
                    "hidden-element"
                );

                observer.observe(element);

            }
        );

    }


    /* =====================================================
       ESTILOS DAS ANIMAÇÕES
    ===================================================== */

    const animationStyle =
        document.createElement("style");

    animationStyle.textContent = `

        .hidden-element {
            opacity: 0;
            transform: translateY(30px);
            transition:
                opacity 0.7s ease,
                transform 0.7s ease;
        }

        .show-element {
            opacity: 1;
            transform: translateY(0);
        }

        .skill-card:nth-child(2),
        .project-card:nth-child(2) {
            transition-delay: 0.08s;
        }

        .skill-card:nth-child(3),
        .project-card:nth-child(3) {
            transition-delay: 0.16s;
        }

        .skill-card:nth-child(4) {
            transition-delay: 0.24s;
        }

        .skill-card:nth-child(5) {
            transition-delay: 0.32s;
        }

        .skill-card:nth-child(6) {
            transition-delay: 0.40s;
        }

    `;

    document.head.appendChild(
        animationStyle
    );


    /* =====================================================
       HEADER AO ROLAR
    ===================================================== */

    const header =
        document.getElementById("header");

    function atualizarHeader() {

        if (!header) {
            return;
        }

        if (window.scrollY > 50) {

            header.classList.add(
                "scrolled"
            );

        } else {

            header.classList.remove(
                "scrolled"
            );

        }

    }

    window.addEventListener(
        "scroll",
        atualizarHeader
    );

    atualizarHeader();


    /* =====================================================
       EFEITO DO CURSOR
    ===================================================== */

    const cursor =
        document.querySelector(
            ".cursor-line span"
        );

    if (cursor) {

        let visible = true;

        setInterval(
            () => {

                visible = !visible;

                cursor.style.opacity =
                    visible ? "1" : "0";

            },
            500
        );

    }


    /* =====================================================
       ATUALIZA CARROSSEL INICIAL
    ===================================================== */

    atualizarCarrossel();


    /* =====================================================
       CONSOLE
    ===================================================== */

    console.log(
        "%cLindomar Rodrigues",
        "font-size: 22px; font-weight: bold;"
    );

    console.log(
        "%cPortfólio carregado com sucesso 🚀",
        "font-size: 14px;"
    );

});
