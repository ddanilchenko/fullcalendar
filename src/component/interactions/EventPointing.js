
var EventPointing = FC.EventPointing = Interaction.extend({

	mousedOverSeg: null, // the segment object the user's mouse is over. null if over nothing


	/*
	component must implement:
		- publiclyTrigger
	*/


	bindToEl: function(el) {
		var component = this.component;

		component.bindSegHandlerToEl(el, 'click', this.handleClick.bind(this));
		component.bindSegHandlerToEl(el, 'mouseenter', this.handleMouseover.bind(this));
		component.bindSegHandlerToEl(el, 'mouseleave', this.handleMouseout.bind(this));
	},


	handleClick: function(seg, ev) {
		var res = this.component.publiclyTrigger('eventClick', { // can return `false` to cancel
			context: seg.el[0],
			args: [ seg.footprint.getEventLegacy(), ev, this.view ]
		});

		if (res === false) {
			ev.preventDefault();
		}
	},


	// Updates internal state and triggers handlers for when an event element is moused over
	handleMouseover: function(seg, ev) {
		if (
			!GlobalEmitter.get().shouldIgnoreMouse() &&
			!this.mousedOverSeg
		) {
			this.mousedOverSeg = seg;

			// TODO: move to EventSelecting's responsibility
			if (this.view.isEventDefResizable(seg.footprint.eventDef)) {
				seg.el.addClass('fc-allow-mouse-resize');
			}

			this.component.publiclyTrigger('eventMouseover', {
				context: seg.el[0],
				args: [ seg.footprint.getEventLegacy(), ev, this.view ]
			});
		}
	},


	// Updates internal state and triggers handlers for when an event element is moused out.
	// Can be given no arguments, in which case it will mouseout the segment that was previously moused over.
	handleMouseout: function(seg, ev) {
		if (this.mousedOverSeg) {
			this.mousedOverSeg = null;

			// TODO: move to EventSelecting's responsibility
			if (this.view.isEventDefResizable(seg.footprint.eventDef)) {
				seg.el.removeClass('fc-allow-mouse-resize');
			}

			this.component.publiclyTrigger('eventMouseout', {
				context: seg.el[0],
				args: [
					seg.footprint.getEventLegacy(),
					ev || {}, // if given no arg, make a mock mouse event
					this.view
				]
			});
		}
	},


	end: function() {
		if (this.mousedOverSeg) {
			this.handleMouseout(this.mousedOverSeg);
		}
	}

});
