Balanced.WizardStepView = Balanced.View.extend({
	init: function() {
		this._super();
		this.get("controller").addStep(this);
	},
	hide: function() {
		$(this.get("element")).hide();
	},
	show: function() {
		$(this.get("element")).hide();
	},
	toggle: function() {
		var el = $(this.get("element"));
		el.toggle.apply(el, arguments);
	},

	back: function() {
		this.get("controller").prevStep();
	},

	next: function() {
		this.get("controller").nextStep();
	}
});
