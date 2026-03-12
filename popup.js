const timerDisplay = document.getElementById('timerDisplay');
const startBtn = document.getElementById('startBtn');
const optionsBtn = document.getElementById('optionsBtn');
let isStarted = false;

optionsBtn.addEventListener('click', () => {
    window.open('options.html');
});

let timerInterval;

function updateTimerUI()  {
    chrome.storage.local.get(['endTime'], (result) => {
        if (result.endTime) {
            const remainingTime = result.endTime - Date.now();  // Calculate remaining time in milliseconds
            if (remainingTime > 0) { 
                const minutes = Math.floor(remainingTime / 60000);          // Convert milliseconds to minutes
                const seconds = Math.floor((remainingTime % 60000) / 1000); // Convert remaining milliseconds to seconds
                timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                startBtn.textContent = "Reset";
                isStarted = true;
            } else {
                timerDisplay.textContent = "25:00"; // Reset timer display
                startBtn.textContent = "Start Session";
                isStarted = false;
                clearInterval(timerInterval);
            }
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
            chrome.storage.local.set({ endTime: endTime });
            chrome.alarms.create("pomodoroTimer", { delayInMinutes: 25 });
            
            if (timerInterval) clearInterval(timerInterval);
            
            updateTimerUI();
            timerInterval = setInterval(updateTimerUI, 1000);
        });
    } else {
        chrome.runtime.sendMessage({action: "stopFocus"});

        chrome.storage.local.remove('endTime');
        chrome.alarms.clear('pomodoroTimer');

        timerDisplay.textContent = "25:00";
        startBtn.textContent = "Start Session";
        isStarted = false;
        clearInterval(timerInterval);
    }
});

// Initialize UI on popup open
updateTimerUI();
timerInterval = setInterval(updateTimerUI, 1000);