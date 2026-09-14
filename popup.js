const timerDisplay = document.getElementById('timerDisplay');
const startBtn = document.getElementById('startBtn');
const optionsBtn = document.getElementById('optionsBtn');
const resetBtn = document.getElementById('resetBtn');
const minusBtn = document.getElementById('minusBtn');
const plusBtn = document.getElementById('plusBtn');

let isStarted = false;
let isPaused = false;
let currentMinutes = 25;
let timerInterval;

optionsBtn.addEventListener('click', () => {
    window.open('options.html');
});

function formatTime(ms) {
    const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function setStoppedUI(minutes) {
    currentMinutes = minutes;
    timerDisplay.textContent = formatTime(currentMinutes * 60 * 1000);
    startBtn.textContent = "Start Session";
    resetBtn.style.display = "none";
    minusBtn.classList.remove('hidden');
    plusBtn.classList.remove('hidden');
    minusBtn.disabled = (currentMinutes <= 5);
    plusBtn.disabled = (currentMinutes >= 180);
    isStarted = false;
    isPaused = false;
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function resetTimerState() {
    chrome.storage.local.get(['defaultTimer'], (result) => {
        const defaultMin = result.defaultTimer || 25;
        setStoppedUI(defaultMin);
    });
}

function updateTimerUI() {
    chrome.storage.local.get(['endTime', 'remainingTime', 'isPaused', 'selectedTimer', 'defaultTimer'], (result) => {
        if (result.isPaused) {
            timerDisplay.textContent = formatTime(result.remainingTime);
            startBtn.textContent = "Resume";
            resetBtn.style.display = "inline-block";
            minusBtn.classList.add('hidden');
            plusBtn.classList.add('hidden');
            isStarted = true;
            isPaused = true;
            if (timerInterval) {
                clearInterval(timerInterval);
                timerInterval = null;
            }
        } else if (result.endTime) {
            const remainingTime = result.endTime - Date.now();
            if (remainingTime > 0) {
                timerDisplay.textContent = formatTime(remainingTime);
                startBtn.textContent = "Pause";
                resetBtn.style.display = "none";
                minusBtn.classList.add('hidden');
                plusBtn.classList.add('hidden');
                isStarted = true;
                isPaused = false;
                if (!timerInterval) {
                    timerInterval = setInterval(updateTimerUI, 1000);
                }
            } else {
                chrome.storage.local.remove(['endTime', 'remainingTime', 'isPaused', 'selectedTimer']);
                resetTimerState();
            }
        } else {
            const initialMinutes = result.selectedTimer || result.defaultTimer || 25;
            setStoppedUI(initialMinutes);
        }
    });
}

minusBtn.addEventListener('click', () => {
    if (isStarted) return;
    if (currentMinutes > 5) {
        currentMinutes -= 5;
        setStoppedUI(currentMinutes);
        chrome.storage.local.set({ selectedTimer: currentMinutes });
    }
});

plusBtn.addEventListener('click', () => {
    if (isStarted) return;
    if (currentMinutes < 180) {
        currentMinutes += 5;
        setStoppedUI(currentMinutes);
        chrome.storage.local.set({ selectedTimer: currentMinutes });
    }
});

startBtn.addEventListener('click', () => {
    if (!isStarted) {
        chrome.storage.local.get(['blockedSites', 'selectedTimer', 'defaultTimer'], (result) => {
            const sitesToBlock = result.blockedSites || [];

            if (sitesToBlock.length === 0) {
                alert("Your block list is empty! Go to options to add sites.");
                return;
            }

            const sessionMinutes = result.selectedTimer || result.defaultTimer || currentMinutes || 25;
            currentMinutes = sessionMinutes;

            chrome.runtime.sendMessage({ action: "startFocus", sites: sitesToBlock });

            const endTime = Date.now() + sessionMinutes * 60 * 1000;
            chrome.storage.local.set({ endTime: endTime, isPaused: false });
            chrome.alarms.create("pomodoroTimer", { delayInMinutes: sessionMinutes });

            minusBtn.classList.add('hidden');
            plusBtn.classList.add('hidden');
            isStarted = true;
            isPaused = false;

            updateTimerUI();
            if (timerInterval) clearInterval(timerInterval);
            timerInterval = setInterval(updateTimerUI, 1000);
        });
    } else if (!isPaused) {
        chrome.storage.local.get(['endTime'], (result) => {
            const remainingTime = result.endTime - Date.now();

            chrome.storage.local.set({ remainingTime: remainingTime, isPaused: true });
            chrome.storage.local.remove('endTime');
            chrome.alarms.clear('pomodoroTimer');

            if (timerInterval) {
                clearInterval(timerInterval);
                timerInterval = null;
            }
            updateTimerUI();
        });
    } else {
        chrome.storage.local.get(['remainingTime'], (result) => {
            const remainingTime = result.remainingTime || 0;
            const endTime = Date.now() + remainingTime;

            chrome.storage.local.set({ endTime: endTime, isPaused: false });
            chrome.storage.local.remove('remainingTime');
            chrome.alarms.create("pomodoroTimer", { delayInMinutes: remainingTime / 60000 });

            if (timerInterval) clearInterval(timerInterval);
            updateTimerUI();
            timerInterval = setInterval(updateTimerUI, 1000);
        });
    }
});

resetBtn.addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: "stopFocus" });

    chrome.storage.local.remove(['endTime', 'remainingTime', 'isPaused', 'selectedTimer']);
    chrome.alarms.clear('pomodoroTimer');

    resetTimerState();
});

chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local') {
        if (!isStarted && (changes.defaultTimer || changes.selectedTimer)) {
            updateTimerUI();
        }
    }
});

// Initialize UI on popup open
updateTimerUI();