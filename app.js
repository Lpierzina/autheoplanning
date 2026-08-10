/*
 * Documentation Frontend
 *
 * Responsibilities:
 * - Load docs.json
 * - Build documentation navigation
 * - Load Markdown files
 * - Render Markdown
 * - Generate table of contents
 * - Syntax highlighting
 * - Search
 * - Routing
 * - Previous / next navigation
 * - GitHub links
 *
 * Files:
 *
 * index.html
 * app.js
 * styles.css
 * docs.json
 * docs/
 */

"use strict";

const CONFIG = {
    manifest: "docs.json",
    docsDirectory: "docs/",
    defaultPage: null
};

const state = {
    config: null,
    pages: [],
    currentPage: null,
    filteredPages: [],
    searchQuery: ""
};


/* =========================================================
   DOM
   ========================================================= */

const DOM = {
    navigation: null,
    content: null,
    search: null,
    breadcrumbs: null,
    toc: null,
    tocLinks: null,
    pageNavigation: null,
    projectName: null,
    projectVersion: null,
    githubLink: null,
    editLink: null,
    pageCount: null,
    sidebar: null,
    overlay: null,
    openSidebar: null,
    closeSidebar: null
};


/* =========================================================
   INITIALIZATION
   ========================================================= */

document.addEventListener("DOMContentLoaded", init);

async function init() {

    cacheDOM();

    setupEvents();

    try {

        await waitForLibraries();

        await loadManifest();

        buildPages();

        renderNavigation();

        updatePageCount();

        route();

    } catch (error) {

        console.error("Documentation initialization failed:", error);

        showError(
            "Unable to load documentation.",
            error.message
        );
    }
}


/* =========================================================
   DOM CACHE
   ========================================================= */

function cacheDOM() {

    DOM.navigation = document.getElementById("navigation");
    DOM.content = document.getElementById("content");
    DOM.search = document.getElementById("search");
    DOM.breadcrumbs = document.getElementById("breadcrumbs");
    DOM.toc = document.getElementById("toc");
    DOM.tocLinks = document.getElementById("toc-links");
    DOM.pageNavigation = document.getElementById("page-navigation");

    DOM.projectName = document.getElementById("project-name");
    DOM.projectVersion = document.getElementById("project-version");

    DOM.githubLink = document.getElementById("github-link");
    DOM.editLink = document.getElementById("edit-link");

    DOM.pageCount = document.getElementById("page-count");

    DOM.sidebar = document.getElementById("sidebar");
    DOM.overlay = document.getElementById("sidebar-overlay");

    DOM.openSidebar = document.getElementById("open-sidebar");
    DOM.closeSidebar = document.getElementById("close-sidebar");
}


/* =========================================================
   EVENTS
   ========================================================= */

function setupEvents() {

    window.addEventListener(
        "hashchange",
        route
    );

    DOM.search.addEventListener(
        "input",
        handleSearch
    );

    DOM.search.addEventListener(
        "keydown",
        event => {

            if (event.key === "Escape") {

                DOM.search.value = "";

                handleSearch({
                    target: DOM.search
                });

                DOM.search.blur();
            }

        }
    );

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "/" &&
                document.activeElement !== DOM.search
            ) {

                event.preventDefault();

                DOM.search.focus();
            }

        }
    );

    DOM.openSidebar?.addEventListener(
        "click",
        openMobileSidebar
    );

    DOM.closeSidebar?.addEventListener(
        "click",
        closeMobileSidebar
    );

    DOM.overlay?.addEventListener(
        "click",
        closeMobileSidebar
    );
}


/* =========================================================
   WAIT FOR EXTERNAL LIBRARIES
   ========================================================= */

function waitForLibraries() {

    return new Promise(resolve => {

        const start = Date.now();

        const check = () => {

            if (
                typeof marked !== "undefined" &&
                typeof hljs !== "undefined"
            ) {

                resolve();

                return;
            }

            if (Date.now() - start > 10000) {

                resolve();

                return;
            }

            requestAnimationFrame(check);
        };

        check();
    });
}


/* =========================================================
   LOAD MANIFEST
   ========================================================= */

async function loadManifest() {

    const response = await fetch(
        CONFIG.manifest,
        {
            cache: "no-cache"
        }
    );

    if (!response.ok) {

        throw new Error(
            `Could not load ${CONFIG.manifest}`
        );
    }

    state.config = await response.json();

    applyProjectConfiguration();
}


/* =========================================================
   PROJECT CONFIGURATION
   ========================================================= */

function applyProjectConfiguration() {

    const config = state.config;

    const name =
        config.name ||
        "Documentation";

    const version =
        config.version ||
        "Docs";

    document.title =
        config.title ||
        `${name} Documentation`;

    DOM.projectName.textContent = name;

    DOM.projectVersion.textContent = version;

    if (config.github) {

        DOM.githubLink.href = config.github;

    } else {

        DOM.githubLink.style.display = "none";
    }
}


/* =========================================================
   BUILD PAGE LIST
   ========================================================= */

function buildPages() {

    state.pages = [];

    const sections =
        state.config.sections || [];

    sections.forEach(section => {

        if (!Array.isArray(section.pages)) {
            return;
        }

        section.pages.forEach(page => {

            if (!page.file) {
                return;
            }

            state.pages.push({
                ...page,

                section:
                    section.title ||
                    "Documentation",

                file:
                    normalizePath(page.file),

                slug:
                    createSlug(
                        page.file
                    )
            });

        });

    });

    state.filteredPages = [
        ...state.pages
    ];
}


/* =========================================================
   NAVIGATION
   ========================================================= */

function renderNavigation() {

    DOM.navigation.innerHTML = "";

    if (!state.pages.length) {

        DOM.navigation.innerHTML = `
            <div class="empty-state">
                No documentation pages found.
            </div>
        `;

        return;
    }

    const grouped = {};

    state.filteredPages.forEach(page => {

        if (!grouped[page.section]) {

            grouped[page.section] = [];
        }

        grouped[page.section].push(page);

    });

    Object.entries(grouped).forEach(
        ([sectionName, pages]) => {

            const section =
                document.createElement("div");

            section.className =
                "nav-section";

            const title =
                document.createElement("div");

            title.className =
                "nav-section-title";

            title.textContent =
                sectionName;

            section.appendChild(title);

            pages.forEach(page => {

                const link =
                    document.createElement("a");

                link.className =
                    "nav-link";

                link.href =
                    `#${page.slug}`;

                link.dataset.slug =
                    page.slug;

                link.textContent =
                    page.title ||
                    filenameToTitle(page.file);

                if (
                    state.currentPage &&
                    state.currentPage.slug === page.slug
                ) {

                    link.classList.add(
                        "active"
                    );
                }

                section.appendChild(link);
            });

            DOM.navigation.appendChild(
                section
            );
        }
    );
}


/* =========================================================
   ROUTING
   ========================================================= */

function route() {

    let slug =
        window.location.hash
            .replace(/^#/, "")
            .trim();

    if (!slug) {

        const firstPage =
            state.pages[0];

        if (!firstPage) {
            return;
        }

        slug = firstPage.slug;
    }

    const page =
        state.pages.find(
            item => item.slug === slug
        );

    if (!page) {

        showError(
            "Page not found",
            `No documentation page matches "${slug}".`
        );

        return;
    }

    loadPage(page);
}


/* =========================================================
   LOAD MARKDOWN PAGE
   ========================================================= */

async function loadPage(page) {

    state.currentPage = page;

    renderNavigation();

    DOM.content.innerHTML = `
        <div class="loading-content">
            <div class="spinner"></div>
            <p>Loading ${escapeHTML(
                page.title || "document"
            )}...</p>
        </div>
    `;

    updateBreadcrumbs(page);

    updateEditLink(page);

    try {

        const response =
            await fetch(
                page.file,
                {
                    cache: "no-cache"
                }
            );

        if (!response.ok) {

            throw new Error(
                `HTTP ${response.status}`
            );
        }

        const markdown =
            await response.text();

        renderMarkdown(markdown);

        buildTableOfContents();

        renderPageNavigation();

        scrollToTop();

        closeMobileSidebar();

    } catch (error) {

        console.error(error);

        showError(
            "Unable to load document",
            `${page.file} could not be loaded.`
        );
    }
}


/* =========================================================
   MARKDOWN RENDERING
   ========================================================= */

function renderMarkdown(markdown) {

    marked.setOptions({

        gfm: true,

        breaks: false,

        headerIds: false,

        mangle: false
    });

    DOM.content.innerHTML =
        marked.parse(markdown);

    processHeadings();

    processCodeBlocks();

    processLinks();
}


/* =========================================================
   HEADINGS
   ========================================================= */

function processHeadings() {

    const headings =
        DOM.content.querySelectorAll(
            "h1, h2, h3, h4, h5, h6"
        );

    const usedIds = new Set();

    headings.forEach(heading => {

        const text =
            heading.textContent.trim();

        let id =
            slugify(text);

        if (!id) {
            id = "section";
        }

        let uniqueId = id;

        let count = 2;

        while (usedIds.has(uniqueId)) {

            uniqueId =
                `${id}-${count}`;

            count++;
        }

        usedIds.add(uniqueId);

        heading.id = uniqueId;
    });
}


/* =========================================================
   CODE BLOCKS
   ========================================================= */

function processCodeBlocks() {

    const blocks =
        DOM.content.querySelectorAll(
            "pre code"
        );

    blocks.forEach(block => {

        const pre =
            block.parentElement;

        const language =
            getCodeLanguage(block);

        if (
            language &&
            hljs.getLanguage(language)
        ) {

            block.classList.add(
                `language-${language}`
            );

            hljs.highlightElement(
                block
            );
        }

        addCopyButton(pre);
    });
}


function getCodeLanguage(block) {

    const className =
        block.className || "";

    const match =
        className.match(
            /language-([\w-]+)/
        );

    if (!match) {
        return null;
    }

    return match[1];
}


/* =========================================================
   COPY CODE
   ========================================================= */

function addCopyButton(pre) {

    if (
        pre.querySelector(
            ".copy-button"
        )
    ) {
        return;
    }

    const button =
        document.createElement("button");

    button.className =
        "copy-button";

    button.textContent =
        "Copy";

    button.addEventListener(
        "click",
        async () => {

            const code =
                pre.querySelector("code");

            if (!code) {
                return;
            }

            try {

                await navigator.clipboard.writeText(
                    code.innerText
                );

                button.textContent =
                    "Copied";

                setTimeout(() => {

                    button.textContent =
                        "Copy";

                }, 1500);

            } catch {

                button.textContent =
                    "Failed";

                setTimeout(() => {

                    button.textContent =
                        "Copy";

                }, 1500);
            }
        }
    );

    pre.appendChild(button);
}


/* =========================================================
   LINKS
   ========================================================= */

function processLinks() {

    const links =
        DOM.content.querySelectorAll(
            "a"
        );

    links.forEach(link => {

        const href =
            link.getAttribute("href");

        if (!href) {
            return;
        }

        if (
            href.startsWith("http://") ||
            href.startsWith("https://")
        ) {

            link.target =
                "_blank";

            link.rel =
                "noopener noreferrer";

            return;
        }

        if (
            href.endsWith(".md")
        ) {

            const matchingPage =
                findPageByFile(href);

            if (matchingPage) {

                link.href =
                    `#${matchingPage.slug}`;

                link.addEventListener(
                    "click",
                    event => {

                        event.preventDefault();

                        window.location.hash =
                            matchingPage.slug;
                    }
                );
            }
        }
    });
}


function findPageByFile(file) {

    const normalized =
        normalizePath(file)
            .replace(/^\.?\//, "");

    return state.pages.find(
        page =>
            normalizePath(page.file)
                .replace(/^\.?\//, "")
                .endsWith(normalized)
    );
}


/* =========================================================
   TABLE OF CONTENTS
   ========================================================= */

function buildTableOfContents() {

    DOM.tocLinks.innerHTML = "";

    const headings =
        DOM.content.querySelectorAll(
            "h2, h3"
        );

    if (!headings.length) {

        DOM.toc.classList.add(
            "hidden"
        );

        return;
    }

    DOM.toc.classList.remove(
        "hidden"
    );

    headings.forEach(heading => {

        const link =
            document.createElement("a");

        link.href =
            `#${state.currentPage.slug}/${heading.id}`;

        link.textContent =
            heading.textContent;

        link.className =
            `toc-link toc-${heading.tagName.toLowerCase()}`;

        link.addEventListener(
            "click",
            event => {

                event.preventDefault();

                heading.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        );

        DOM.tocLinks.appendChild(
            link
        );
    });
}


/* =========================================================
   BREADCRUMBS
   ========================================================= */

function updateBreadcrumbs(page) {

    DOM.breadcrumbs.innerHTML = "";

    const section =
        document.createElement("span");

    section.textContent =
        page.section;

    const separator =
        document.createElement("span");

    separator.textContent =
        "/";

    separator.className =
        "breadcrumb-separator";

    const title =
        document.createElement("strong");

    title.textContent =
        page.title ||
        filenameToTitle(page.file);

    DOM.breadcrumbs.appendChild(
        section
    );

    DOM.breadcrumbs.appendChild(
        separator
    );

    DOM.breadcrumbs.appendChild(
        title
    );
}


/* =========================================================
   GITHUB EDIT LINK
   ========================================================= */

function updateEditLink(page) {

    if (!state.config.github) {

        DOM.editLink.style.display =
            "none";

        return;
    }

    const base =
        state.config.github.replace(
            /\/$/,
            ""
        );

    DOM.editLink.href =
        `${base}/blob/main/${page.file}`;
}


/* =========================================================
   PREVIOUS / NEXT
   ========================================================= */

function renderPageNavigation() {

    DOM.pageNavigation.innerHTML = "";

    if (!state.currentPage) {
        return;
    }

    const index =
        state.pages.findIndex(
            page =>
                page.slug ===
                state.currentPage.slug
        );

    if (index === -1) {
        return;
    }

    const previous =
        state.pages[index - 1];

    const next =
        state.pages[index + 1];

    if (previous) {

        DOM.pageNavigation.appendChild(
            createPageNav(
                "Previous",
                previous,
                "previous"
            )
        );
    } else {

        DOM.pageNavigation.appendChild(
            document.createElement("div")
        );
    }

    if (next) {

        DOM.pageNavigation.appendChild(
            createPageNav(
                "Next",
                next,
                "next"
            )
        );
    }
}


function createPageNav(
    label,
    page,
    direction
) {

    const link =
        document.createElement("a");

    link.href =
        `#${page.slug}`;

    link.className =
        `page-nav-link ${direction}`;

    link.innerHTML = `
        <span class="page-nav-label">
            ${label}
        </span>

        <strong>
            ${escapeHTML(
                page.title ||
                filenameToTitle(page.file)
            )}
        </strong>
    `;

    return link;
}


/* =========================================================
   SEARCH
   ========================================================= */

function handleSearch(event) {

    const query =
        event.target.value
            .trim()
            .toLowerCase();

    state.searchQuery =
        query;

    if (!query) {

        state.filteredPages = [
            ...state.pages
        ];

        renderNavigation();

        return;
    }

    state.filteredPages =
        state.pages.filter(page => {

            const title =
                (
                    page.title || ""
                ).toLowerCase();

            const section =
                (
                    page.section || ""
                ).toLowerCase();

            const file =
                page.file.toLowerCase();

            return (
                title.includes(query) ||
                section.includes(query) ||
                file.includes(query)
            );
        });

    renderNavigation();
}


/* =========================================================
   PAGE COUNT
   ========================================================= */

function updatePageCount() {

    const count =
        state.pages.length;

    DOM.pageCount.textContent =
        `${count} ${count === 1 ? "page" : "pages"}`;
}


/* =========================================================
   MOBILE SIDEBAR
   ========================================================= */

function openMobileSidebar() {

    DOM.sidebar.classList.add(
        "open"
    );

    DOM.overlay.classList.add(
        "visible"
    );

    document.body.classList.add(
        "sidebar-open"
    );
}


function closeMobileSidebar() {

    DOM.sidebar.classList.remove(
        "open"
    );

    DOM.overlay.classList.remove(
        "visible"
    );

    document.body.classList.remove(
        "sidebar-open"
    );
}


/* =========================================================
   ERRORS
   ========================================================= */

function showError(
    title,
    message
) {

    DOM.content.innerHTML = `
        <div class="error-page">

            <div class="error-icon">
                !
            </div>

            <h1>
                ${escapeHTML(title)}
            </h1>

            <p>
                ${escapeHTML(message)}
            </p>

            <button
                class="retry-button"
                onclick="location.reload()"
            >
                Reload documentation
            </button>

        </div>
    `;

    DOM.toc.classList.add(
        "hidden"
    );
}


/* =========================================================
   HELPERS
   ========================================================= */

function normalizePath(path) {

    return String(path)
        .replace(/\\/g, "/")
        .replace(/^\/+/, "");
}


function createSlug(file) {

    return normalizePath(file)
        .replace(/^docs\//, "")
        .replace(/\.md$/i, "")
        .split("/")
        .map(slugify)
        .join("/");
}


function slugify(value) {

    return String(value)
        .toLowerCase()
        .trim()
        .replace(/['"]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}


function filenameToTitle(file) {

    const filename =
        normalizePath(file)
            .split("/")
            .pop()
            .replace(/\.md$/i, "");

    return filename
        .replace(/[-_]+/g, " ")
        .replace(/\b\w/g, char =>
            char.toUpperCase()
        );
}


function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


function scrollToTop() {

    window.scrollTo({
        top: 0,
        behavior: "instant"
    });
}
