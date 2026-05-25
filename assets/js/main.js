/**
 * Ramm Lakshmanan Portfolio - Core Interactions & Visual Effects
 */

document.addEventListener("DOMContentLoaded", () => {
    // 1. LIGHT/DARK THEME TOGGLER LOGIC (Default: Light Mode)
    const themeToggleBtn = document.getElementById("theme-toggle-btn");
    const currentTheme = localStorage.getItem("theme") || "light";

    // Set initial theme
    document.documentElement.setAttribute("data-theme", currentTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener("click", () => {
            const theme = document.documentElement.getAttribute("data-theme");
            let newTheme = "light";

            if (theme === "light") {
                newTheme = "dark";
            }

            document.documentElement.setAttribute("data-theme", newTheme);
            localStorage.setItem("theme", newTheme);
            console.log(`Theme toggled to: ${newTheme}`);
        });
    }

    // 2. SCROLL NAVBAR EFFECTS & ACTIVE LINK HIGHLIGHTER
    const navbar = document.querySelector(".navbar");
    const navLinks = document.querySelectorAll(".nav-link");
    const sections = document.querySelectorAll("section");

    window.addEventListener("scroll", () => {
        // Toggle navbar scrolled class
        if (window.scrollY > 50) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }

        // Active link highlighter on scroll
        let currentSection = "";
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop - 180) {
                currentSection = section.getAttribute("id") || "";
            }
        });

        navLinks.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${currentSection}`) {
                link.classList.add("active");
            }
        });
    });

    // 3. MOBILE MENU TOGGLE
    const mobileMenuBtn = document.getElementById("mobile-menu-btn");
    const navLinksContainer = document.querySelector(".nav-links");

    if (mobileMenuBtn && navLinksContainer) {
        mobileMenuBtn.addEventListener("click", () => {
            navLinksContainer.classList.toggle("active");

            // Toggle hamburger icon between ☰ and ✕
            if (navLinksContainer.classList.contains("active")) {
                mobileMenuBtn.innerHTML = "&#x2715;"; // ✕ Close symbol
            } else {
                mobileMenuBtn.innerHTML = "&#x2630;"; // ☰ Hamburger symbol
            }
        });

        // Close mobile menu when clicking a link
        navLinks.forEach(link => {
            link.addEventListener("click", () => {
                navLinksContainer.classList.remove("active");
                mobileMenuBtn.innerHTML = "&#x2630;";
            });
        });
    }

    // 4. TERMINAL TYPING EFFECT FOR HERO SECTION
    const words = [
        "Software Engineer Intern",
        "Competitive Programmer",
        "Data Structures Enthusiast",
        "Full-Stack Developer"
    ];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingTextEl = document.getElementById("typing-text");

    function typeEffect() {
        if (!typingTextEl) return;

        const currentWord = words[wordIndex];

        if (isDeleting) {
            // Remove character
            typingTextEl.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            // Add character
            typingTextEl.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }

        // Typing speed logic
        let typingSpeed = isDeleting ? 40 : 80;

        // If completed word
        if (!isDeleting && charIndex === currentWord.length) {
            typingSpeed = 2000; // Pause at end of word
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typingSpeed = 300; // Brief pause before typing next word
        }

        setTimeout(typeEffect, typingSpeed);
    }

    // Start typing effect
    setTimeout(typeEffect, 1000);

    // 5. PROFILE PICTURE CYCLING LOGIC (Every 4-5 seconds)
    const profileImages = [
        "assets/images/profile-1.jpeg",
        "assets/images/profile-3.jpeg",
        "assets/images/profile-4.jpeg",
        "assets/images/profile-5.jpeg"
    ];
    let currentImgIdx = 0;
    const heroProfileImg = document.getElementById("hero-profile-img");

    if (heroProfileImg) {
        setInterval(() => {
            heroProfileImg.classList.add("fade-out");
            setTimeout(() => {
                currentImgIdx = (currentImgIdx + 1) % profileImages.length;
                heroProfileImg.src = profileImages[currentImgIdx];
                heroProfileImg.classList.remove("fade-out");
            }, 500); // Wait for fade-out animation to complete
        }, 4500); // Transition every 4.5 seconds
    }

    // 6. SCROLL REVEAL EFFECTS (IntersectionObserver)
    const revealElements = document.querySelectorAll(".reveal");

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // 6a. DEDICATED OBSERVER: Funny Logs — triggers when About section scrolls into view
    const aboutSection = document.getElementById("about");
    const logsOutput = document.getElementById("funny-logs-output");
    let logsStarted = false;

    const runFunnyLogs = () => {
        if (!logsOutput || logsStarted) return;
        logsStarted = true;

        const funnySnippets = [
            // snippet 1 lines
            [
                { text: "> Initialize coffee.exe...",   color: "inherit"  },
                { text: "[OK] 404 Coffee Not Found. Brain functioning at 20%.", color: "#10b981" },
                { text: "> git commit -m 'it works, don\\'t touch it'", color: "inherit" },
                { text: "[WARN] 47 uncommitted changes ignored.", color: "#f59e0b" },
                { text: "> npm install",                color: "inherit"  },
                { text: "[ERROR] 823 vulnerabilities found.", color: "#ef4444" },
            ],
            // snippet 2 lines (cycles after first set completes)
            [
                { text: "> Compiling code...",          color: "inherit"  },
                { text: "[ERROR] Missing semicolon at line 42.", color: "#ef4444" },
                { text: "> Fixing semicolon...",        color: "inherit"  },
                { text: "[ERROR] 105 new errors appeared.", color: "#ef4444" },
                { text: "> StackOverflow: 'how to center a div'", color: "inherit" },
                { text: "[SUCCESS] Div centered. App crashed.", color: "#10b981" },
            ],
            // snippet 3 lines
            [
                { text: "> git push --force origin main", color: "inherit" },
                { text: "[WARN] You have been removed from the repo.", color: "#f59e0b" },
                { text: "> sudo make me a sandwich",   color: "inherit"  },
                { text: "[OK] Sandwich deployed to production.", color: "#10b981" },
                { text: "> while(alive) { work(); sleep(4); }", color: "inherit" },
                { text: "[INFO] Engineer loop started. Exit code: never.", color: "#38bdf8" },
            ]
        ];

        let snippetIdx = 0;
        let lineIdx = 0;
        let charIdx = 0;
        let currentEl = null;

        const typeChar = () => {
            const snippet = funnySnippets[snippetIdx];

            if (lineIdx >= snippet.length) {
                // Done with this snippet — pause then cycle to next
                setTimeout(() => {
                    logsOutput.innerHTML = "";
                    snippetIdx = (snippetIdx + 1) % funnySnippets.length;
                    lineIdx = 0;
                    charIdx = 0;
                    currentEl = null;
                    typeChar();
                }, 4000);
                return;
            }

            const currentLine = snippet[lineIdx];

            if (charIdx === 0) {
                currentEl = document.createElement("div");
                currentEl.style.cssText = `margin: 0.25rem 0; color: ${currentLine.color}; line-height: 1.5;`;
                logsOutput.appendChild(currentEl);
            }

            if (charIdx < currentLine.text.length) {
                currentEl.textContent += currentLine.text.charAt(charIdx);
                charIdx++;
                setTimeout(typeChar, Math.random() * 25 + 18);
            } else {
                // Line done — pause then next line
                charIdx = 0;
                lineIdx++;
                setTimeout(typeChar, 900);
            }
        };

        setTimeout(typeChar, 400);
    };

    if (aboutSection) {
        const aboutObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    runFunnyLogs();
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        aboutObserver.observe(aboutSection);
    }

    // 6b. DEDICATED OBSERVER: LeetCode Dashboard Animations
    const dashboardSection = document.getElementById("coding-dashboard");

    if (dashboardSection) {
        const dashboardObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Delay slightly so dashboard.js has set data-offset
                    setTimeout(() => {
                        // Animate bars
                        dashboardSection.querySelectorAll(".lc-bar-fill").forEach(bar => {
                            const w = bar.getAttribute("data-width");
                            if (w) {
                                bar.style.transition = "width 1.2s ease-out";
                                bar.style.width = w;
                            }
                        });

                        // Animate circular ring
                        const lcRing = document.getElementById("lc-ring-fill");
                        if (lcRing) {
                            // Read the offset set by dashboard.js (or compute from known stats)
                            let targetOffset = parseFloat(lcRing.getAttribute("data-offset"));
                            if (isNaN(targetOffset)) {
                                // Fallback: 358 solved / 500 goal * 251.2 circumference
                                const circumference = 251.2;
                                targetOffset = circumference - (358 / 500) * circumference;
                            }
                            // Reset to full (invisible) then animate to target
                            lcRing.style.transition = "none";
                            lcRing.style.strokeDashoffset = "251.2";
                            // Force reflow then animate
                            void lcRing.getBoundingClientRect();
                            lcRing.style.transition = "stroke-dashoffset 1.6s cubic-bezier(0.4, 0, 0.2, 1)";
                            lcRing.style.strokeDashoffset = targetOffset;
                        }
                    }, 350);

                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.25 });

        dashboardObserver.observe(dashboardSection);
    }

    // 7. SKILLS TABS TOGGLER
    const tabBtns = document.querySelectorAll(".tab-btn");
    const tabContents = document.querySelectorAll(".skills-tab-content");

    tabBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const tabId = btn.getAttribute("data-tab");
            tabBtns.forEach(b => b.classList.remove("active"));
            tabContents.forEach(c => c.classList.remove("active"));
            btn.classList.add("active");
            const targetContent = document.getElementById(tabId);
            if (targetContent) targetContent.classList.add("active");
        });
    });

    // 8. Ripple Effect
    document.querySelectorAll('.ripple-btn, .tab-btn').forEach(btn => {
        btn.addEventListener('click', createRipple);
    });

    // 9. CONTACT FORM — Web3Forms handled via HTML POST action.

    console.log("%c[RL] Ramm Lakshmanan Developer Desk Initialized.", "color: #2563eb; font-size: 14px; font-weight: bold;");
});

