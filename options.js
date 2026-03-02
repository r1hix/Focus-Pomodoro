const siteInput = document.getElementById('siteInput');
const addSiteBtn = document.getElementById('addSiteBtn');
const saveBtn = document.getElementById('saveBtn');
let sites = [];

document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.local.get(['blockedSites'], (result) => {
        if (result.blockedSites) {
            sites = result.blockedSites;
            updateSiteList();
        }
    });
});

addSiteBtn.addEventListener('click', () => {
    const newSite = siteInput.value.trim();
    if (newSite && !sites.includes(newSite)) {
        sites.push(newSite);
        updateSiteList();
        siteInput.value = '';
    }
});

function updateSiteList() {
    const siteList = document.getElementById('siteList');
    siteList.innerHTML = '';
    sites.forEach(site => {
        const listItem = document.createElement('li');
        listItem.textContent = site;

        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Remove';
        removeBtn.addEventListener('click', () => {
            sites = sites.filter(s => s !== site);
            updateSiteList();
        });

        listItem.appendChild(removeBtn);
        siteList.appendChild(listItem);
    });
}

saveBtn.addEventListener('click', () => {
    chrome.storage.local.set({ blockedSites: sites }, () => {

        saveBtn.textContent = 'Saved!';
        setTimeout(() => { saveBtn.textContent = 'Save Block List'; }, 1000);
    });
});