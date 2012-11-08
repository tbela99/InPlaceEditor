
/*
---
script: InPlaceEditor.Options.js
license: MIT-style license.
description: inplace editor with select.
copyright: Copyright (c) 2012 Thierry Bela
authors: [Thierry Bela]

requires: 
  core:1.3.1:
  - Class.refactor
  InPlaceEditor
  
provides: [InPlaceEditor.Options]
...
*/

!function (window, undefined) {

"use strict";

	function wrapper(InPlaceEditor) {
		
		Class.refactor(InPlaceEditor, {
		
			build: function (el) {

				if(this.options.options == undefined) return this.previous(el);
				
				var options = this.options,
					
					// proxy element that contains real value instead of the displayed value
					input = options.getInput && options.getInput(el),
					inputProperty = options.inputProperty || 'value',
					
					//
					property = options.property,
					values =  input && JSON.decode(input.get('data-inplace-options')) || JSON.decode(el.get('data-inplace-options')) || options.options,
					oldValue = input ? input.get(inputProperty) : el.get(property),
					container = new Element(options.wrapper, {'class': options.className}).inject(el, 'after'),
					select = new Element('select', options.properties).adopt((function () {
					
						var value = options.value || 'value', text = options.text || 'text', el;
						
						return Array.from(values).map(function (option) {
						
							el = document.createElement('option');
							
							if(typeof option == 'object') {
								
								el.value = option[value];
								el.text = option[text]
							}
							
							else {
							
								el.value = option;
								el.text = option
							}
							
							el.selected = el.value == oldValue
							
							return el
						})
						
					})()).inject(container),
					cancel = function() {

						el.style.display = el.retrieve('eip-display', '');
						container.destroy()
					},
					validate = function() {

						el.style.display = el.retrieve('eip-display', '');
						
						var selected = select.getElement(':selected'), value = selected && selected.value;

						//validate input
						if(options.validate(value) && value != oldValue) {
						
							if(input) {
							
								input.set(inputProperty, value);
								el.set(property, selected.text)
							} 
							else el.set(property, value);
							
							this.fireEvent('change', [el, input ? input.get(inputProperty) : el.get(property), oldValue]);
						} 
						container.destroy()

					}.bind(this);

				// console.log(input, inputProperty, oldValue)
				el.setStyles({display:'none', backgroundColor: options.fColor});

				if(options.buttons) {
					
					//new line
					if(options.newLine) new Element('br').inject(container);

					//cancel
					container.grab(new Element('a', {

									href: 'javascript:;',
									html: 'Cancel',
									events:{click: cancel}
								}));

					//seperator
					if(options.separator) container.grab(new Element('span', {html: typeof options.separator == 'boolean' ? '&nbsp;' : options.separator}));

					//save
					container.grab(new Element('a', {

						href: 'javascript:;', 
						html: 'Save',
						events: {click: validate }
					}))
				}
				
				else select.addEvents({
				
						keydown: function (e) { 
						
							if(e.key == 'esc') cancel()
						},
						blur: validate.bind(this)
					}).focus();
					
				return this
			}
		})
		
		return InPlaceEditor
	}
	
	if(typeof define == 'function' && define.amd) define(['./InPlaceEditor'], wrapper);
	else  wrapper(window.InPlaceEditor)
	
}(this);
