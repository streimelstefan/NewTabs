createObjectURL = function(blob) {
    var objURL = URL.createObjectURL(blob);
    this.objectURLs = this.objectURLs || [];
    this.objectURLs.push(objURL);
    return objURL;
};

clearObjectURL = function() {
    if (this.objectURLs) {
        this.objectURLs.forEach(function(objURL) {
            URL.revokeObjectURL(objURL);
        });
        this.objectURLs = null;
    }
};

requestRemoteImageAndAppend = function(imageUrl, element) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', imageUrl);
    xhr.responseType = 'blob';
    xhr.onload = function() {
        var img = document.createElement('img');
        img.setAttribute('data-src', imageUrl);
        var objURL = createObjectURL(xhr.response);
        img.setAttribute('src', objURL);
        element.appendChild(img);
    }.bind(this);
    xhr.send();
};

chrome.tabs.onCreated.addListener(tab => {
    console.group("Get_Image");
    console.group("URL Check");
    console.log("tab.pendingURL = " + tab.pendingUrl);
    console.log("chrome.extension.getURL = " + chrome.extension.getURL("site/index.html"));
    console.groupEnd();
    if (tab.pendingUrl === chrome.extension.getURL("site/index.html")) {
        console.log("In a new Tabe Page");
        // in a new Tab
        requestRemoteImageAndAppend("https://picsum.photos/200/300?grayscale", document.querySelector("body"));

        console.log(document.querySelector("body"));

    }
    console.groupEnd();
});