
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
			
			getEvents: function () {

				var self = this,
					options = this.options,
					property = 'backgroundColor',
					relay = ':relay(' + options.relay + ')';

				return [
							function(e, el) { el.tween(property, options.toColor) },
							function(e, el) { 
								
								el.tween(property, options.fColor).get('tween').chain(function () { el.setStyle(property, el.retrieve('eip-color')) }) 
							},
							function(e, el) {

								e.stop();
								self.build(el.store('eip-edit', 1))
							}

						].associate(['mouseenter' + relay, 'mouseleave' + relay, 'click' + relay])
			}
		})
		
		return InPlaceEditor
	}
	
	if(typeof define == 'function' && define.amd) define(['./InPlaceEditor'], wrapper);
	else  wrapper(window.InPlaceEditor)
	
}(this);
