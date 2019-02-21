// This is the main js file that will control all the logic

var core = {
	tags : null,
	questions : null,
	inserts : null
}

$.getJSON("../config/tags.json", function(data) {
	handleConfigs(data, null, null);
})

$.getJSON("../config/questions.json", function(data) {
	handleConfigs(null, data, null);
})

$.getJSON("../config/inserts.json", function(data) {
	handleConfigs(null, null, data);
})


function handleConfigs(tags, questions, inserts) {
	if(tags != null) {
		core.tags = tags;
		console.log("Loaded tags from config file.");
	}

	if(questions != null) {
		core.questions = questions;
		console.log("Loaded questions from config file.");
	}

	if(inserts != null) {
		core.inserts = inserts;
		console.log("Loaded inserts from config file.");
	}

	if(core.tags != null && core.questions != null && core.inserts != null) {
		console.log("finished loading and storing all configs");
		setup();
	}
}

function setup() {
	console.log("starting setup")
	console.log(core)

	// so here we can make sure all the variables are set up as needed, GUI elements are prepared, and we are good to enter the main loop
}