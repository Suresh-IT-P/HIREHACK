
document.addEventListener('DOMContentLoaded', () => {
    // Persistent Ban Check
    if (localStorage.getItem('hirehack_banned') === 'true') {
        terminateSession();
        return;
    }

    // DOM Elements
    const elements = {
        startBtn: document.getElementById('start-btn'),
        welcomeScreen: document.getElementById('welcome-screen'),
        guidelinesScreen: document.getElementById('guidelines-screen'),
        googleFormScreen: document.getElementById('google-form-screen'),
        confirmGuidelinesBtn: document.getElementById('confirm-guidelines-btn'),
        countdownContainer: document.getElementById('countdown-container'),
        days: document.getElementById('days'),
        hours: document.getElementById('hours'),
        minutes: document.getElementById('minutes'),
        seconds: document.getElementById('seconds'),
        loadingScreen: document.getElementById('loading-screen'),
        formTimerDisplay: document.getElementById('form-timer')
    };

    // Event Listeners
    if (elements.startBtn) {
        elements.startBtn.addEventListener('click', startProcess);
    }

    if (elements.confirmGuidelinesBtn) {
        elements.confirmGuidelinesBtn.addEventListener('click', showGoogleForm);
    }

    // Malpractice Detection
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            // Only trigger if we are ON the Google Form screen
            if (elements.googleFormScreen && elements.googleFormScreen.classList.contains('active')) {
                localStorage.setItem('hirehack_banned', 'true');
                terminateSession("MALPRACTICE");
            }
        }
    });

    function terminateSession(reason = "MALPRACTICE") {
        const title = reason === "TIME_EXPIRED" ? "⏰ Time Expired" : "⚠️ Access Denied";
        const msg = reason === "TIME_EXPIRED" ? "The allocated 30 minutes for this contest have expired." : "Malpractice (Tab Switching) was detected in your session.";
        const code = reason === "TIME_EXPIRED" ? "TIME_LMT_01" : "BANNED_MP_01";

        document.body.innerHTML = `
            <div style="
                display: flex; 
                flex-direction: column; 
                justify-content: center; 
                align-items: center; 
                height: 100vh; 
                background: #f8d7da; 
                color: #721c24; 
                text-align: center;
                font-family: sans-serif;
                padding: 2rem;
            ">
                <div style="background: white; padding: 3rem; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); border-top: 10px solid #721c24;">
                    <h1 style="font-size: 3rem; margin-bottom: 1rem;">${title}</h1>
                    <p style="font-size: 1.5rem; margin-bottom: 2rem;">${msg}</p>
                    <p style="font-weight: bold; border-top: 1px solid #eee; padding-top: 1rem;">You are no longer allowed to access this assessment.</p>
                    <p style="font-size: 0.9rem; color: #999; margin-top: 2rem;">Persistent Termination Code: ${code}</p>
                </div>
            </div>
        `;
        document.title = title;
    }

    // Functions
    function startProcess() {
        if (!elements.welcomeScreen || !elements.guidelinesScreen) return;

        // Transition: Home -> Guidelines
        elements.welcomeScreen.classList.add('hidden');
        elements.welcomeScreen.classList.remove('active');

        elements.guidelinesScreen.classList.remove('hidden');
        elements.guidelinesScreen.classList.add('active');
    }

    function showGoogleForm() {
        // Transition: Guidelines -> google Form
        if (elements.guidelinesScreen) {
            elements.guidelinesScreen.classList.add('hidden');
            elements.guidelinesScreen.classList.remove('active');
        }

        if (elements.googleFormScreen) {
            elements.googleFormScreen.classList.remove('hidden');
            elements.googleFormScreen.classList.add('active');
            startFormTimer(30 * 60); // Start 30-minute timer
        }
    }

    function startFormTimer(durationSeconds) {
        let timeLeft = durationSeconds;
        const display = elements.formTimerDisplay;

        const timerInterval = setInterval(() => {
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;

            if (display) {
                display.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

                if (timeLeft <= 60) { // Highlight last minute
                    display.style.color = "#ff4757";
                    display.style.fontWeight = "800";
                }
            }

            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                localStorage.setItem('hirehack_banned', 'true');
                terminateSession("TIME_EXPIRED");
            }
            timeLeft--;
        }, 1000);
    }

    function initApp() {
        // Show loading screen for 2.5 seconds to feel premium
        setTimeout(() => {
            if (elements.loadingScreen) {
                elements.loadingScreen.classList.add('hidden');
                elements.loadingScreen.classList.remove('active');
            }
            if (elements.welcomeScreen) {
                elements.welcomeScreen.classList.remove('hidden');
                elements.welcomeScreen.classList.add('active');
            }
            initEventCountdown();
        }, 2500);
    }

    function initEventCountdown() {
        // Target Date Set by User
        const TARGET_DATE = new Date("February 20, 2026 17:48:00").getTime();

        const updateCountdown = () => {
            const now = new Date().getTime();
            const distance = TARGET_DATE - now;

            if (distance <= 0) {
                clearInterval(countdownInterval);
                if (elements.countdownContainer) elements.countdownContainer.classList.add('hidden');
                if (elements.startBtn) elements.startBtn.classList.remove('hidden');
                return;
            }

            // Calculations
            const d = Math.floor(distance / (1000 * 60 * 60 * 24));
            const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const s = Math.floor((distance % (1000 * 60)) / 1000);

            // Update UI
            if (elements.days) elements.days.textContent = d.toString().padStart(2, '0');
            if (elements.hours) elements.hours.textContent = h.toString().padStart(2, '0');
            if (elements.minutes) elements.minutes.textContent = m.toString().padStart(2, '0');
            if (elements.seconds) elements.seconds.textContent = s.toString().padStart(2, '0');
        };

        const countdownInterval = setInterval(updateCountdown, 1000);
        updateCountdown(); // Initial call
    }

    // Initialize App
    initApp();
});
