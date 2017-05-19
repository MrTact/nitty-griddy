var clickedElPath;
var gridContainer, overlayContainer;
var computedStyles;

function pxToNumber(str) {
  return Number(str.replace('px', ''));
}

document.addEventListener('contextmenu', function(event) {
  clickedElPath = event.path;
}, true);

function gridOverlay() {
  var _computedStyles;
  var gridRows, gridCols, gridRowGap, gridColGap, gridWidth, gridHeight;
  var overlayBar;
  var vertBarOffset = 0, horBarOffset = 0, vertContainerOffset = 0, horContainerOffset = 0;
  var positionBackup;
  var borderSize = 2;

  _computedStyles = window.getComputedStyle(gridContainer);
  console.log(_computedStyles);

  if (JSON.stringify(_computedStyles) === JSON.stringify(computedStyles)) {
    return;
  }
  else {
    computedStyles = _computedStyles;
  }

  if (overlayContainer) {
    overlayContainer.remove();
  }

  positionBackup = computedStyles.position;
  if (computedStyles.position === 'static') {
    gridContainer.style.position = 'relative';
  }

  gridRows = computedStyles.gridTemplateRows.split(' ').map(pxToNumber);
  gridCols = computedStyles.gridTemplateColumns.split(' ').map(pxToNumber);
  gridRowGap = pxToNumber(computedStyles.gridRowGap);
  gridColGap = pxToNumber(computedStyles.gridColumnGap);
  gridHeight = gridRows.reduce(function(acc, cur) {return acc + cur;}) + (gridRows.length-1) * gridRowGap;
  gridWidth = gridCols.reduce(function(acc, cur) {return acc + cur;}) + (gridCols.length-1) * gridColGap;

  if (computedStyles.justifyContent === 'center') {
    vertContainerOffset = (pxToNumber(computedStyles.width) - gridWidth) / 2;
  }
  if (computedStyles.justifyContent === 'start') {
    vertContainerOffset = 0;
  }
  if (computedStyles.justifyContent === 'normal') {
    vertContainerOffset = 0;
  }
  if (computedStyles.justifyContent === 'end') {
    vertContainerOffset = pxToNumber(computedStyles.width) - gridWidth;
  }
  if (computedStyles.alignContent === 'center') {
    horContainerOffset = (pxToNumber(computedStyles.height) - gridHeight) / 2;
  }
  if (computedStyles.alignContent === 'start') {
    horContainerOffset = 0;
  }
  if (computedStyles.alignContent === 'normal') {
    horContainerOffset = 0;
  }
  if (computedStyles.alignContent === 'end') {
    horContainerOffset = pxToNumber(computedStyles.height) - gridHeight;
  }

  overlayContainer = document.createElement('div');
  overlayContainer.style = "border: " + borderSize + "px solid rgba(243, 156, 18, .9); \
    background: rgba(0, 0, 0, .4); \
    pointer-events: none; \
    box-sizing: content-box; \
    position: absolute; \
    z-index: 99999; \
    top: " + (pxToNumber(computedStyles.paddingTop) + horContainerOffset - borderSize) + "px; \
    right: " + (pxToNumber(computedStyles.paddingRight) + vertContainerOffset - borderSize) + "px; \
    bottom: " + (pxToNumber(computedStyles.paddingBottom) + horContainerOffset - borderSize) + "px; \
    left: " + (pxToNumber(computedStyles.paddingLeft) + vertContainerOffset - borderSize) + "px; \
    width: " + gridWidth + "px; \
    height: " + gridHeight + "px;";

  gridRows.pop();
  gridRows.forEach(function(rowHeight) {
    vertBarOffset += rowHeight;
    overlayBar = document.createElement('div');
    overlayBar.style = "background-color: rgba(255, 255, 0, .7); \
      position: absolute; \
      top:" + vertBarOffset + "px; \
      right: 0; \
      left: 0; \
      height: " + Math.max(1, gridRowGap) + "px;";
    overlayContainer.appendChild(overlayBar);
    vertBarOffset += pxToNumber(computedStyles.gridRowGap);
  });

  gridCols.pop();
  gridCols.forEach(function(colWidth) {
    horBarOffset += colWidth;
    overlayBar = document.createElement('div');
    overlayBar.style = "background-color: rgba(255, 255, 0, .7); \
      position: absolute; \
      top: 0; \
      bottom: 0; \
      left: " + horBarOffset + "px; \
      width: " + Math.max(1, gridColGap) + "px;";
    overlayContainer.appendChild(overlayBar);
    horBarOffset += pxToNumber(computedStyles.gridColumnGap);
  });

  gridContainer.appendChild(overlayContainer);
}

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.cmd === 'processClickedEl') {
    gridContainer = clickedElPath.find(function(el) {
      return el.parentElement && window.getComputedStyle(el).display === 'grid';
    });

    if (gridContainer) {
      gridOverlay();
      setInterval(gridOverlay, 500);
    }
  }
});
