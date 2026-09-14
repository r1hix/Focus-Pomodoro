const siteList = document.getElementById('siteList');
const siteInput = document.getElementById('siteInput');
const addSiteBtn = document.getElementById('addSiteBtn');
const savedIndicator = document.getElementById('savedIndicator');
const defaultTimerInput = document.getElementById('defaultTimerInput');
const saveTimerBtn = document.getElementById('saveTimerBtn');
const timerSavedIndicator = document.getElementById('timerSavedIndicator');
let sites = [];
let saveTimeout;
let timerSaveTimeout;

document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.local.get(['blockedSites', 'defaultTimer'], (result) => {
        if (result.defaultTimer) {
            defaultTimerInput.value = result.defaultTimer;
        } else {
            defaultTimerInput.value = 25;
        }

        if (result.blockedSites) {
            sites = result.blockedSites;
            updateSiteList();
        }
    });
    siteInput.focus();
});

function saveDefaultTimer() {
    let val = parseInt(defaultTimerInput.value, 10);
    if (isNaN(val) || val <= 0) {
        val = 25;
    } else {
        val = Math.max(5, Math.min(180, Math.round(val / 5) * 5));
    }
    defaultTimerInput.value = val;

    chrome.storage.local.set({ defaultTimer: val, selectedTimer: val }, () => {
        if (timerSaveTimeout) clearTimeout(timerSaveTimeout);
        timerSavedIndicator.classList.add('show');
        timerSaveTimeout = setTimeout(() => {
            timerSavedIndicator.classList.remove('show');
        }, 1500);
    });
}

saveTimerBtn.addEventListener('click', saveDefaultTimer);

defaultTimerInput.addEventListener('change', saveDefaultTimer);

defaultTimerInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        saveDefaultTimer();
    }
});

function addSite() {
    let newSite = siteInput.value.trim().toLowerCase();
    newSite = newSite
        .replace("https://", "")
        .replace("http://", "")
        .replace("www.", "")
        .split("/")[0];

    if (newSite && !sites.includes(newSite)) {
        sites.push(newSite);
        updateSiteList();
        siteInput.value = '';
        saveSites();
    } else if (sites.includes(newSite)) {
        alert('This site is already in your block list!');
    }
}

addSiteBtn.addEventListener('click', addSite);

siteInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        addSite();
    }
});

function updateSiteList() {
    siteList.innerHTML = '';
    sites.forEach(site => {
        const listItem = document.createElement('li');
        listItem.textContent = site;

        const removeBtn = document.createElement('button');
        removeBtn.className = 'removeBtn';
        removeBtn.textContent = 'Remove';
        removeBtn.addEventListener('click', () => {
            sites = sites.filter(s => s !== site);
            updateSiteList();
            saveSites();
        });

        listItem.appendChild(removeBtn);
        siteList.appendChild(listItem);
    });
}

function saveSites() {
    if (saveTimeout) clearTimeout(saveTimeout);

    saveTimeout = setTimeout(() => {
        chrome.storage.local.set({ blockedSites: sites }, () => {
            savedIndicator.classList.add('show');
            setTimeout(() => {
                savedIndicator.classList.remove('show');
            }, 1500);
        });
    }, 500);
}