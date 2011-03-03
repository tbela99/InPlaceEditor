InPlaceEditor.Delegation
============

extends InPlaceEditor with event delegation.

# InPlaceEditor.Delegation Options:

- relay (*string*) selector

### Javascript:

	//make every div that is a form child node editable
	var inplace = new InPlaceEditor.Delegation('form'), {
	
							relay: '> div',
							properties: {
							
								rows: 3,
								cols: 18
							},
							onChange: function (div, value, oldValue) {

								//do something
							}
						});