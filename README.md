# DocumentBuilder
This is a highly configurable, interactive document preparation program. The entire program is based on a single configuration file that can be shaped to your liking. Currently this program specifically works with docx files.

## Using this program
You can clone this repo and use `npm install` or `yarn install` to get things rolling. This is the ideal environment for configuration as you can test things as you go. Then, once you have finished configuration, I reccommend using [electron-builder](https://github.com/electron-userland/electron-builder) to compile the program into whatever format you need.

## Configuration
The 'sections.json' file is the driving force of the whole program. All sections, text, questions, and help information are placed in there and then the program builds itself as defined.

The 'sections.json' file contains a single array of section objects:
```
[
  {section},
  {section},
  ...
]
```

Each 'section' object is defined as follows:
```
{
  "sectionTitle": "This is the title for the section and will show up in the progress pane",
  "sectionText": "This is the text that is shown at the top of the program",
  "sectionInputs": [
    {
      "inputType": "This is the type of question. Options include 'yesNoQuestion', 'singleLineText', 'textBoxInput', or 'singleChoiceOption'",
      "questionID": "This is a unique identifier for the question and is used throughout the program. You can choose what this is, but it must be unique.",
      "inputLabel": "This is the text that is placed above the question itself in the program.",
      "defaultText": "This is only used for 'textBoxInput' questions. It is the default text shown in the text box.",
      "radioOptions": "This is only used for 'singleChoiceOption' questions. It is an array of strings that are the names of the options you want."
    },
    ...
  ],
  "sectionConditions": ["This is an array of questionID strings. They should be booleans. Normally they are IDs for 'yesNoQuestion" questions."],
  "sectionConditionsFalse": "This is the text that should be shown if the section conditions are false.",
  "sectionHelp": [
    {
      "helpType": "This is the type of help content to add. Options are 'helpText' or 'helpInsert'",
      "helpTitle": "This is used only for 'helpText' entries. If it contains an empty string, it will be ignored. Otherwise it adds a bolded title above the help text content.",
      "targetQuestionID": "This is used only for 'helpInsert' entries. This is the questionID of the question that the entry should insert to. Normally this should be a questionID for a 'textBoxInput' question.",
      "helpContent": "This is the text content that should be added for this help entry."
    },
    ...
  ]
}
```

## Tips
* If the program won't load, then you may be lacking or have an extra comma somewhere in the section.json. Someday I may add a configuration checker to make this easier to deal with, but for now you'll need to proofread your section.json file yourself.
* If you want to simulate paragraphs in the help pane, make multiple 'helpText' entries in the configuration file with blank 'helpTitle' fields (blank as in *"helpTitle": "",*).
* The section.json file in the project right now is configured for a California Search Warrant. I would read through it to see plenty of examples of how to properly configure the program.
