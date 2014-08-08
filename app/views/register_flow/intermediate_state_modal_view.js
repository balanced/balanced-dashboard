var Full = Balanced.Modals.FullModalMixin;

Balanced.IntermediateStateModalView = Balanced.ModalBaseView.extend(Full, {
	templateName: "register_flow/intermediate_state_modal",
	title: "Intermediate state",
});

Balanced.ApiKeyLinkIntermediateStateModalView = Balanced.IntermediateStateModalView.extend({
	message: function() {
		return "%@ - %@".fmt(this.get("marketplaceHref"), this.get("apiKeySecret"));
	}.property("marketplaceHref", "apiKeySecret"),
	actions: {
		save: function() {

		}
	}
});

Balanced.ApiKeyLinkIntermediateStateModalView.reopenClass({
	open: function(marketplaceHref, apiKeySecret) {
		return this.create({
			marketplaceHref: marketplaceHref,
			apiKeySecret: apiKeySecret
		});
	}
});
