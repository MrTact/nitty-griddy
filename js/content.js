var clickedElPath;

document.addEventListener('contextmenu', function(event) {
  clickedElPath = event.path;
}, true);

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  var computedStyles, gridContainer;

  if (message.cmd === 'processClickedEl') {
    gridContainer = clickedElPath.find(function(el) {
      return el.parentElement && (computedStyles = window.getComputedStyle(el)).display === 'grid';
    });

    if (gridContainer) {
      gridContainer.style.background = 'orange';
      console.log(computedStyles);
    }
  }
});
