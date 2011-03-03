
/*
---
script: InPlaceEditor.Delegation.js
license: MIT-style license.
description: inplace editor.
copyright: Copyright (c) 2010 Thierry Bela
authors: [Thierry Bela]

requires: 
  InPlaceEditor
provides: InPlaceEditor.Delegation
...
*/

InPlaceEditor.Delegation = new Class({

	/*
		options: {

			relay: ''
		},
	*/

		Extends: InPlaceEditor,
		
		getEvents: function () {

			var self = this,
				options = this.options,
				property = 'backgroundColor';

			return [
						function(e, el) { el.tween(property, options.toColor) },
						function(e, el) { 
							
							el.tween(property, options.fColor).get('tween').chain(function () { el.setStyle(property, el.retrieve('eip-color')) }) 
						},
						function(e, el) {

								e.stop();
								self.build(el)
						}

					].associate(['mouseenter:relay(' + options.relay + ')', 'mouseleave:relay(' + options.relay + ')', 'click:relay(' + options.relay + ')'])
		}
});
