InPlaceEditor
============

In place editor with <select> and event delegation support.

- [Demo using data API](http://tbela99.github.com/InPlaceEditor/Demos/index-data.html)
- [Demo with event delegation and data api](http://tbela99.github.com/InPlaceEditor/Demos/index-delegation-data.html)
- [Demo](http://tbela99.github.com/InPlaceEditor/Demos/index.html)
- [Demo with no buttons](http://tbela99.github.com/InPlaceEditor/Demos/index-nobuttons.html)
- [Demo with options](http://tbela99.github.com/InPlaceEditor/Demos/index-options.html)
- [Demo with options and no buttons](http://tbela99.github.com/InPlaceEditor/Demos/index-options-delegation-nobuttons.html)
- [Demo with event delegation](http://tbela99.github.com/InPlaceEditor/Demos/index-delegation.html)
- [Demo with event delegation and no buttons](http://tbela99.github.com/InPlaceEditor/Demos/index-delegation-nobuttons.html)

How to use
----------

you could create an instance this way:

### Javascript:

	//make every div that is a form child node editable
	var inplace = new InPlaceEditor($$('form > div'), {
	
							properties: {
							
								rows: 3,
								cols: 18
							},
							validate: 'numeric',
							onChange: function (div, value, oldValue) {

								//do something
							}
						});
						
or this way, you can attach elements later
	
### Javascript:
				
	//make every div that is a form child node editable
	var inplace = new InPlaceEditor({
	
							properties: {
							
								rows: 3,
								cols: 18
							},
							validate: 'required',
							onChange: function (div, value, oldValue) {

								//do something
							}
						});
						
	inplace.attach('form > div');
							
## InPlaceEditor Options:

- wrapper - (*string*, optional) HTML tag for the editor wrapper. default to *span*
- buttons - (*boolean*, optional) display save and cancel buttons. default to true. if set to false, input is saved on blur or cancelled if the validation fails or the user press *esc*
- property - (*string*, optional) element property to edit. possible values are *text* and *html*. default to *text*
- element - (*string*, optional) editor HTML tag. possible values as *input*, *textarea*. default to *textarea*
- toColor - (*string*, optional) when the mouse enter the element, change its background color to this value
- fColor - (*string*, optional) when the mouse leave the element, change its background color to this value
- newLine - (*boolean*, optional) insert a new line between the editor and cancel/save buttons
- properties - (*object*, optional) editor properties. for example for textarea, you may want to set the number of rows, cols, etc.
- validate - (*mixed*, optional) (string) list of validators separated with space or function that validates user input, return true if the input is valid.
- className - (*string*, optional) class name for the editor wrapper. default to *inplace-edit*.
- cancelMsg - (*string*, optional) value of the cancel button. default to *cancel*
- okMsg - (*string*, optional) value of the OK button. default to *SAVE*
- target - (*mixed*, optional) id or function that return an element. this element is automatically updated with the user input.

		
## InPlaceEditor.Delegation Options:

- relay - (*string*) selector for the nodes that will be edited

		
## InPlaceEditor.Options Options:

- value - (*string*, optional) if options are object then this is the name of the property used as value. default to *'value'*
- text - (*string*, optional) if options are object then this is the name of the property used as text. default to *'text'*
- input - (*mixed*, optional) id of the input element or function that return it. the value of the selected option will be stored as input value and the editable element will contain the selected text
- inputProperty - (*text*, optional) name of the input property
- options - (*array*) array of options. alternatively you can specify options using data attribute *data-inplace-options* of the element or the input


## InPlaceEditor Events:

### onChange

fire when the element content has been edited.

### Arguments:

- element - (*element*) the element that has been edited
- value - (*string*) the new element content
- oldValue - (*string*) the previous element content
	
## Element Method: attach
------------

attach InPlaceEditor behaviors to elements

### Returns:

* this InPlaceEditor instance

### Arguments:

elements - (*mixed*) elements.

## Element Method: detach
------------

remove InPlaceEditor behaviors from elements

### Returns:

* this InPlaceEditor instance

### Arguments:

elements - (*mixed*) elements.

Data API
--------

InPlaceEditor can be used with data api with the help of mootools Element.Data plugin. all the options are available through data-* attributes of either the element or the delegator.
in order to enable usage via data api, you have to set data-toggle attribute to *inplace-edit*

	<div data-toggle="inplace-edit">
	
if you use event delegation then set data-toggle to *inplace-edit-delegate* on the delegator element

	<div data-toggle="inplace-edit-delegate" data-relay=".editable">
		
		<div class="editable" data-options="['Select size', 1,5,10,20,50,100]" data-validate="numeric">Select size</div>
		<div class="editable">Type anything here</div>
	</div>
	
validators are separated with space and options are passed as a json string like in this example

	<div data-validate="required myvalidator" data-options="[1,5,10,20,50,100]" data-ok-msg="Yes!" data-cancel-msg="I don't want it now">

Validation API
--------------

Validators are available through InPlaceEditor.Validators. there are two built-in validators:

- required: accept anything but the empty string
- numeric: accept numeric input

you can extend InPlaceEditor.Validators with your own validator

	InPlaceEditor.Validator.even = function (value) { return !isNaN(value) && value % 2 == 0 }

and use it later with

	new InPlaceEditor({

		...
		validate: 'even required' // must pass both required and even validators
	})

or with data api

	<div data-validator="required even">

or you can still use the old fashioned style

	new InPlaceEditor({

		...
		validate: function (value) {
		
			if(isNaN(value)) return false;
			
			return value !== '' && value % 2 == 0
		}
	})
