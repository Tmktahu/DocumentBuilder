// This is the main js file that will control all the logic

var core = {
	tags : null,
	questions : null,
	inserts : null
}

var JSZip = require('jszip');
var Docxtemplater = require('docxtemplater');

var fs = require('fs');
var path = require('path');

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
	console.log("starting setup");
	console.log(core);

	searchWarrantScript();

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

	$('questionText').text('Please fill out the information below.');

	var drNumberInput = document.createElement("input");
	drNumberInput.type = "text";
	drNumberInput.className = "inputField"; // set the CSS class
	drNumberInput.id = "drNumber";
	parent.appendChild(drNumberInput); // put it into the DOM

	var peaceOfficerNameInput = document.createElement("input");
	peaceOfficerNameInput.type = "text";
	peaceOfficerNameInput.className = "inputField"; // set the CSS class
	peaceOfficerNameInput.id = "peaceOfficerName";
	parent.appendChild(peaceOfficerNameInput); // put it into the DOM

	var agencyNameInput = document.createElement("input");
	agencyNameInput.type = "text";
	agencyNameInput.className = "inputField"; // set the CSS class
	agencyNameInput.id = "agencyName";
	parent.appendChild(agencyNameInput); // put it into the DOM

	var providerNameInput = document.createElement("input");
	providerNameInput.type = "text";
	providerNameInput.className = "inputField"; // set the CSS class
	providerNameInput.id = "providerName";
	parent.appendChild(providerNameInput); // put it into the DOM

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