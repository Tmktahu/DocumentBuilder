// This is the main js file that will control all the logic

const { ipcRenderer } = require('electron');

var core = {
	tags : null,
	questions : null,
	inserts : null,
	sections : null,
	infoBarText : null,
	answers : {},
	answerInserts : {},
	finalInserts : {},
	currentSectionIndex : 0
}

var answerDiv = document.getElementById("questionAnswer");

var JSZip = require('jszip');
var Docxtemplater = require('docxtemplater');

var fs = require('fs');
var path = require('path');

$.getJSON("../config/tags.json", function(data) {
	handleConfigs(data, null, null, null, null);
})

$.getJSON("../config/questions.json", function(data) {
	handleConfigs(null, data, null, null, null);
})

$.getJSON("../config/inserts.json", function(data) {
	handleConfigs(null, null, data, null, null);
})

$.getJSON("../config/sections.json", function(data) {
	handleConfigs(null, null, null, data, null);
})

$.getJSON("../config/infoBarText.json", function(data) {
	handleConfigs(null, null, null, null, data);
})


function handleConfigs(tags, questions, inserts, sections, infoBarText) {
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

	if(infoBarText != null) {
		core.infoBarText = infoBarText;
		console.log("Loaded infoBarText from config file.");
	}

	if(core.tags != null && core.questions != null && core.inserts != null && core.sections != null && core.infoBarText != null) {
		console.log("finished loading and storing all configs");
		setup();
	}
}

function setup() {
	console.log(core);

	makeProgressPane();
	searchWarrantScript();

	$('#topGrid').height(window.innerHeight);
}

function makeProgressPane() {
	// for each section, get the section TITLE and make a button entry in the progress pane

	for(i in core.sections) {
		var sectionTitle = core.sections[i].sectionTitle;

		var progressButton = document.createElement("button");
		progressButton.className = "progressButton";
		progressButton.innerHTML = sectionTitle;
		progressButton.id = i;
		progressButton.name = sectionTitle + "_button";
		progressButton.addEventListener("click", progressButtonHandler)

		var progressContent = document.getElementById('progressContent');
		progressContent.appendChild(progressButton);
	}
}

function searchWarrantScript() {
	

	$('#questionText').html('Please fill out the information below.');

	//<i class="step fi-address-book size-12"></i>
	$('#'+core.currentSectionIndex).toggleClass('selected');
	loadSection(core.currentSectionIndex, answerDiv);


	//addSingleLineInput(parent, "drNumber", "CAPD_DR/INC# :");
	//addSingleLineInput(parent, "peaceOfficerName", "Peace Officer Name :");
	//addSingleLineInput(parent, "agencyName", "Your Agency Name :");
	//addSingleLineInput(parent, "providerName", "Target Provider Name :");

	//addSubmitButton(parent);

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

function addSingleLineInput(questionID, questionLabel) {
	var label = document.createElement("div");
	var button = document.createElement("button");
	button.id = questionID + "Button";
	button.name = questionID;
	button.className = "infoButton";
	button.innerHTML = "<i class='step fi-info infoIcon' onclick='infoButtonHandler();'></i>";
	button.onclick = infoButtonHandler;

	label.appendChild(button);
	label.className = "singleLineInputFieldLabel";
	label.id = questionID + "_label";
	label.innerHTML += questionLabel;
	answerDiv.appendChild(label);

	var input = document.createElement("input");
	input.type = "text";
	input.className = "singleLineInputField"; // set the CSS class
	input.id = questionID;

	if(core.answers[questionID] != undefined && core.answers[questionID] != "") {
		input.value = core.answers[questionID];
	}


	answerDiv.appendChild(input); // put it into the DOM
}

function addTextBoxInput(questionID, questionLabel, defaultText) {
	var label = document.createElement("div");
	var button = document.createElement("button");
	button.id = questionID + "Button";
	button.name = questionID;
	button.className = "infoButton";
	button.innerHTML = "<i class='step fi-info infoIcon' onclick='infoButtonHandler();'></i>";
	button.onclick = infoButtonHandler;

	label.appendChild(button);
	label.className = "textBoxFieldInputLabel";
	label.id = questionID + "_label";
	label.innerHTML += questionLabel;
	answerDiv.appendChild(label);

	var input = document.createElement("textarea");
	input.type = "text";
	input.wrap = "soft";
	input.className = "textBoxFieldInput"; // set the CSS class
	input.id = questionID;

	if(core.answers[questionID] != undefined && core.answers[questionID] != "") {
		input.value = core.answers[questionID];
	} else if(defaultText != null) {
		input.value = defaultText;
	}

	answerDiv.appendChild(input); // put it into the DOM
}

function addyesNoQuestion(questionID, questionLabel) {
	// so we show a YES or NO option
	// if they click YES, then populate underneath it?
	// if they click NO, do nothing/flag as no.
	var label = document.createElement("div");
	var button = document.createElement("button");
	button.id = questionID + "Button";
	button.name = questionID;
	button.className = "infoButton";
	button.innerHTML = "<i class='step fi-info infoIcon' onclick='infoButtonHandler();'></i>";
	button.onclick = infoButtonHandler;

	label.appendChild(button);
	label.className = "textBoxFieldInputLabel";
	label.innerHTML += questionLabel;
	answerDiv.appendChild(label);

	var yesButton = document.createElement("button");
	yesButton.id = questionID + "_YesButton";
	yesButton.name = questionID;
	yesButton.className = "questionYesButton";
	yesButton.innerHTML = "Yes";
	yesButton.onclick = yesNoButtonHandler;

	var noButton = document.createElement("button");
	noButton.id = questionID + "_NoButton";
	noButton.name = questionID;
	noButton.className = "questionNoButton";
	noButton.innerHTML = "No";
	noButton.onclick = yesNoButtonHandler;

	if(core.answers[questionID]) {
		yesButton.className += " questionButtonSelected";
	} else {
		noButton.className += " questionButtonSelected";
	}

	answerDiv.appendChild(noButton); // put it into the DOM
	answerDiv.appendChild(yesButton); // put it into the DOM
}

function addSingleChoiceOption(questionID, questionLabel, options) {
	// the question will need the options defined in the configuration
	var label = document.createElement("div");
	var button = document.createElement("button");
	button.id = questionID + "Button";
	button.name = questionID;
	button.className = "infoButton";
	button.innerHTML = "<i class='step fi-info infoIcon' onclick='infoButtonHandler();'></i>";
	button.onclick = infoButtonHandler;

	label.appendChild(button);
	label.className = "singleLineInputFieldLabel";
	label.id = questionID + "_label";
	label.innerHTML += questionLabel;
	answerDiv.appendChild(label);

	var form = document.createElement("form");
	for(i in options) {
		var wrapper = document.createElement("div");
		wrapper.className = "radioOptionWrapper";

		var radioOption = document.createElement("input");
		radioOption.type = "radio";
		radioOption.value = options[i];
		radioOption.name = questionID;
		radioOption.className = "radioOption";
		wrapper.appendChild(radioOption);

		var radioLabel = document.createElement("div");
		radioLabel.className = "radioOptionLabel";
		radioLabel.innerHTML = options[i];
		wrapper.appendChild(radioLabel);
		form.appendChild(wrapper);
	}

	answerDiv.appendChild(form);
}

function yesNoButtonHandler() {
	var yesOrNo = $(window.event.target)[0].outerText;
	var questionID = $(window.event.target)[0].name;

	$('.questionNoButton').toggleClass('questionButtonSelected');
	$('.questionYesButton').toggleClass('questionButtonSelected');

	if(yesOrNo == "Yes") {
		// A yes button has been pressed. Find the question it is for and label it as true?
		core.answers[questionID] = true;
		$('#submitButton').remove();

		// load the rest of the questions
		for(i in core.sections[core.currentSectionIndex].sectionInputs) {
			var sectionInput = core.sections[core.currentSectionIndex].sectionInputs[i];
			if(sectionInput.inputType == "singleLineText") {
				addSingleLineInput(sectionInput.questionID, sectionInput.inputLabel);
			} else if(sectionInput.inputType == "textBoxInput") {
				addTextBoxInput(sectionInput.questionID, sectionInput.inputLabel, sectionInput.defaultText);
			}
		}

		addSubmitButton();

	} else {
		core.answers[questionID] = false;

		for(i in core.sections[core.currentSectionIndex].sectionInputs) {
			if(i > 0) {
				var sectionInput = core.sections[core.currentSectionIndex].sectionInputs[i];
				$('#' + sectionInput.questionID).remove();
				$('#' + sectionInput.questionID + "_label").remove();
			}
		}
	}
}

function infoButtonHandler() {
	var questionID = $(window.event.target).parent()[0].name;

	// send the infoBarText data to the main process for a new window

	$('#detailsText').empty();
	var infoPanel = document.getElementById("detailsText");

	var infoText = "<p>" + core.infoBarText[questionID].infoText.replace(new RegExp("\n", 'g'), "<br>&emsp;&emsp;") + "</p>";
	$('#detailsText').html(infoText);

	if(core.infoBarText[questionID].buttons.length > 0) {
		var buttons = core.infoBarText[questionID].buttons;
		for(var i in buttons) {
			// we need the button text and the button data
			var button = document.createElement("button");
			button.name = buttons[i].buttonData;
			button.className = "moreInfoButton";
			button.innerHTML = buttons[i].buttonText;
			button.addEventListener("click", moreInfoButtonHandler);
			infoPanel.appendChild(button);
		}
	}
}

function moreInfoButtonHandler() {
	var data = $(window.event.target)[0].name;
	ipcRenderer.send('infoWindow', data);
}

function progressButtonHandler() {
	var progressID = $(window.event.target)[0].id;
	$('.selected').toggleClass('selected');
	$(window.event.target).toggleClass('selected');
	saveInputs();

	core.currentSectionIndex = progressID;
	loadSection(progressID);

	if(core.currentSectionIndex == core.sections.length-1) {
		$('#submitButton').html("Submit and Make Document");
		$('#submitButton').width("200px");
	}
}

function addSubmitButton() {
	var button = document.createElement("button");
	button.id = "submitButton";
	button.className = "submitButton";
	button.innerHTML = "Save and Continue";
	button.addEventListener("click", submitButtonHandler);
	answerDiv.appendChild(button);
}

function submitButtonHandler() {
	// we need to get the supplied answers for all input fields and save them with their question ID in core.answers
	saveInputs();

	// we need to keep track of the current section and then advance to the next one when the submit button is pressed
	core.currentSectionIndex++;
	if(core.currentSectionIndex >= core.sections.length) {
		// here we should display a confirmation dialog and if they confirm, write the data to the sheet and end the program
		$('#submitButton').html("Submit and Make Document");
		$('#submitButton').width("200px");

		var makeDocumentBoolean = confirm("Are you sure you want to make the document?");
		if(makeDocumentBoolean) {
			makeDocument();
		}

	} else if(core.currentSectionIndex == core.sections.length-1) {
		// We are on the LAST section
		loadSection(core.currentSectionIndex, answerDiv);
		$('.selected').toggleClass('selected');
		$('#'+core.currentSectionIndex).toggleClass('selected');

		$('#submitButton').html("Submit and Make Document");
		$('#submitButton').width("200px");

		// change the button text
	} else {
		loadSection(core.currentSectionIndex, answerDiv);
		$('.selected').toggleClass('selected');
		$('#'+core.currentSectionIndex).toggleClass('selected');
	}
}

function saveInputs() {
	if(core.currentSectionIndex < core.sections.length) {
		for(i in core.sections[core.currentSectionIndex].sectionInputs) {
			var section = core.sections[core.currentSectionIndex].sectionInputs[i];
			if(section.inputType == "singleLineText") {
				var inputText = $('#' + section.questionID).val();
				core.answers[section.questionID] = inputText;

			} else if(section.inputType == "textBoxInput") {
				var inputText = $('#' + section.questionID).val();
				core.answers[section.questionID] = inputText;

			} else if(section.inputType == "singleChoiceOption") {
				var radioOptions = document.getElementsByName(section.questionID);

				for(i in radioOptions) {
					if(radioOptions[i].checked) {
						core.answers[section.questionID] = radioOptions[i].value;
					}
				}
			}
		}
	}
}

function loadSection(sectionIndex) {
	var targetSection = core.sections[sectionIndex];
	// clear the screen
	$('#questionText').empty();
	$('#questionAnswer').empty();
	$('#detailsText').empty();

	var goodToGo = true;
	if(targetSection.sectionConditions.length > 0) {
		// then there is a condition we must be aware of
		for(i in targetSection.sectionConditions) {
			if(!core.answers[targetSection.sectionConditions[i]]) {
				goodToGo = false;
			}
		}
	}

	if(goodToGo) {
		// set the question text
		$('#questionText').html(targetSection.sectionText);

		// loop through the inputs and make each thing
		for(index in targetSection.sectionInputs) {
			if(targetSection.sectionInputs[index].inputType == "singleLineText") {
				addSingleLineInput(targetSection.sectionInputs[index].questionID, targetSection.sectionInputs[index].inputLabel);

			} else if(targetSection.sectionInputs[index].inputType == "textBoxInput") {
				addTextBoxInput(targetSection.sectionInputs[index].questionID, targetSection.sectionInputs[index].inputLabel, targetSection.sectionInputs[index].defaultText);

			} else if(targetSection.sectionInputs[index].inputType == "yesNoQuestion") {
				addyesNoQuestion(targetSection.sectionInputs[index].questionID, targetSection.sectionInputs[index].inputLabel);
				if(core.answers[targetSection.sectionInputs[index].questionID] == undefined || !core.answers[targetSection.sectionInputs[index].questionID]) {
					break;
				}

			} else if(targetSection.sectionInputs[index].inputType == "singleChoiceOption") {
				addSingleChoiceOption(targetSection.sectionInputs[index].questionID, targetSection.sectionInputs[index].inputLabel, targetSection.sectionInputs[index].radioOptions)
			}
		}

		addSubmitButton();
	} else {
		// cannot load this section due to a previous choice. tell them that.
		var reason = targetSection.sectionConditionsFalse;
		$('#questionText').html(reason);
		addSubmitButton();
	}
}

function makeDocument() {
	console.log("Now the program makes the document");

	for(var key in core.answers) {
		console.log(key)
		switch(key) {
			case 'delay_notice_yesNo':
				if(core.answers.sealed_warrant_yesNo && core.answers.delay_notice_yesNo) {
					core.finalInserts['request_to_delay_insert'] = "Pursuant to Penal Code section 1546.2(b)(1), this court has the authority to delay notification to the target of this investigation for up to ninety (90) days upon a showing that contemporaneous notice will have an adverse result. Penal Code section 1546 (a) defines adverse result as: danger to the life or physical safety of an individual; flight from prosecution; destruction of or tampering with evidence; intimidation of potential witnesses; and serious jeopardy to an investigation or undue delay of a trial.\n\nAdditionally, your affiant is aware that service providers, including Facebook, will customarily notify the account holder of a government request for account information, absent a court order prohibiting such notification.  Your affiant hereby requests an order requiring the service provider(s) to make all attempts to preserve all information related to the above account(s) (18 USC 2703(f)), and delay notification to subscriber(s) or any party providing information from notifying any other party, with the exception of other verified law enforcement agencies, that this information has been sought.\n\n";
					core.finalInserts["delay_notice_yesNo"] = true;

				} else {
					core.finalInserts["delay_notice_yesNo"] = false;
				}
				break;

			case 'foreign_or_local_corporation':
				if(core.answers[key] == "Foreign Corporation") {
					core.finalInserts[key] = "BLAH";

				} else if(core.answers[key] == "California Corporation") {
					core.finalInserts[key] = "BLAH";

				}
				break;

			case 'multiple_or_single_location':
				if(core.answers[key] == "Single Location") {
					core.finalInserts[key] = "I also know that the time period to obtain these records from most electronic and Internet based service providers, as well as the computer forensics, takes longer than the allotted ten-day warrant return period as required by statute [and department policy].  Therefore, I request that the warrant return date be adjusted to be due within 10 days of receipt of the information from a service provider or computer forensics laboratory.";

				} else if(core.answers[key] == "Multiple Locations") {
					core.finalInserts[key] = "I also know that the time period to obtain these records from most electronic and Internet based service providers, as well as the computer forensics, takes longer than the allotted ten-day warrant return period as required by statute [and department policy].  Furthermore, producing returns for each of the multiple locations as they are received would be burdensome to both the investigators as well as the courts.  Therefore, I request that the warrant return date be adjusted to be due within 10 days of receipt of the final information received from a service provider or computer forensics laboratory.";

				}
				break;

			case 'delivery_phone_number':
				core.finalInserts[key] = "Phone " + core.answers[key];
				break;

			case 'delivery_fax_number':
				core.finalInserts[key] = "/ FAX " + core.answers[key];
				break;

			default:
				core.finalInserts[key] = core.answers[key];
		}
	}




	// Read the docx file as a binary
	
	var content = fs.readFileSync(path.resolve(__dirname, '../search_warrant_template.docx'), 'binary');
	var zip = new JSZip(content);
	var doc = new Docxtemplater();
	doc.setOptions({linebreaks: true})
	doc.loadZip(zip);


	// So we need to assemble the final object with tags and everything.
	//	Most of this will be easy copy-paste from what they entered, but some of it requires inserts
	//	This is where the inserts config file comes in. Users can put the config file inserts they want in there and this will use them if they exist
	//	We could make the inserts arrays of inserts and user input could be placed between two inserts



	//set the templateVariables
	doc.setData(
	    core.finalInserts
	);

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
	


	// NOTES:
	//	If it finds a {tag} that it does not have a definition for, it replaces it with "undefined".
	//	\n and \r newline characters don't seem to work.

}

$(document).delegate('.textBoxFieldInput', 'keydown', function(e) {
  var keyCode = e.keyCode || e.which;

  if (keyCode == 9) {
    e.preventDefault();
    var start = this.selectionStart;
    var end = this.selectionEnd;

    // set textarea value to: text before caret + tab + text after caret
    $(this).val($(this).val().substring(0, start)
                + "\t"
                + $(this).val().substring(end));

    // put caret at right position again
    this.selectionStart =
    this.selectionEnd = start + 1;
  }
});

$(window).on('resize', function() {
	console.log('ok')
	$('#topGrid').height(window.innerHeight);
})