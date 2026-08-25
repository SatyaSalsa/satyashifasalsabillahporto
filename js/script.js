// =====================================================
// LOADING SCREEN
// =====================================================

const introScreen = document.getElementById("introScreen");
const loadingPercent = document.getElementById("loadingPercent");
const loadingProgress = document.getElementById("loadingProgress");

let progress = 0;

const loadingInterval = setInterval(() => {

    progress++;

    if (loadingPercent) {
        loadingPercent.textContent = `${progress}%`;
    }

    if (loadingProgress) {
        loadingProgress.style.width = `${progress}%`;
    }

    if (progress >= 100) {

        clearInterval(loadingInterval);

        setTimeout(() => {

            if (introScreen) {

                introScreen.classList.add("hide");

                setTimeout(() => {
                    introScreen.style.display = "none";
                }, 800);

            }

        }, 500);

    }

}, 35);


// =====================================================
// MOBILE MENU
// =====================================================

const menuToggle =
    document.getElementById("menuToggle");

const navMenu =
    document.getElementById("navMenu");

if (menuToggle && navMenu) {

    menuToggle.addEventListener("click", () => {

        navMenu.classList.toggle("show");

    });

}


// =====================================================
// NAVIGATION
// =====================================================

const sections =
    document.querySelectorAll("section[id]");

const navLinks =
    document.querySelectorAll(".nav-menu a");

window.addEventListener("scroll", () => {

    let current = "";

    sections.forEach(section => {

        const sectionTop =
            section.offsetTop - 160;

        const sectionHeight =
            section.offsetHeight;

        if (
            window.scrollY >= sectionTop &&
            window.scrollY < sectionTop + sectionHeight
        ) {

            current =
                section.getAttribute("id");

        }

    });


    navLinks.forEach(link => {

        link.classList.remove("active");

        if (
            link.getAttribute("href") ===
            `#${current}`
        ) {

            link.classList.add("active");

        }

    });

});


// =====================================================
// SMOOTH SCROLL
// =====================================================

navLinks.forEach(link => {

    link.addEventListener("click", function(event) {

        const href =
            this.getAttribute("href");

        if (
            !href ||
            !href.startsWith("#")
        ) {
            return;
        }

        const target =
            document.querySelector(href);

        if (target) {

            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }

        if (navMenu) {
            navMenu.classList.remove("show");
        }

    });

});


// =====================================================
// MUSIC PLAYER
// =====================================================

const musicAudio =
    document.getElementById("musicAudio");

const playMusic =
    document.getElementById("playMusic");

const prevMusic =
    document.getElementById("prevMusic");

const nextMusic =
    document.getElementById("nextMusic");

const musicProgress =
    document.getElementById("musicProgress");

const musicProgressContainer =
    document.getElementById(
        "musicProgressContainer"
    );

const currentTime =
    document.getElementById("currentTime");

const duration =
    document.getElementById("duration");


// =====================================================
// FORMAT TIME
// =====================================================

function formatTime(seconds) {

    if (
        isNaN(seconds) ||
        !isFinite(seconds)
    ) {

        return "0:00";

    }

    const minutes =
        Math.floor(seconds / 60);

    const secondsRemaining =
        Math.floor(seconds % 60);

    return (
        `${minutes}:` +
        `${secondsRemaining
            .toString()
            .padStart(2, "0")}`
    );

}


// =====================================================
// MUSIC STATE
// =====================================================

function setPlayingState() {

    if (!playMusic) {
        return;
    }

    playMusic.classList.add(
        "is-playing"
    );

    playMusic.setAttribute(
        "aria-label",
        "Pause"
    );

    playMusic.setAttribute(
        "title",
        "Pause"
    );

}


function setPausedState() {

    if (!playMusic) {
        return;
    }

    playMusic.classList.remove(
        "is-playing"
    );

    playMusic.setAttribute(
        "aria-label",
        "Play"
    );

    playMusic.setAttribute(
        "title",
        "Play"
    );

}


// =====================================================
// AUDIO EVENTS
// =====================================================

if (musicAudio) {

    musicAudio.addEventListener(
        "loadedmetadata",
        () => {

            if (duration) {

                duration.textContent =
                    formatTime(
                        musicAudio.duration
                    );

            }

        }
    );


    musicAudio.addEventListener(
        "timeupdate",
        () => {

            if (
                !musicAudio.duration ||
                !isFinite(musicAudio.duration)
            ) {

                return;

            }

            const percentage =
                (
                    musicAudio.currentTime /
                    musicAudio.duration
                ) * 100;


            if (musicProgress) {

                musicProgress.style.width =
                    `${percentage}%`;

            }


            if (currentTime) {

                currentTime.textContent =
                    formatTime(
                        musicAudio.currentTime
                    );

            }

        }
    );


    musicAudio.addEventListener(
        "play",
        setPlayingState
    );


    musicAudio.addEventListener(
        "playing",
        setPlayingState
    );


    musicAudio.addEventListener(
        "pause",
        setPausedState
    );


    musicAudio.addEventListener(
        "ended",
        () => {

            musicAudio.currentTime = 0;

            if (musicProgress) {
                musicProgress.style.width = "0%";
            }

            if (currentTime) {
                currentTime.textContent = "0:00";
            }

            setPausedState();

        }
    );


    musicAudio.addEventListener(
        "error",
        () => {

            console.error(
                "Music gagal dimuat. Pastikan:",
                "music/tenderly.mp4"
            );

        }
    );

}


// =====================================================
// PLAY / PAUSE
// =====================================================

if (
    playMusic &&
    musicAudio
) {

    playMusic.addEventListener(
        "click",
        async () => {

            try {

                if (!musicAudio.paused) {

                    musicAudio.pause();

                    return;

                }

                await musicAudio.play();

            }
            catch (error) {

                console.error(
                    "Music tidak dapat dimainkan:",
                    error
                );

            }

        }
    );

}


// =====================================================
// PROGRESS BAR CLICK
// =====================================================

if (
    musicProgressContainer &&
    musicAudio
) {

    musicProgressContainer.addEventListener(
        "click",
        event => {

            if (
                !musicAudio.duration ||
                !isFinite(
                    musicAudio.duration
                )
            ) {

                return;

            }


            const rect =
                musicProgressContainer
                    .getBoundingClientRect();


            const clickPosition =
                event.clientX -
                rect.left;


            let percentage =
                clickPosition /
                rect.width;


            percentage =
                Math.max(
                    0,
                    Math.min(
                        1,
                        percentage
                    )
                );


            musicAudio.currentTime =
                percentage *
                musicAudio.duration;

        }
    );

}


// =====================================================
// PREVIOUS
// =====================================================

if (
    prevMusic &&
    musicAudio
) {

    prevMusic.addEventListener(
        "click",
        () => {

            musicAudio.currentTime = 0;

            if (musicProgress) {
                musicProgress.style.width = "0%";
            }

            if (currentTime) {
                currentTime.textContent = "0:00";
            }

        }
    );

}


// =====================================================
// NEXT
// =====================================================

if (
    nextMusic &&
    musicAudio
) {

    nextMusic.addEventListener(
        "click",
        () => {

            if (
                musicAudio.duration &&
                isFinite(
                    musicAudio.duration
                )
            ) {

                musicAudio.currentTime =
                    musicAudio.duration;

            }

        }
    );

}


// =====================================================
// PROJECT DATA
// =====================================================
//
// SEMUA ISI PROJECT DIATUR DI SINI.
//
// Kalau mau mengubah project,
// cukup ubah bagian ini.
// Tidak perlu mengubah HTML.
//

const projectData = {

    // =================================================
    // DATA ANALYTICS
    // =================================================

    data1: {

        image: "images/data1.png",

        category: "Data Analytics",

        title: "Coffee Sales Dashboard",

        description:
            "This project analyzes coffee sales data to identify revenue patterns, transaction performance, best-selling coffee products, and sales trends based on hour, weekday, and month.",

        about:
            "A data analytics project focused on transforming raw coffee sales data into meaningful information through analysis and dashboard visualization.",

        technologies: [
            "Excel"
        ],

        actions: []

    },


    data2: {

        image: "images/data2.png",

        category: "Data Analytics",

        title: "Netflix Content Dashboard Analysis",

        description:
            "This project explores Netflix content data to identify content distribution, yearly additions, ratings, and countries with the highest number of available titles through an interactive dashboard.",

        about:
            "The project focuses on exploring Netflix content data and presenting the findings through an interactive dashboard.",

        technologies: [
            "Excel"
        ],

        actions: []

    },


    data3: {

        image: "images/data3.jpg",

        category: "Data Analytics",

        title: "Ramen Product Review Dashboard",

        description:
            "This project analyzes ramen review data to identify the most reviewed brands, highest-rated brands, distribution of product styles, and top-rated ramen varieties.",

        about:
            "A data analytics project that explores ramen product reviews to discover patterns in brands, ratings, countries, and product varieties.",

        technologies: [
            "Power BI"
        ],

        actions: []

    },


    data4: {

        image: "images/data4.jpg",

        category: "Data Analytics",

        title: "E-Commerce Sales Dashboard",

        description:
            "This project analyzes e-commerce sales data to evaluate sales, profit, orders, quantity, discounts, and shipping costs while identifying the best-performing products, categories, regions, and customer segments.",

        about:
            "An e-commerce sales analytics project designed to present sales performance and business insights through an interactive dashboard.",

        technologies: [
            "Excel",
            "Looker Studio"
        ],

        actions: []

    },


    data5: {

        image: "images/data5.png",

        category: "Data Analytics",

        title: "Olist E-Commerce Customer Dashboard",

        description:
            "This project explores e-commerce customer data to identify states and cities with the highest number of customers, providing insights into customer distribution across different regions.",

        about:
            "A customer analytics project focused on exploring customer distribution across states and cities using e-commerce data.",

        technologies: [
            "Python",
            "Pandas",
            "Matplotlib",
            "Jupyter Notebook"
        ],

        actions: []

    },


    data6: {

        image: "images/data6.png",

        category: "Data Analytics",

        title: "TMDB Movie Credits Analysis",

        description:
            "This project analyzes TMDB movie credits data to examine cast and crew distributions, their relationship, and the movies with the largest cast through exploratory data analysis.",

        about:
            "An exploratory data analysis project focused on understanding movie cast and crew data and discovering patterns within the dataset.",

        technologies: [
            "Python",
            "Pandas",
            "Matplotlib",
            "Jupyter Notebook"
        ],

        actions: []

    },


    // =================================================
    // WEB DEVELOPMENT
    // =================================================

    web1: {

        image: "images/web1.png",

        category: "Web Development",

        title: "Klinik Kecantikan (On Hold)",

        description:
            "A modern beauty clinic website designed to showcase treatments, articles, location, and clinic information with a clean and user-friendly interface.",

        about:
            "This project presents a beauty clinic website featuring a responsive navigation menu, treatment information, articles, location details, and a visually engaging landing page designed to provide a comfortable user experience.",

        technologies: [
            "Laravel",
            "Bootstrap",
            "PHP"
        ],

        actions: [

            {
                type: "github",
                text: "GitHub",
                url: "https://github.com/SatyaSalsa/klinik-kecantikan-on-going"
            }

        ]

    },


    web2: {

        image: "images/web2.png",

        category: "Web Development",

        title: "Sistem Penggajian Berbasis Website",

        description:
            "A web-based payroll management system designed to manage employee, attendance, position, and salary data.",

        about:
            "This project provides an administrative dashboard for managing employee information, job positions, attendance records, payroll data, and reports through an organized web-based system.",

        technologies: [
            "Laravel",
            "Bootstrap",
            "MySQL",
            "PHP"
        ],

        actions: [

            {
                type: "github",
                text: "GitHub",
                url: "https://github.com/SatyaSalsa/sisitem-penggajian"
            }

        ]

    },


    web3: {

        image: "images/web3.png",

        category: "Web Development",

        title: "Personal Portfolio (01)",

        description:
            "A personal portfolio website designed to showcase projects and skills in data analytics and web development.",

        about:
            "This project focuses on creating a clean and aesthetic portfolio website with dedicated sections for personal information, data analytics projects, and web development projects.",

        technologies: [
            "HTML",
            "CSS",
            "JavaScript"
        ],

        actions: [

            {
                type: "demo",
                text: "Live Demo",
                url: "https://satyasalsa.github.io/satyaporto/"
            }

        ]

    },


    web4: {

        image: "images/web4.png",

        category: "Web Development",

        title: "Sistem Pendukung Keputusan Layanan Terbaik di Bordir Khana",

        description:
            "A web-based decision support system designed to determine service priorities using the Simple Additive Weighting (SAW) method.",

        about:
            "This project implements a decision support system for ranking embroidery services based on several evaluation criteria, including customer demand, processing time, and design complexity.",

        technologies: [
            "Laravel",
            "Bootstrap",
            "MySQL",
            "PHP"
        ],

    }

};


// =====================================================
// PROJECT GRID
// =====================================================

const dataProjectGrid =
    document.getElementById(
        "dataProjectGrid"
    );

const webProjectGrid =
    document.getElementById(
        "webProjectGrid"
    );


// =====================================================
// CREATE PROJECT CARD
// =====================================================

function createProjectCard(
    projectId,
    project,
    number
) {

    const article =
        document.createElement("article");

    article.className =
        "project-card";


    article.innerHTML = `

        <div class="project-image">

            <img
                src="${project.image}"
                alt="${project.title}">

            <div class="project-number">
                ${String(number).padStart(2, "0")}
            </div>

        </div>


        <div class="project-card-content">

            <span class="project-type">
                ${project.category}
            </span>

            <h4>
                ${project.title}
            </h4>

            <p>
                ${project.description}
            </p>


            <div class="project-actions">

                <button
                    type="button"
                    class="project-button"
                    data-project="${projectId}">

                    View Details

                    <iconify-icon
                        icon="solar:arrow-right-linear">
                    </iconify-icon>

                </button>

                ${
                    project.actions &&
                    project.actions.length > 0
                    ? createCardAction(
                        project.actions[0]
                    )
                    : ""
                }

            </div>

        </div>

    `;


    return article;

}


// =====================================================
// CREATE CARD ACTION
// =====================================================

function createCardAction(action) {

    if (!action || !action.url) {
        return "";
    }

    if (action.url === "#") {
        return "";
    }


    if (action.type === "github") {

        return `

            <a
                href="${action.url}"
                class="project-icon-button"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub">

                <iconify-icon
                    icon="mdi:github">
                </iconify-icon>

            </a>

        `;

    }


    return `

        <a
            href="${action.url}"
            class="project-icon-button"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Live Demo">

            <iconify-icon
                icon="solar:global-linear">
            </iconify-icon>

        </a>

    `;

}


// =====================================================
// RENDER PROJECTS
// =====================================================

function renderProjects() {

    if (dataProjectGrid) {

        dataProjectGrid.innerHTML = "";

        const dataProjects =
            Object.entries(projectData)
                .filter(([id]) =>
                    id.startsWith("data")
                );


        dataProjects.forEach(
            ([projectId, project], index) => {

                const card =
                    createProjectCard(
                        projectId,
                        project,
                        index + 1
                    );

                dataProjectGrid.appendChild(card);

            }
        );

    }


    if (webProjectGrid) {

        webProjectGrid.innerHTML = "";

        const webProjects =
            Object.entries(projectData)
                .filter(([id]) =>
                    id.startsWith("web")
                );


        webProjects.forEach(
            ([projectId, project], index) => {

                const card =
                    createProjectCard(
                        projectId,
                        project,
                        index + 1
                    );

                webProjectGrid.appendChild(card);

            }
        );

    }

}


// =====================================================
// PROJECT DETAIL ELEMENTS
// =====================================================

const projectModal =
    document.getElementById(
        "projectModal"
    );

const projectModalClose =
    document.getElementById(
        "projectModalClose"
    );

const projectModalBackdrop =
    document.getElementById(
        "projectModalBackdrop"
    );

const detailImage =
    document.getElementById(
        "detailImage"
    );

const detailCategory =
    document.getElementById(
        "detailCategory"
    );

const detailTitle =
    document.getElementById(
        "detailTitle"
    );

const detailDescription =
    document.getElementById(
        "detailDescription"
    );

const detailAbout =
    document.getElementById(
        "detailAbout"
    );

const detailTechnologies =
    document.getElementById(
        "detailTechnologies"
    );

const detailActions =
    document.getElementById(
        "detailActions"
    );


// =====================================================
// OPEN PROJECT DETAIL
// =====================================================

function openProjectDetail(projectId) {

    const project =
        projectData[projectId];


    if (
        !project ||
        !projectModal
    ) {

        return;

    }


    // IMAGE

    if (detailImage) {

        detailImage.src =
            project.image;

        detailImage.alt =
            project.title;

    }


    // CATEGORY

    if (detailCategory) {

        detailCategory.textContent =
            project.category;

    }


    // TITLE

    if (detailTitle) {

        detailTitle.textContent =
            project.title;

    }


    // DESCRIPTION

    if (detailDescription) {

        detailDescription.textContent =
            project.description;

    }


    // ABOUT

    if (detailAbout) {

        detailAbout.textContent =
            project.about ||
            project.description;

    }


    // TECHNOLOGIES

    if (detailTechnologies) {

        detailTechnologies.innerHTML = "";


        if (
            project.technologies &&
            project.technologies.length
        ) {

            project.technologies.forEach(
                technology => {

                    const tag =
                        document.createElement(
                            "span"
                        );

                    tag.textContent =
                        technology;

                    detailTechnologies
                        .appendChild(tag);

                }
            );

        }

    }


    // ACTIONS

    if (detailActions) {

        detailActions.innerHTML = "";


        if (
            project.actions &&
            project.actions.length
        ) {

            project.actions.forEach(
                action => {

                    if (
                        !action.url ||
                        action.url === "#"
                    ) {
                        return;
                    }


                    const link =
                        document.createElement(
                            "a"
                        );


                    link.href =
                        action.url;

                    link.className =
                        "detail-action-btn primary";

                    link.target =
                        "_blank";

                    link.rel =
                        "noopener noreferrer";


                    if (
                        action.type ===
                        "github"
                    ) {

                        link.innerHTML = `

                            <iconify-icon
                                icon="mdi:github">
                            </iconify-icon>

                            ${action.text}

                        `;

                    }
                    else {

                        link.innerHTML = `

                            <iconify-icon
                                icon="solar:play-circle-linear">
                            </iconify-icon>

                            ${action.text}

                        `;

                    }


                    detailActions
                        .appendChild(link);

                }
            );

        }

    }


    // SHOW MODAL

    projectModal.classList.add(
        "show"
    );

    projectModal.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.classList.add(
        "modal-open"
    );

}


// =====================================================
// CLOSE PROJECT DETAIL
// =====================================================

function closeProjectDetail() {

    if (!projectModal) {
        return;
    }


    projectModal.classList.remove(
        "show"
    );

    projectModal.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.classList.remove(
        "modal-open"
    );

}


// =====================================================
// VIEW DETAIL BUTTONS
// =====================================================

document.addEventListener(
    "click",
    event => {

        const button =
            event.target.closest(
                "[data-project]"
            );


        if (!button) {
            return;
        }


        const projectId =
            button.getAttribute(
                "data-project"
            );


        if (projectId) {

            openProjectDetail(
                projectId
            );

        }

    }
);


// =====================================================
// CLOSE BUTTON
// =====================================================

if (projectModalClose) {

    projectModalClose.addEventListener(
        "click",
        closeProjectDetail
    );

}


// =====================================================
// CLICK BACKDROP
// =====================================================

if (projectModalBackdrop) {

    projectModalBackdrop.addEventListener(
        "click",
        closeProjectDetail
    );

}


// =====================================================
// ESC KEY
// =====================================================

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape" &&
            projectModal &&
            projectModal.classList.contains(
                "show"
            )
        ) {

            closeProjectDetail();

        }

    }
);


// =====================================================
// RENDER PROJECTS
// =====================================================

renderProjects();


// =====================================================
// INITIAL STATE
// =====================================================

setPausedState();