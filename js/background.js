chrome.contextMenus.create({
  "title": 'Get down to it',
  "contexts": ['page'],
  "onclick": function(info, tab) {
    console.log(info);
    console.log(tab);
  }
});
