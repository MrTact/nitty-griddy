chrome.contextMenus.onClicked.addListener(function contextmenuCallback(info, tab) {
  if (info.menuItemId === 'nitty-griddy') {
    chrome.tabs.sendMessage(tab.id, {cmd: 'processClickedEl'}, function(msg) {});
  }
});

chrome.contextMenus.create({
  "id": 'nitty-griddy',
  "title": 'Get down to it',
  "contexts": ['all']
});
