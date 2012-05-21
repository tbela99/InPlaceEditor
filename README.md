InPlaceEditor
============

In place editor with event delegation support.

- [Demo](http://tbela99.github.com/InPlaceEditor/Demos/index.html)
- [Demo with event no buttons](http://tbela99.github.com/InPlaceEditor/Demos/index-nobuttons.html)
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
- validate - (*function*, optional) function that validates user input, return true if the input is valid.
- className - (*string*, optional) class name for the editor wrapper. default to *inplace-edit*.
- cancelMsg - (*string*, optional) value of the cancel button. default to *cancel*
- OKMsg - (*string*, optional) value of the OK button. default to *SAVE*


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
