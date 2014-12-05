import Ember from "ember";
import Auth from "balanced-dashboard/auth";

var ApiKeysTableComponent = Ember.Component.extend({
	oneKey: Ember.computed.equal('keys', 1),
	haveOtherSecrets: function() {
		return this.get('keys').filterBy('secret').length > 1;
	}.property('keys.@each'),

	knownApiKeys: Ember.computed.filterBy("keys", "secret"),
	canDeleteApiKeys: Ember.computed.gt("knownApiKeys.length", 1),
	showSecret: false,

	actions: {
		delete: function(key) {
			this.get("container").lookup("controller:application").send("openModal", "modals/api-key-delete-modal", key);
		},

		showKeySecret: function() {
			this.set('showSecret', true);
		}
	}
});

export default ApiKeysTableComponent;
