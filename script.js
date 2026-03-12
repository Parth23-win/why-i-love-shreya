/* ============================================================
   WHY I LOVE SHREYA — Interactive Script
   Features: Memory Quiz · No-Button Prank · Love Coupons Store
   ============================================================ */

'use strict';

/* ── LocalStorage keys ───────────────────────────────────────── */
const LS_POINTS   = 'shreya_love_points';
const LS_REDEEMED = 'shreya_redeemed_coupons';
const LS_QUIZ     = 'shreya_quiz_progress';

/* ── Helpers ─────────────────────────────────────────────────── */
const $  = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

function show(el)  { if (el) { el.classList.remove('hidden'); } }
function hide(el)  { if (el) { el.classList.add('hidden');    } }

/* ============================================================
   FLOATING HEARTS BACKGROUND
   ============================================================ */
(function initFloatingHearts() {
    const container = $('#floating-hearts');
    if (!container) return;

    const emojis = ['💕', '❤️', '💖', '💗', '💝', '🌹', '✨', '💞'];

    function spawnHeart() {
        const heart = document.createElement('span');
        heart.className = 'floating-heart';
        heart.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        heart.style.left     = Math.random() * 100 + 'vw';
        heart.style.fontSize = (Math.random() * 1.2 + 0.8) + 'rem';
        const dur = Math.random() * 8 + 6;
        heart.style.animationDuration = dur + 's';
        heart.style.animationDelay    = Math.random() * 2 + 's';
        container.appendChild(heart);
        heart.addEventListener('animationend', () => heart.remove());
    }

    // Spawn hearts at intervals
    for (let i = 0; i < 8; i++) setTimeout(spawnHeart, i * 600);
    setInterval(spawnHeart, 1200);
}());

/* ============================================================
   CONFETTI EXPLOSION
   ============================================================ */
function launchConfetti(count = 90) {
    const container = $('#confetti-container');
    if (!container) return;

    const colors = ['#ff6b9d', '#b06cdf', '#ff4d79', '#ffcce0', '#c9747c', '#f9d0ff', '#ffd700', '#ff9ecd'];

    for (let i = 0; i < count; i++) {
        const piece = document.createElement('div');
        piece.className = 'confetti-piece';
        piece.style.left      = Math.random() * 100 + 'vw';
        piece.style.background = colors[Math.floor(Math.random() * colors.length)];
        piece.style.width     = (Math.random() * 8 + 6) + 'px';
        piece.style.height    = (Math.random() * 10 + 8) + 'px';
        piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '3px';
        const dur = Math.random() * 2 + 2;
        piece.style.animationDuration = dur + 's';
        piece.style.animationDelay    = Math.random() * 0.6 + 's';
        container.appendChild(piece);
        piece.addEventListener('animationend', () => piece.remove());
    }
}

/* ============================================================
   SPARKLE EFFECT (for correct quiz answers)
   ============================================================ */
function spawnSparkles(x, y) {
    const sparks = ['✨', '⭐', '💫', '🌟', '✨'];
    sparks.forEach((sym, i) => {
        const el = document.createElement('span');
        el.className = 'sparkle';
        el.textContent = sym;
        el.style.left = (x + (Math.random() - 0.5) * 120) + 'px';
        el.style.top  = (y + (Math.random() - 0.5) * 120) + 'px';
        el.style.animationDelay = (i * 0.08) + 's';
        document.body.appendChild(el);
        el.addEventListener('animationend', () => el.remove());
    });
}

/* ============================================================
   NAVIGATION
   ============================================================ */
function startJourney() {
    hide($('#welcome-screen'));
    show($('#main-nav'));
    show($('#main-footer'));
    goToSection('quiz-screen');
}

function goToSection(sectionId) {
    // Hide all screens
    $$('.screen').forEach(s => hide(s));

    // Show target
    const target = $(`#${sectionId}`);
    if (target) {
        show(target);
        target.classList.add('active');
    }

    // Update nav active state
    $$('.nav-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.section === sectionId);
    });

    // Re-init prank when entering prank screen
    if (sectionId === 'prank-screen') initPrank();

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ============================================================
   MEMORY QUIZ
   ============================================================ */
const quizData = [
    {
        question: "💭 Where was our first date?",
        options: ["A coffee shop nearby ☕", "A beautiful restaurant 🍽️", "A park at sunset 🌅", "A movie theater 🎬"],
        correct: 1,
        message: "You remember! 🥰 That night I knew something special was happening. The way you laughed at every little thing made the whole world feel lighter."
    },
    {
        question: "💕 What's the first thing I noticed about you?",
        options: ["Your beautiful smile 😊", "Your kind heart 💖", "Your amazing laugh 😄", "Your sparkling eyes ✨"],
        correct: 3,
        message: "Your eyes tell a whole story — one I never get tired of reading. They light up when you're excited, and they're the last thing I think about before I sleep. ✨"
    },
    {
        question: "🌹 When did I first tell you I love you?",
        options: ["On our third date", "Under a starry sky 🌟", "During a random ordinary moment 💛", "On a special anniversary"],
        correct: 2,
        message: "It wasn't a grand gesture — it was just a quiet, perfect moment. And it was the truest thing I've ever said. I love you more now than I did then. 💛"
    },
    {
        question: "🎵 What song reminds me of you every single time?",
        options: ["A classic love ballad 🎶", "Something upbeat and joyful 🎉", "A soft acoustic melody 🎸", "Whatever's playing when you're near 🎵"],
        correct: 3,
        message: "Honestly, every song becomes 'our song' when I hear it with you around. You make ordinary playlists feel like a movie soundtrack. 🎵"
    },
    {
        question: "💝 What's my absolute favourite thing about you?",
        options: ["The way you care for everyone 🤗", "Your infectious laugh 😄", "How you make me feel at home 🏡", "All of the above and infinitely more 💖"],
        correct: 3,
        message: "It's everything, Shreya. Absolutely everything. The way you care, the way you laugh, the way you make wherever you are feel like home. I am the luckiest person alive to love you. 💖✨"
    }
];

let currentQuestion = 0;
let quizAnswered = false;

function initQuiz() {
    // Restore progress from localStorage
    const saved = localStorage.getItem(LS_QUIZ);
    if (saved !== null) {
        const progress = parseInt(saved, 10);
        if (!isNaN(progress) && progress >= quizData.length) {
            showQuizComplete();
            return;
        }
        if (!isNaN(progress) && progress > 0) {
            currentQuestion = progress;
        }
    }
    renderQuestion();
}

function renderQuestion() {
    quizAnswered = false;
    const q = quizData[currentQuestion];
    if (!q) { showQuizComplete(); return; }

    // Update progress bar
    const pct = (currentQuestion / quizData.length) * 100;
    const bar = $('#quiz-progress-bar');
    if (bar) bar.style.width = pct + '%';
    const txt = $('#quiz-progress-text');
    if (txt) txt.textContent = `Question ${currentQuestion + 1} of ${quizData.length}`;

    // Set question text
    const qEl = $('#quiz-question');
    if (qEl) qEl.textContent = q.question;

    // Render options
    const opts = $('#quiz-options');
    if (opts) {
        opts.innerHTML = '';
        q.options.forEach((opt, idx) => {
            const btn = document.createElement('button');
            btn.className = 'quiz-option-btn';
            btn.textContent = opt;
            btn.addEventListener('click', () => handleQuizAnswer(idx, btn));
            opts.appendChild(btn);
        });
    }

    // Hide feedback
    const feedback = $('#quiz-feedback');
    if (feedback) { hide(feedback); feedback.textContent = ''; }

    show($('#quiz-card'));
    hide($('#quiz-complete'));
}

function handleQuizAnswer(selectedIdx, btn) {
    if (quizAnswered) return;
    quizAnswered = true;

    const q = quizData[currentQuestion];
    const allBtns = $$('#quiz-options .quiz-option-btn');

    allBtns.forEach(b => { b.disabled = true; });

    const feedback = $('#quiz-feedback');

    if (selectedIdx === q.correct) {
        btn.classList.add('correct');
        if (feedback) {
            feedback.textContent = '💖 ' + q.message;
            feedback.className = 'quiz-feedback success';
            show(feedback);
        }
        // Sparkle effect near the button
        const rect = btn.getBoundingClientRect();
        spawnSparkles(rect.left + rect.width / 2, rect.top + window.scrollY + rect.height / 2);

        // Add "Next" button
        addNextButton(feedback);
    } else {
        btn.classList.add('wrong');
        allBtns[q.correct].classList.add('correct');
        if (feedback) {
            feedback.textContent = "Not quite! But the right answer is highlighted above 💝 Keep going!";
            feedback.className = 'quiz-feedback error';
            show(feedback);
        }
        addNextButton(feedback);
    }
}

function addNextButton(parent) {
    if (!parent) return;
    const nextBtn = document.createElement('button');
    nextBtn.className = 'quiz-next-btn';
    const isLast = currentQuestion >= quizData.length - 1;
    nextBtn.textContent = isLast ? 'See your message 💌' : 'Next Question →';
    nextBtn.addEventListener('click', advanceQuiz);
    parent.appendChild(nextBtn);
}

function advanceQuiz() {
    currentQuestion++;
    localStorage.setItem(LS_QUIZ, currentQuestion);
    if (currentQuestion >= quizData.length) {
        showQuizComplete();
    } else {
        renderQuestion();
    }
}

function showQuizComplete() {
    // Full progress bar
    const bar = $('#quiz-progress-bar');
    if (bar) bar.style.width = '100%';
    const txt = $('#quiz-progress-text');
    if (txt) txt.textContent = `All ${quizData.length} questions unlocked! 🎉`;

    hide($('#quiz-card'));
    const complete = $('#quiz-complete');
    show(complete);

    const finalMsg = $('#quiz-final-message');
    if (finalMsg) {
        finalMsg.textContent = "You've completed the quest, Shreya! Every question, every memory — it all leads back to one truth: I love you more than words can ever capture. This little journey is just a tiny piece of what I feel every single day. 💕";
    }

    launchConfetti();
    setTimeout(launchConfetti, 1200);
}

/* ============================================================
   NO-BUTTON PRANK
   ============================================================ */
let prankNoBtn = null;
let prankActive = false;
let prankEscapeCount = 0;

function initPrank() {
    prankActive = true;
    prankEscapeCount = 0;

    const card = $('#prank-card');
    const result = $('#prank-result');
    if (card) show(card);
    if (result) hide(result);

    prankNoBtn = $('#no-btn');
    if (!prankNoBtn) return;

    prankNoBtn.style.position = 'relative';
    prankNoBtn.style.left = '';
    prankNoBtn.style.top  = '';

    // Remove old listeners by cloning
    const newBtn = prankNoBtn.cloneNode(true);
    prankNoBtn.parentNode.replaceChild(newBtn, prankNoBtn);
    prankNoBtn = newBtn;

    prankNoBtn.addEventListener('mouseover', escapeNoButton);
    prankNoBtn.addEventListener('touchstart', escapeNoButton, { passive: true });
}

function escapeNoButton(e) {
    if (!prankActive) return;
    e.preventDefault?.();
    prankEscapeCount++;

    const btn = prankNoBtn;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const bw = btn.offsetWidth  || 120;
    const bh = btn.offsetHeight || 48;

    // Random position within viewport
    const newLeft = Math.random() * (vw - bw);
    const newTop  = Math.random() * (vh - bh);

    btn.style.position = 'fixed';
    btn.style.left = newLeft + 'px';
    btn.style.top  = newTop  + 'px';
    btn.style.zIndex = 200;
    btn.style.transition = 'left 0.15s ease, top 0.15s ease';

    // Spin and shrink slightly as it escapes more
    const shrink = Math.max(0.65, 1 - prankEscapeCount * 0.04);
    btn.style.transform = `scale(${shrink}) rotate(${Math.random() * 30 - 15}deg)`;

    // Update hint
    const hints = [
        "Psst… try clicking \"No\" 😉",
        "Hehe, it's a bit shy! 😂",
        "Maybe chase it a little more? 😜",
        "It keeps running! Can you catch it? 🏃",
        "You're almost there! 😆",
        "The \"No\" button has trust issues 😂",
        "Maybe just click \"Yes\"? 😇",
    ];
    const hint = $('#prank-hint');
    if (hint) hint.textContent = hints[Math.min(prankEscapeCount, hints.length - 1)];
}

function handleYes() {
    prankActive = false;
    if (prankNoBtn) {
        prankNoBtn.style.position = '';
        prankNoBtn.style.left     = '';
        prankNoBtn.style.top      = '';
        prankNoBtn.style.transform = '';
        prankNoBtn.style.zIndex    = '';
        prankNoBtn.style.transition = '';
    }

    hide($('#prank-card'));
    show($('#prank-result'));
    launchConfetti(70);
    setTimeout(launchConfetti, 1000);
}

/* ============================================================
   LOVE COUPONS STORE
   ============================================================ */
const couponsData = [
    { id: 'coffee',    icon: '☕', title: 'Coffee Date',         cost: 80  },
    { id: 'movie',     icon: '🎬', title: 'Movie Night',         cost: 100 },
    { id: 'hug',       icon: '🤗', title: 'Extra Long Hug',      cost: 40  },
    { id: 'breakfast', icon: '🥞', title: 'Breakfast in Bed',    cost: 120 },
    { id: 'chores',    icon: '🧹', title: 'Day Off Chores',      cost: 150 },
    { id: 'picnic',    icon: '🧺', title: 'Picnic Date',         cost: 110 },
    { id: 'massage',   icon: '💆', title: 'Shoulder Massage',    cost: 60  },
    { id: 'dance',     icon: '💃', title: 'Dance Night',         cost: 90  },
    { id: 'cooking',   icon: '🍳', title: 'I Cook Dinner',       cost: 70  },
    { id: 'stars',     icon: '🌟', title: 'Stargazing Night',    cost: 130 },
];

let lovePoints = 500;
let redeemedCoupons = [];

function initCoupons() {
    // Load from localStorage
    const savedPoints = localStorage.getItem(LS_POINTS);
    if (savedPoints !== null) {
        const p = parseInt(savedPoints, 10);
        lovePoints = isNaN(p) ? 500 : p;
    }

    const savedRedeemed = localStorage.getItem(LS_REDEEMED);
    if (savedRedeemed) {
        try { redeemedCoupons = JSON.parse(savedRedeemed) || []; } catch (_) { redeemedCoupons = []; }
    }

    renderPointsDisplay();
    renderCouponsGrid();
    renderRedeemedList();
}

function renderPointsDisplay() {
    const display = $('#love-points-display');
    if (display) display.textContent = lovePoints;
}

function renderCouponsGrid() {
    const grid = $('#coupons-grid');
    if (!grid) return;
    grid.innerHTML = '';

    couponsData.forEach(coupon => {
        const alreadyRedeemed = redeemedCoupons.some(r => r.id === coupon.id);
        const card = document.createElement('div');
        card.className = 'coupon-card' + (alreadyRedeemed ? ' redeemed' : '');
        card.setAttribute('role', 'listitem');
        card.innerHTML = `
            <span class="coupon-icon">${coupon.icon}</span>
            <span class="coupon-title">${coupon.title}</span>
            <span class="coupon-cost">💖 ${coupon.cost} pts</span>
            <button
                class="coupon-redeem-btn"
                ${alreadyRedeemed ? 'disabled' : ''}
                aria-label="Redeem ${coupon.title} for ${coupon.cost} points"
                onclick="redeemCoupon('${coupon.id}', this)"
            >${alreadyRedeemed ? '✅ Redeemed' : 'Redeem'}</button>
        `;
        grid.appendChild(card);
    });
}

function redeemCoupon(couponId, btnEl) {
    const coupon = couponsData.find(c => c.id === couponId);
    if (!coupon) return;

    if (lovePoints < coupon.cost) {
        showModal(
            '😢 Not Enough Points',
            `You need ${coupon.cost} Love Points to redeem "${coupon.title}", but you only have ${lovePoints}. Keep saving! 💕`
        );
        return;
    }

    // Deduct points
    lovePoints -= coupon.cost;
    localStorage.setItem(LS_POINTS, lovePoints);

    // Record redemption
    const redemptionEntry = { id: coupon.id, title: coupon.title, icon: coupon.icon, date: new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) };
    redeemedCoupons.push(redemptionEntry);
    localStorage.setItem(LS_REDEEMED, JSON.stringify(redeemedCoupons));

    // Update UI
    renderPointsDisplay();
    animateBalance();
    renderCouponsGrid();
    renderRedeemedList();

    // Celebrate!
    launchConfetti(80);
    const rect = btnEl ? btnEl.getBoundingClientRect() : { left: window.innerWidth / 2, top: window.innerHeight / 2, width: 0, height: 0 };
    spawnSparkles(rect.left + rect.width / 2, rect.top + window.scrollY);

    showModal(
        `${coupon.icon} Coupon Redeemed!`,
        `You've redeemed "${coupon.title}" for ${coupon.cost} Love Points! You have ${lovePoints} points left. Show this to claim your reward! 💕`
    );
}

function animateBalance() {
    const el = $('#love-points-display');
    if (!el) return;
    el.classList.remove('changed');
    // Trigger reflow to restart animation
    void el.offsetWidth;
    el.classList.add('changed');
}

function renderRedeemedList() {
    const section = $('#redeemed-section');
    const list    = $('#redeemed-list');
    if (!section || !list) return;

    if (redeemedCoupons.length === 0) {
        hide(section);
        return;
    }

    show(section);
    list.innerHTML = '';
    redeemedCoupons.forEach(r => {
        const li = document.createElement('li');
        li.textContent = `${r.icon} ${r.title} — ${r.date}`;
        list.appendChild(li);
    });
}

/* ----- Modal helpers ----- */
function showModal(title, message) {
    const modal    = $('#redeem-modal');
    const titleEl  = $('#modal-title');
    const msgEl    = $('#modal-message');
    if (!modal) return;
    if (titleEl) titleEl.textContent = title;
    if (msgEl)   msgEl.textContent   = message;
    show(modal);
}

function closeModal() {
    hide($('#redeem-modal'));
}

// Close modal on backdrop click
document.addEventListener('click', (e) => {
    const modal = $('#redeem-modal');
    if (modal && !modal.classList.contains('hidden') && e.target === modal) {
        closeModal();
    }
});

/* ============================================================
   INIT ON DOM READY
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
    initQuiz();
    initCoupons();
    // Prank is initialised when the section is shown via goToSection()
});
