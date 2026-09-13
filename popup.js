const timerDisplay = document.getElementById('timerDisplay');
const startBtn = document.getElementById('startBtn');
const optionsBtn = document.getElementById('optionsBtn');
const resetBtn = document.getElementById('resetBtn');
let isStarted = false;
let isPaused = false;

optionsBtn.addEventListener('click', () => {
    window.open('options.html');
});

let timerInterval;

function formatTime(ms) {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function resetTimerState() {
    timerDisplay.textContent = "25:00";
    startBtn.textContent = "Start Session";
    resetBtn.style.display = "none";
    isStarted = false;
    isPaused = false;
    clearInterval(timerInterval);
}

function updateTimerUI()  {
    chrome.storage.local.get(['endTime', 'remainingTime', 'isPaused'], (result) => {
        if (result.isPaused) {
            timerDisplay.textContent = formatTime(result.remainingTime);
            startBtn.textContent = "Resume";
            resetBtn.style.display = "inline-block";
            isStarted = true;
            isPaused = true;
            clearInterval(timerInterval);
        } else if (result.endTime) {
            const remainingTime = result.endTime - Date.now();  // Calculate remaining time in milliseconds
            if (remainingTime > 0) {
                timerDisplay.textContent = formatTime(remainingTime);
                startBtn.textContent = "Pause";
                resetBtn.style.display = "none";
                isStarted = true;
                isPaused = false;
            } else {
                resetTimerState();
            }
        } else {
            resetTimerState();
        }
    });
}

startBtn.addEventListener('click', () => {
    if (!isStarted) {
        chrome.storage.local.get(['blockedSites'], (result) => {
            const sitesToBlock = result.blockedSites || []; // Empty array if none saved

            if (sitesToBlock.length === 0) {
                alert("Your block list is empty! Go to options to add sites.");
                return;
            }

            chrome.runtime.sendMessage({ action: "startFocus", sites: sitesToBlock });

            const endTime = Date.now() + 25 * 60 * 1000;
            chrome.storage.local.set({ endTime: endTime, isPaused: false });
            chrome.alarms.create("pomodoroTimer", { delayInMinutes: 25 });
            if (timerInterval) clearInterval(timerInterval);
            updateTimerUI();
            timerInterval = setInterval(updateTimerUI, 1000);
        });
    } else if (!isPaused) {
        chrome.storage.local.get(['endTime'], (result) => {
            const remainingTime = result.endTime - Date.now();

            chrome.storage.local.set({ remainingTime: remainingTime, isPaused: true });
            chrome.storage.local.remove('endTime');
            chrome.alarms.clear('pomodoroTimer');

            clearInterval(timerInterval);
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
    chrome.runtime.sendMessage({action: "stopFocus"});

    chrome.storage.local.remove(['endTime', 'remainingTime', 'isPaused']);
    chrome.alarms.clear('pomodoroTimer');

    resetTimerState();
});

// Initialize UI on popup open
updateTimerUI();
timerInterval = setInterval(updateTimerUI, 1000);