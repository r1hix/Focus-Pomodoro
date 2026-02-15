document.getElementById('startBtn').addEventListener('click', () => {
    console.log("Button clicked!");
    
    // List of sites to block
    const sites = ["instagram.com", "twitter.com", "x.com", "facebook.com", "tiktok.com", "reddit.com", "netflix.com", "pinterest.com", "snapchat.com", "twitch.tv", "hulu.com"];
    
    chrome.runtime.sendMessage({ action: "startFocus", sites: sites }, (response) => {
        if (chrome.runtime.lastError) {
            console.error("Error sending message:", chrome.runtime.lastError);
        } else {
            console.log("Message sent successfully");
        }
    });

    chrome.alarms.create("pomodoroTimer", { delayInMinutes: 25 });
});