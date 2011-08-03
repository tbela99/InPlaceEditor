
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

(function (context) {

"use strict";

context.InPlaceEditor = new Class({

		options: {

			//property: html/text
			//editor wrapper
			wrapper: 'span',
			//text, html
			property: 'text',
			element: 'textarea',
			toColor: "#e1ecf5",
			fColor: "#fff",
			newLine: true,
			//Apply - Cancel separator
			separator: '&nbsp;',
			//function that take user input as parameter and return true or false to indicate whether the input is valid
			validate: function (value) { return !!value.trim() },
			properties: {

				rows: 2,
				cols: 32
			}
		},

		Implements: [Events, Options],
		initialize: function() {

			var params = Array.link(Array.slice(arguments), {options: Type.isObject, elements: function(obj) { return (obj != null) } });

			this.setOptions(params.options);

			this.events = this.getEvents();
			
			if(params.elements) this.attach(params.elements)
		},

		getEvents: function () {

			var self = this,
				options = this.options,
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
		build: function (el) {


			var options = this.options,
				oldValue = el.get(options.property),
				container = new Element(options.wrapper).inject(el, 'after'),
				textarea = new Element(options.element, options.properties).set('value', oldValue).inject(container);

			el.setStyles({display:'none', backgroundColor: options.fColor});

			//new line
			if(options.newLine) new Element('br').inject(container);

			//cancel
			container.grab(new Element('a', {

							href: 'javascript:;',
							html: 'Cancel',
							events:{
									click: function() {

									el.style.display = el.retrieve('eip-display');
									container.destroy()
								}
							}

						}));

			//seperator
			if(options.separator) container.grab(new Element('span', {html: typeof options.separator == 'boolean' ? '&nbsp;' : options.separator}));

			//save
			container.grab(new Element('a', {

				href: 'javascript:;', 
				html: 'Save',
				events: {

					click: function() {

						el.style.display = el.retrieve('eip-display');

						//validate input
						if(options.validate(textarea.value) && textarea.value != oldValue) this.fireEvent('change', [el.set(options.property, textarea.value), el.get(options.property), oldValue]);
						container.destroy()

					}.bind(this)
				}

			}));

			return this
		},
		attach: function (elements) {

			$$(elements).each(function (el) {

				el.store('eip-color', el.style.backgroundColor).
					store('eip-display', el.style.display).
					set({tween: {link: 'chain'}, events: this.events})

				}, this);

			return this
		},
		detach: function (elements) {

			$$(elements).removeEvents(this.events);

			return this
		}
	})
})(this);

