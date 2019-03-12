const remote = require('electron').remote;

var helpText = remote.getCurrentWindow().infoWindowData;

console.log(helpText)