const remote = require('electron').remote;
var helpText = remote.getCurrentWindow().infoWindowData;

var MarkdownIt = require('markdown-it'),
    md = new MarkdownIt({breaks: true});
//var result = md.render('#### markdown-it rulezz!');
var result = md.render(helpText);



console.log(helpText);

$('#helpText').html(result);