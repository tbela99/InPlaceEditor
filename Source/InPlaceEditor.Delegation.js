
/*
---
script: InPlaceEditor.Delegation.js
license: MIT-style license.
description: inplace editor.
copyright: Copyright (c) 2010 Thierry Bela
authors: [Thierry Bela]

requires:
  InPlaceEditor
provides: [InPlaceEditor.Delegation]
...
*/

!function (window) {

"use strict";

	function wrapper(InPlaceEditor) {

		InPlaceEditor.Delegation = new Class({

			/*
				options: {

					relay: ''
				},
			*/

			Extends: InPlaceEditor,

			getEvents: function (el) {

				var self = this,
					options = Object.append({}, this.options, el && el.data()),
					property = 'backgroundColor',
					relay = ':relay(' + options.relay + ')';

				return [
							function(e, el) { el.tween(property, options.toColor) },
							function(e, el) {

								el.tween(property, options.fColor).get('tween').chain(function () { el.setStyle(property, el.retrieve('eip-color')) })
							},
							function(e, el) {

								e.stop();
								self.build(el, options)
							}

						].associate(['mouseenter' + relay, 'mouseleave' + relay, 'click' + relay])
			}
		})

		 /* InPlaceEditor DATA-API
		  * ============== */

		 var instance = new InPlaceEditor.Delegation(), key = 'data-inplace-edit';

		window.addEvent('domready', function () {
			
			document.body.addEvent('click:relay([data-toggle=inplace-edit-delegate])', function (e, el) {

				// already in use
				if(e.target.retrieve('data-inplace-edition')) return;

				var options = Object.append({}, el.data()),
					target = options.relay && (e.target.match(options.relay) && e.target || e.target.getParent(options.relay));
				
				// if(!options.relay && window.console && console.log) console.log('missing selector: relay')
				if(target) {

					e.preventDefault();

					if(!el.retrieve(key)) instance.attach(el.store(key, instance));
					instance.build(target, options)
				}
			})
		});

		return InPlaceEditor
	}

	if(typeof define == 'function' && define.amd) define(['./InPlaceEditor'], wrapper);
	else wrapper(window.InPlaceEditor)

}(this);
