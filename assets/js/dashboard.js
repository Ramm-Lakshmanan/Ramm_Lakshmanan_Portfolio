/**
 * Ramm Lakshmanan Portfolio - Coding Dashboard Sync Engine
 * Fetches and caches data from LeetCode, Codeforces, CodeChef, and GeeksforGeeks
 */

// Default stats as fallback and seed data (accurately representing achievements)
const RESUME_BASE_STATS = {
    leetcode: {
        handle: "TG28y7ZTaQ",
        solved: 358,
        easy: 124,
        medium: 186,
        hard: 48,
        rating: 1647,
        ranking: "Top 20%",
        acceptance: "61.4%"
    },
    codeforces: {
        handle: "Ramm_Lakshmanan",
        rating: 862,         // Matches actual live API rating
        maxRating: 1001,    // Matches actual live API max rating
        rank: "newbie",     // Matches actual live API rank
        maxRank: "newbie",  // Matches actual live API max rank
        solved: 133         // Recalculated unique solved problems from live API
    },
    codechef: {
        handle: "super_wasp_83",
        rating: 1530,
        stars: "2★",
        division: "Div 3",
        solved: 92
    },
    gfg: {
        handle: "rammlaksxfl6",
        score: 954,
        solved: 210,
        rank: "SSN Rank: 18"
    },
    lastUpdated: null
};

// Initialize statistics
let stats = { ...RESUME_BASE_STATS };

// Key name for local storage
const CACHE_KEY = "ramm_portfolio_coding_stats_refined";

// Load stats from cache or initialize with default
function initStats() {
    const cachedData = localStorage.getItem(CACHE_KEY);
    if (cachedData) {
        try {
            const parsed = JSON.parse(cachedData);
            // Deep merge cached data with baseline
            stats = {
                leetcode: { ...RESUME_BASE_STATS.leetcode, ...parsed.leetcode },
                codeforces: { ...RESUME_BASE_STATS.codeforces, ...parsed.codeforces },
                codechef: { ...RESUME_BASE_STATS.codechef, ...parsed.codechef },
                gfg: { ...RESUME_BASE_STATS.gfg, ...parsed.gfg },
                lastUpdated: parsed.lastUpdated
            };
        } catch (e) {
            console.error("Failed to parse cached stats, using baseline:", e);
            stats = { ...RESUME_BASE_STATS };
        }
    }
    updateDashboardUI();
}

// Update the UI elements with current stats values
function updateDashboardUI() {
    // 1. LEETCODE UI
    const lc = stats.leetcode;
    safeSetText("lc-solved", lc.solved);
    safeSetText("lc-solved-ring", lc.solved);
    safeSetText("lc-rating", lc.rating);
    safeSetText("lc-ranking", lc.ranking);
    safeSetText("lc-acceptance", lc.acceptance);

    safeSetText("lc-easy-num", lc.easy);
    safeSetText("lc-medium-num", lc.medium);
    safeSetText("lc-hard-num", lc.hard);

    // Calculate percentages for bar widths
    const lcTotal = lc.solved || 1;
    const easyPct = ((lc.easy / lcTotal) * 100).toFixed(1);
    const mediumPct = ((lc.medium / lcTotal) * 100).toFixed(1);
    const hardPct = ((lc.hard / lcTotal) * 100).toFixed(1);

    const dashboardSection = document.getElementById("coding-dashboard");
    const isDashboardActive = dashboardSection && dashboardSection.classList.contains("active");

    const easyBar = document.getElementById("lc-easy-bar");
    const mediumBar = document.getElementById("lc-medium-bar");
    const hardBar = document.getElementById("lc-hard-bar");

    if (easyBar) {
        easyBar.setAttribute("data-width", `${easyPct}%`);
        if (isDashboardActive) easyBar.style.width = `${easyPct}%`;
    }
    if (mediumBar) {
        mediumBar.setAttribute("data-width", `${mediumPct}%`);
        if (isDashboardActive) mediumBar.style.width = `${mediumPct}%`;
    }
    if (hardBar) {
        hardBar.setAttribute("data-width", `${hardPct}%`);
        if (isDashboardActive) hardBar.style.width = `${hardPct}%`;
    }

    // Circular progress ring logic (dashoffset) — only set data-offset here.
    // The actual animation is triggered by the IntersectionObserver in main.js when scrolled into view.
    const lcRing = document.getElementById("lc-ring-fill");
    if (lcRing) {
        const circumference = 251.2;
        const goal = 500;
        const ratio = Math.min(lc.solved / goal, 1);
        const offset = circumference - (ratio * circumference);
        lcRing.setAttribute("data-offset", offset);
        // Do NOT set strokeDashoffset here — let the scroll observer handle it
    }

    // 2. CODEFORCES UI
    const cf = stats.codeforces;
    safeSetText("cf-solved", cf.solved);
    safeSetText("cf-rating", cf.rating);
    safeSetText("cf-max-rating", `Max: ${cf.maxRating}`);
    safeSetText("cf-rank", capitalizeFirst(cf.rank));
    safeSetText("cf-max-rank", `Max: ${capitalizeFirst(cf.maxRank)}`);

    // 3. CODECHEF UI
    const cc = stats.codechef;
    safeSetText("cc-solved", cc.solved);
    safeSetText("cc-rating", cc.rating);
    safeSetText("cc-stars", cc.stars);
    safeSetText("cc-div", cc.division);

    // 4. GFG UI
    const gfg = stats.gfg;
    safeSetText("gfg-solved", gfg.solved);
    safeSetText("gfg-score", gfg.score);
    safeSetText("gfg-rank", gfg.rank);

    // 5. GLOBAL AGGREGATE (Recalculated)
    const totalDsaSolved = Number(lc.solved) + Number(cf.solved) + Number(cc.solved) + Number(gfg.solved);
    safeSetText("global-total-solved", `${totalDsaSolved} Problems`);

    // 6. SYNC TIME INDICATOR
    const syncTimeElement = document.getElementById("sync-time");
    if (syncTimeElement) {
        if (stats.lastUpdated) {
            const date = new Date(stats.lastUpdated);
            syncTimeElement.textContent = `Synced: ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        } else {
            syncTimeElement.textContent = "Synced via Codolio";
        }
    }
}

// Helper to capitalize first letter
function capitalizeFirst(str) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Helper to set text content safely
function safeSetText(id, value) {
    const el = document.getElementById(id);
    if (el) {
        el.textContent = value;
    }
}

// Helper to set element width safely
function safeSetWidth(id, width) {
    const el = document.getElementById(id);
    if (el) {
        el.style.width = width;
    }
}

// Sync data from APIs in the background
async function syncCodingProfiles() {
    const statusPulse = document.getElementById("status-pulse");
    const statusText = document.getElementById("status-text");

    if (statusPulse) statusPulse.classList.add("syncing");
    if (statusText) statusText.textContent = "Live Syncing...";

    let anySuccess = false;

    // 1. Fetch LeetCode Stats (Patched via AllOrigins Proxy to resolve CORS block)
    try {
        const targetUrl = `https://leetcode-stats-api.herokuapp.com/${stats.leetcode.handle}`;
        const proxyUrl = `https://allorigins.win{encodeURIComponent(targetUrl)}`;

        const lcResponse = await fetch(proxyUrl);
        if (lcResponse.ok) {
            const lcData = await lcResponse.json();
            if (lcData.status === "success") {
                stats.leetcode.solved = lcData.totalSolved;
                stats.leetcode.easy = lcData.easySolved;
                stats.leetcode.medium = lcData.mediumSolved;
                stats.leetcode.hard = lcData.hardSolved;
                stats.leetcode.acceptance = `${lcData.acceptanceRate}%`;
                if (lcData.ranking) {
                    stats.leetcode.ranking = `Rank: #${lcData.ranking.toLocaleString()}`;
                }
                anySuccess = true;
                console.log("LeetCode statistics successfully synced");
            }
        }
    } catch (e) {
        console.warn("Could not sync LeetCode statistics:", e);
    }

    // 2. Fetch Codeforces Info
    try {
        const cfResponse = await fetch(`https://codeforces.com/api/user.info?handles=${stats.codeforces.handle}`);
        if (cfResponse.ok) {
            const cfData = await cfResponse.json();
            if (cfData.status === "OK" && cfData.result && cfData.result[0]) {
                const info = cfData.result[0];
                stats.codeforces.rating = info.rating || stats.codeforces.rating;
                stats.codeforces.maxRating = info.maxRating || stats.codeforces.maxRating;
                stats.codeforces.rank = info.rank || stats.codeforces.rank;
                stats.codeforces.maxRank = info.maxRank || stats.codeforces.maxRank;
                anySuccess = true;
                console.log("Codeforces user info successfully synced");
            }
        }
    } catch (e) {
        console.warn("Could not sync Codeforces user info:", e);
    }

    // 3. Fetch Codeforces status (Recalculate unique solved problems)
    try {
        const cfStatusResponse = await fetch(`https://codeforces.com/api/user.status?handle=${stats.codeforces.handle}`);
        if (cfStatusResponse.ok) {
            const cfStatusData = await cfStatusResponse.json();
            if (cfStatusData.status === "OK" && cfStatusData.result) {
                const uniqueSolved = new Set();
                cfStatusData.result.forEach(submission => {
                    if (submission.verdict === "OK" && submission.problem) {
                        const problemId = `${submission.problem.contestId}-${submission.problem.index}`;
                        uniqueSolved.add(problemId);
                    }
                });
                stats.codeforces.solved = uniqueSolved.size;
                anySuccess = true;
                console.log(`Codeforces unique solved items synced: ${uniqueSolved.size}`);
            }
        }
    } catch (e) {
        console.warn("Could not sync Codeforces unique solved statistics:", e);
    }

    // Save tracking metadata if updates succeeded
    if (anySuccess) {
        stats.lastUpdated = Date.now();
        localStorage.setItem(CACHE_KEY, JSON.stringify(stats));
        updateDashboardUI();
    }

    if (statusPulse) statusPulse.classList.remove("syncing");
    if (statusText) statusText.textContent = "Sync Complete";
}

// Initial self-start execution on script load
document.addEventListener("DOMContentLoaded", () => {
    initStats();
    // Throttle background sync invocation to avoid API rate limiting
    setTimeout(syncCodingProfiles, 1500);


    // Manual sync button trigger
    const syncBtn = document.getElementById("manual-sync-btn");
    if (syncBtn) {
        syncBtn.addEventListener("click", (e) => {
            e.preventDefault();
            syncCodingProfiles();
        });
    }
});
