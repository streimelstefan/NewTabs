chrome.tabs.onCreated.addListener(tab => {
    if (tab.pendingUrl === "chrome://newtab/") {
        chrome.tabs.create({ url: chrome.extension.getURL("../site/index.html") });
        chrome.tabs.remove(tab.id);
    }
    console.log(tab);
});