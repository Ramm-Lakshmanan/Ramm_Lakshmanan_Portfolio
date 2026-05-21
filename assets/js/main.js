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

                // If it contains Leetcode easy/medium/hard bars, animate them
                const lcBars = entry.target.querySelectorAll(".lc-bar-fill");
                lcBars.forEach(bar => {
                    const width = bar.getAttribute("data-width");
                    bar.style.width = width;
                });

                // Unobserve once revealed
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // 7. SKILLS TABS TOGGLER
    const tabBtns = document.querySelectorAll(".tab-btn");
    const tabContents = document.querySelectorAll(".skills-tab-content");

    tabBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const tabId = btn.getAttribute("data-tab");

            // Remove active classes
            tabBtns.forEach(b => b.classList.remove("active"));
            tabContents.forEach(c => c.classList.remove("active"));

            // Add active class to clicked button
            btn.classList.add("active");

            // Show corresponding content
            const targetContent = document.getElementById(tabId);
            if (targetContent) {
                targetContent.classList.add("active");
            }
        });
    });
    // 9. Ripple Effect Integration for all .ripple-btn elements
    document.querySelectorAll('.ripple-btn, .tab-btn').forEach(btn => {
        btn.addEventListener('click', createRipple);
    });

    // 10. Coursework Expand/Collapse Logic
    const collegeToggle = document.getElementById('college-coursework-toggle');
    const collegeList = document.getElementById('college-coursework');
    if (collegeToggle && collegeList) {
        collegeToggle.addEventListener('click', () => {
            collegeList.classList.toggle('show');
            collegeToggle.textContent = collegeList.classList.contains('show') ? 'Hide Coursework' : 'Show Coursework';
        });
    }
    const schoolToggle = document.getElementById('school-coursework-toggle');
    const schoolList = document.getElementById('school-coursework');
    if (schoolToggle && schoolList) {
        schoolToggle.addEventListener('click', () => {
            schoolList.classList.toggle('show');
            schoolToggle.textContent = schoolList.classList.contains('show') ? 'Hide Subjects' : 'Show Subjects';
        });
    }

    // 8. CONTACT FORM SUBMISSION SIMULATION
    const contactForm = document.getElementById("portfolio-contact-form");
    const formStatus = document.getElementById("form-status");

    if (contactForm && formStatus) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();

            // Fetch form fields
            const name = document.getElementById("form-name").value;
            const email = document.getElementById("form-email").value;
            const message = document.getElementById("form-message").value;

            if (!name || !email || !message) {
                formStatus.className = "form-status";
                formStatus.style.display = "block";
                formStatus.style.background = "rgba(239, 68, 68, 0.1)";
                formStatus.style.border = "1px solid rgba(239, 68, 68, 0.2)";
                formStatus.style.color = "#ef4444";
                formStatus.textContent = "Please fill in all required fields.";
                return;
            }

            // Simulate sending message
            const submitBtn = contactForm.querySelector("button[type='submit']");
            const originalBtnText = submitBtn.innerHTML;

            submitBtn.disabled = true;
            submitBtn.innerHTML = "Sending Message...";

            setTimeout(() => {
                formStatus.className = "form-status success";
                formStatus.textContent = `Thank you, ${name}! Your message has been sent successfully. I will get back to you soon.`;

                // Reset Form
                contactForm.reset();
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;

                // Hide status after 5 seconds
                setTimeout(() => {
                    formStatus.style.display = "none";
                }, 5000);
            }, 1200);
        });
    }

    console.log("%c[RL] Ramm Lakshmanan Developer Desk Initialized.", "color: #2563eb; font-size: 14px; font-weight: bold;");
});
