// This is the main js file that will control all the logic

var core = {
	tags : null,
	questions : null,
	inserts : null,
	sections : null
}

var JSZip = require('jszip');
var Docxtemplater = require('docxtemplater');

var fs = require('fs');
var path = require('path');

$.getJSON("../config/tags.json", function(data) {
	handleConfigs(data, null, null, null);
})

$.getJSON("../config/questions.json", function(data) {
	handleConfigs(null, data, null, null);
})

$.getJSON("../config/inserts.json", function(data) {
	handleConfigs(null, null, data, null);
})

$.getJSON("../config/sections.json", function(data) {
	handleConfigs(null, null, null, data);
})


function handleConfigs(tags, questions, inserts, sections) {
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

	if(sections != null) {
		core.sections = sections;
		console.log("Loaded sections from config file.");
	}

	if(core.tags != null && core.questions != null && core.inserts != null && core.sections != null) {
		console.log("finished loading and storing all configs");
		setup();
	}
}

function setup() {
	console.log("starting setup");
	console.log(core);

	searchWarrantScript();

	$('#topGrid').height(window.innerHeight);

	// Read the docx file as a binary
	/*
	var content = fs.readFileSync(path.resolve(__dirname, '../test.docx'), 'binary');
	var zip = new JSZip(content);
	var doc = new Docxtemplater();
	doc.loadZip(zip);


	//set the templateVariables
	doc.setData({
	    peace_officer_name: 'John Man Thing',
	    provider_name: 'The Best Provider EVER',
	    "delivery_phone#": '03957102385y7203857023750 yes',
	    "affiant_qualifications": 'Here we are testing the\rnewline\rcharacter'
	});

	try {
	    // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
	    doc.render()
	}
	catch (error) {
	    var e = {
	        message: error.message,
	        name: error.name,
	        stack: error.stack,
	        properties: error.properties,
	    }
	    console.log(JSON.stringify({error: e}));
	    // The error thrown here contains additional information when logged with JSON.stringify (it contains a property object).
	    throw error;
	}

	var buf = doc.getZip().generate({type: 'nodebuffer'});

	// buf is a nodejs buffer, you can either write it to a file or do anything else with it.
	fs.writeFileSync(path.resolve(__dirname, '../output.docx'), buf);
	*/


	// NOTES:
	//	If it finds a {tag} that it does not have a definition for, it replaces it with "undefined".
	//	\n and \r newline characters don't seem to work. We should try the other one

	// so here we can make sure all the variables are set up as needed, GUI elements are prepared, and we are good to enter the main loop
}

function searchWarrantScript() {
	var parent = document.getElementById("questionAnswer");

	$('#questionText').html('Please fill out the information below.');

	//<i class="step fi-address-book size-12"></i>

	loadSection(0);

	addSingleLineInput(parent, "drNumber", "CAPD_DR/INC# :");
	addSingleLineInput(parent, "peaceOfficerName", "Peace Officer Name :");
	addSingleLineInput(parent, "agencyName", "Your Agency Name :");
	addSingleLineInput(parent, "providerName", "Target Provider Name :");

	addSubmitButton(parent);

	// define a script as an array of questions to be asked
	//	It would be an array of "sections" to be completed (use an object instead to easily go backwards if needed?)
	// screw that
	// an object of events. the problem is we need to maintain order
	// I guess we could just use indexes. they shouldn't move anyway

	// back to the array. keep track of indexes so we can backtrack if we want
	// we need to define the question text
	// we need to define the questions to be added to the answer area
	/*
		A section object would look like this:
		{
			sectionTitle: "A title for this section to be used in the progress sidebar",
			sectionText: "The text that goes at the top",
			sectionInputs: [
				{
					inputType: "The type of input that should be added",
					questionID: "The id for this input/question",
					inputLabel: "The text that should be used as the label for this input"
				},
				{
					inputType: "The type of input that should be added",
					questionID: "The id for this input/question",
					inputLabel: "The text that should be used as the label for this input"
				}
			]
		}
	*/

	// the theorically, we would assemble the progress pane based on the array of section objects
	// if you click on a progress pane entry, it loads that section (all sorts of crap to deal with here)




	// Please enter this basic information?
			// DR number
			// Peace Officer Name (your name?)
			// Provider name
		
			// your agency name
		
		// 90 days from date of issuance, DON"T WORRY ABOUT
		
		// Enter the delivery information
			// Delivery phone #
			// Delivery fax #
			// Delivery email
		// detective's name and serieal number
		
		
		// Please enter the affiant's qualifications
			// with more info
		
		// Please enter the objective of the warrant
			// Provide examples?
		
		// Please enter the statement of probable cause.
			// text box with more info about what they should consider.
		
		// Please enter the reasons for a sealed warrant
		// DO YOU WANT TO SEAL THE WARRANT?
			// if yes, show and add the section
			// if no, don't add the section
		
		// Please enter the request to delay notice situation
		// DO YOU WANT TO DELAY NOTICE
			// insert second 2 paragraphs
			// list the options they can select and then force them to fill out the specific facts why
		
		// foreign corporations or california corporations
		// multiple locations or single location
		
		
		
		
		// Please fill out the following information regarding the reservation thing
			// what's the starting location number
			// have you previously sent a preservation order, if so what was the reference number the provider gave to you in response?
			// accounts to be handled
				// examples
			// time period FROM and TO
		
		// Select the types of information to be sent by Facebook
			// additional descriptive requests?
		
		// For the order of the court to delay notification please fill out the following information
			// Provider
			// period in days?
}

function addSingleLineInput(parentDiv, questionID, questionLabel) {
	var label = document.createElement("div");
	var button = document.createElement("button");
	button.id = questionID + "Button";
	button.name = questionID;
	button.className = "infoButton";
	button.innerHTML = "<i class='step fi-info infoIcon' onclick='infoButtonHandler();'></i>";
	button.onclick = infoButtonHandler;

	label.appendChild(button);
	label.className = "singleLineInputFieldLabel";
	label.innerHTML += questionLabel;
	parentDiv.appendChild(label);

	var input = document.createElement("input");
	input.type = "text";
	input.className = "singleLineInputField"; // set the CSS class
	input.id = questionID;
	parentDiv.appendChild(input); // put it into the DOM
}

function infoButtonHandler() {
	var questionID = $(window.event.target).parent()[0].name;
	console.log(questionID);

	var infoText = core.inserts[questionID];
	$('#detailsText').empty();
	$('#detailsText').html(infoText);
}

function addSubmitButton(parentDiv) {
	var button = document.createElement("button");
	button.id = "submitButton";
	button.className = "submitButton";
	button.innerHTML = "Continue";
	button.addEventListener("click", submitButtonHandler);
	parentDiv.appendChild(button);
}

function submitButtonHandler() {
	console.log('you clicked the submit button')
}

function loadSection(sectionIndex) {
	var targetSection = core.sections[sectionIndex];

	// clear the screen
	$('#questionText').empty();
	$('#questionAnswer').empty();
	$('#detailsText').empty();

	// set the question text
	$('#questionText').html(targetSection.sectionText);

	// loop through the inputs and make each thing
	for(questionObject in targetSection.sectionInputs)
}