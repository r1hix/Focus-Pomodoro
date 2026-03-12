const siteList = document.getElementById('siteList');
const siteInput = document.getElementById('siteInput');
const addSiteBtn = document.getElementById('addSiteBtn');
const savedIndicator = document.getElementById('savedIndicator');
let sites = [];
let saveTimeout;

document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.local.get(['blockedSites'], (result) => {
        if (result.blockedSites) {
            sites = result.blockedSites;
            updateSiteList();
        }
    });
    siteInput.focus();
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