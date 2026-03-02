async function startBlocking(sites) {
    const redirectUrl = chrome.runtime.getURL("blocked.html");
    
    const rules = sites.map((site, index) => ({
        id: index + 1,
        priority: 1,
        action: { 
            type: 'redirect', 
            redirect: { url: redirectUrl } 
        },
        condition: { 
            urlFilter: `||${site}`, 
            resourceTypes: ['main_frame'] 
        }
    }));

    const currentRules = await chrome.declarativeNetRequest.getDynamicRules();
    const currentRuleIds = currentRules.map(rule => rule.id);

    await chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: currentRuleIds,
        addRules: rules
    });

    console.log(`Redirecting ${sites.length} sites to: ${redirectUrl}`);
}

async function stopBlocking() {
    const currentRules = await chrome.declarativeNetRequest.getDynamicRules();
    const currentRuleIds = currentRules.map(rule => rule.id);

    await chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: currentRuleIds
    });
}

chrome.runtime.onMessage.addListener((message, sendResponse) => {
    if (message.action === "startFocus") {
        startBlocking(message.sites);
        sendResponse({ status: "Focus started successfully" }); //
    } else if (message.action === "stopFocus") {
        stopBlocking();
        sendResponse({ status: "Focus stopped successfully" });
    }
    return true;
});

chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === "pomodoroTimer") {
        stopBlocking();
    }
});