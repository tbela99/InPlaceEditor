
/*
---
script: InPlaceEditor.js
license: MIT-style license.
description: inplace editor.
copyright: Copyright (c) 2010 Thierry Bela
authors: [Thierry Bela]

requires:
  core:1.3.1:
  - Class.Extras
  - Element.Event
  - Element.Style
  - Element.Dimensions
  - Fx.Tween
  - Array
  more:1.3.1:
  - Element.Delegation

provides: [InPlaceEditor]
...
*/

!function (window) {

"use strict";

	function wrapper() {

		var key = 'data-inplace-edition',
			InPlaceEditor = new Class({

				options: {

					//property: html/text
					//editor wrapper
					wrapper: 'span',
					//display buttons or save on blur and cancel when pressing esc
					buttons: true,
					//text, html
					property: 'text',
					element: 'textarea',
					toColor: "#e1ecf5",
					fColor: "#fff",
					newLine: true,
					//Apply - Cancel separator
					separator: '&nbsp;',
					//function that take user input as parameter and return true or false to indicate whether the input is valid
					// validate: function (value) { return ('' + value).trim() !== '' },
					validate: '',
					properties: {

						rows: 2,
						cols: 32
					},
					className: 'inplace-edit',
					cancelMsg: 'Cancel',
					okMsg: 'Save'
				},

				Implements: [Events, Options],
				initialize: function() {

					var params = Array.link(Array.slice(arguments), {options: Type.isObject, elements: function(obj) { return (obj != null) } });

					this.setOptions(params.options);

					if(params.elements) this.attach(params.elements)
				},

				getEvents: function (el) {

					var self = this,
						options = Object.merge({},this.options, el && el.data()),
						property = 'backgroundColor';

					return {
								mouseenter: function() { this.tween(property, options.toColor) },
								mouseleave: function() { this.tween(property, options.fColor).get('tween').chain(function () { this.setStyle(property, this.retrieve('eip-color')) }.bind(this)) },
								click: function(e) {

									e.stop();
									self.build(this)
								}
							}

				},
				build: function (el, options) {

					if(el.retrieve(key)) return this;

					options = Object.merge({}, this.options, options, el.store(key, 1).data());

					var input = typeof options.target == 'function' ? options.target(el) : document.id(options.target),
						inputProperty, property, oldValue, container, cancel, check, validate, element;
						
					if(input) Object.merge(options, input.data());
					
					inputProperty = options.inputProperty || 'value';

					property = options.property;
					oldValue = input ? input.get(inputProperty) : el.get(property);
					container = new Element(options.wrapper, {'class': options.className}).inject(el, 'after');
					cancel = function() {

						el.eliminate(key).style.display = el.retrieve('eip-display', '');
						container.destroy()
					};
					
					check = typeof options.validate == 'function' ? options.validate : (function () {

						var map = [];

						options.validate.split(' ').each(function (validator) {

							if(InPlaceEditor.Validators.hasOwnProperty(validator)) map.push(InPlaceEditor.Validators[validator])
						});

						return function (value) {

							return map.every(function (fn) {

								return fn(value)
							})
						}
					})();

					if(options.options == undefined) {

						element = new Element(options.element, options.properties).set('value', oldValue === '' && input ? el.get(property) : oldValue).inject(container);

						validate = function() {

							el.eliminate(key).style.display = el.retrieve('eip-display', '');

							var value = element.value;

							//validate input
							if(check(value) && value != oldValue) {

								if(input) input.set(inputProperty, value);
								el.set(property, value);

								this.fireEvent('change', [el, input ? input.get(inputProperty) : el.get(property), oldValue]);
							}

							container.destroy()

						}.bind(this)
					}

					else {

						var values =  input && JSON.decode(input.get('data-inplace-options')) || JSON.decode(el.get('data-inplace-options')) || options.options,
							element = new Element('select', options.properties).adopt((function () {

								var value = options.value || 'value', text = options.text || 'text', el;

								return Array.from(values).map(function (option) {

									el = document.createElement('option');

									if(typeof option == 'object') {

										el.value = option[value];
										el.text = option[text]
									}

									else {

										el.value = option; // ??
										el.text = option
									}

									el.selected = el.value == oldValue

									return el
								})

							})()).inject(container);

						validate = function() {

							el.eliminate(key).style.display = el.retrieve('eip-display', '');

							var selected = element.options[element.selectedIndex], value = selected && selected.value;

							//validate input
							if(check(value) && value != oldValue) {

								if(input) input.set(inputProperty, value);
								el.set(property, value);

								this.fireEvent('change', [el, input ? input.get(inputProperty) : el.get(property), oldValue]);
							}
							
							container.destroy()

						}.bind(this)
					}

					if(options.buttons) {

						//new line
						if(options.newLine) new Element('br').inject(container);

						//save
						container.grab(new Element('a[data-role=save]', {

							href: 'javascript:;',
							html: options.okMsg,
							events: {click: validate }
						}));

						//seperator
						if(options.separator) container.grab(new Element('span', {html: typeof options.separator == 'boolean' ? '&nbsp;' : options.separator}));

						//cancel
						container.grab(new Element('a[data-role=cancel]', {

							href: 'javascript:;',
							html: options.cancelMsg,
							events:{click: cancel}
						}))
					}

					else element.addEvents({

							keydown: function (e) {

								if(e.key == 'esc') cancel()
							},
							blur: validate.bind(this)
						}).focus();
						
					el.setStyles({display:'none', backgroundColor: options.fColor});

					return this
				},
				attach: function (elements) {

					$$(elements).each(function (el) {

						var events = this.getEvents(el);

						el.store('eip-color', el.style.backgroundColor).
							store('eip-display', el.style.display).
							store('eip-events', events).
							set({tween: {link: 'chain'}, events: events})

						}, this);

					return this
				},
				detach: function (elements) {

					$$(elements).each(function (element) { element.removeEvents(element.retrieve('eip-events') || {}) });

					return this
				}
			});

		// validation API
		InPlaceEditor.Validators = {

			numeric: function (value) {

				return !isNaN(value)
			},
			required: function (value) {

				return value.trim() !== ''
			}
		}

		 /* InPlaceEditor DATA-API
		  * ============== */

		var instance = new InPlaceEditor(), instancename = 'data-inplace-edit';
		
		window.addEvent('domready', function () {
			
			document.body.addEvent('click:relay([data-toggle=inplace-edit])', function (e, el) {

				e.preventDefault();

				if(!el.retrieve(instancename)) instance.attach(el.store(instancename, instance));
				instance.build(el)
			})
		});

		return InPlaceEditor
	}

	if(typeof define == 'function' && define.amd) define(['../mootools/Element.Data'], wrapper);
	else window.InPlaceEditor = wrapper()

}(this);

