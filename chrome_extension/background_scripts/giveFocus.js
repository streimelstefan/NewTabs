chrome.tabs.onCreated.addListener((tab) => {
  console.log(tab);
  if (tab.pendingUrl === "chrome://newtab/") {
    chrome.tabs.create({
      url: chrome.runtime.getURL("../site/index.html"),
      active: true,
    });
    chrome.tabs.remove(tab.id);
  }
});
