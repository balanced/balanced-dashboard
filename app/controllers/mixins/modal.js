Balanced.Modal = Ember.Mixin.create({
	displayed: false,

	open: function() {
		if(this.initModal) {
			this.initModal();
		}

        this.set('displayed', true);
    },

    close: function() {
    	if(this.destroyModal) {
			this.destroyModal();
		}

    	this.set('displayed', false);
    }
});
