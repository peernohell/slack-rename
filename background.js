function toggleExtension(tab) {
  var action = tab.url && /^https:\/\/(.*).slack.com/.test(tab.url) ? 'show' : 'hide';
  chrome.pageAction[action](tab.id);
}

chrome.tabs.onActivated.addListener(function(info) {
  chrome.tabs.get(info.tabId, toggleExtension);
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.url)
    toggleExtension(tab);
});