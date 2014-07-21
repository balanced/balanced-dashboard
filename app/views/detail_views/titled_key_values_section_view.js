Balanced.TitledKeyValuesSectionView = Balanced.View.extend({
	templateName: "detail_views/titled_key_values_section",

	getKeyValueView: function(label, field, format) {
		var model = this.get("model");
		var value = model.get(field);

		if (format === "date") {
			value = Balanced.Utils.humanReadableDateLong(value);
		}

		return Balanced.KeyValueView.create({
			key: label,
			value: value
		});
	},

	getLinkedKeyValueView: function(label, field, hrefField) {
		var model = this.get("model");

		return Balanced.LinkedKeyValueView.create({
			key: label,
			value: model.get(field),
			link: model.get(hrefField)
		});
	},
});

Balanced.DebitTitledKeyValuesSectionView = Balanced.TitledKeyValuesSectionView.extend({
	title: "Debit information",

	keyValueListViews: function() {
		return [
			this.getKeyValueView("Debit ID", "id"),
			this.getKeyValueView("Transaction number", "transaction_number"),
			this.getKeyValueView("Internal description", "description"),
			this.getKeyValueView("On statement as", "appears_on_statement_as")
		];
	}.property("model")
});

Balanced.CreditTitledKeyValuesSectionView = Balanced.TitledKeyValuesSectionView.extend({
	title: "Credit information",

	keyValueListViews: function() {
		return [
			this.getKeyValueView("Credit ID", "id"),
			this.getKeyValueView("Transaction number", "transaction_number"),
			this.getKeyValueView("Internal description", "description"),
			this.getKeyValueView("On statement as", "appears_on_statement_as")
		];
	}.property("model")
});

Balanced.RefundTitledKeyValuesSectionView = Balanced.TitledKeyValuesSectionView.extend({
	title: "Debit information",

	keyValueListViews: function() {
		return [
			this.getKeyValueView("Refund ID", "id"),
			this.getKeyValueView("Transaction number", "transaction_number"),
			this.getKeyValueView("Internal description", "description")
		];
	}.property("model")
});

Balanced.ReversalTitledKeyValuesSectionView = Balanced.TitledKeyValuesSectionView.extend({
	title: "Reversal information",

	keyValueListViews: function() {
		return [
			this.getKeyValueView("Reversal ID", "id"),
			this.getKeyValueView("Transaction number", "transaction_number"),
			this.getKeyValueView("Internal description", "description")
		];
	}.property("model")
});

Balanced.HoldTitledKeyValuesSectionView = Balanced.TitledKeyValuesSectionView.extend({
	title: "Hold information",

	keyValueListViews: function() {
		return [
			this.getKeyValueView("Hold ID", "id"),
			this.getKeyValueView("Transaction number", "transaction_number"),
			this.getKeyValueView("Internal description", "description"),
			this.getKeyValueView("On statement as", "appears_on_statement_as")
		];
	}.property("model")
});

Balanced.DisputeTitledKeyValuesSectionView = Balanced.TitledKeyValuesSectionView.extend({
	title: "Dispute information",

	keyValueListViews: function() {
		return [
			this.getKeyValueView("Dispute ID", "id"),
			this.getKeyValueView("Initiated at", "initiated_at", "date"),
			this.getKeyValueView("Respond by", "respond_by", "date"),
			this.getKeyValueView("Reason", "reason")
		];
	}.property("model")
});

Balanced.CustomerTitledKeyValuesSectionView = Balanced.TitledKeyValuesSectionView.extend({
	title: "Customer information",

	titleModalLinkView: function() {
		return Balanced.EditCustomerInfoModalView.create({
			customer: this.get("model")
		});
	}.property("model"),

	keyValueListViews: function() {
		return [
			this.getKeyValueView("Customer ID", "id"),
			this.getKeyValueView("Business Name", "business_name"),
			this.getKeyValueView("EIN", "ein"),
			this.getKeyValueView("Name", "name"),
			this.getKeyValueView("Email", "email"),
			this.getKeyValueView("Address line 1", "address.line1"),
			this.getKeyValueView("Address line 2", "address.line2"),
			this.getKeyValueView("City", "address.city"),
			this.getKeyValueView("State", "address.state"),
			this.getKeyValueView("Postal code", "address.postal_code"),
			this.getKeyValueView("Country", "country_name"),
			this.getKeyValueView("Phone number", "phone"),
			this.getKeyValueView("Date of birth", "dob"),
			this.getKeyValueView("SSN", "ssn_last4"),
			this.getKeyValueView("Country", "country_name"),

			this.getLinkedKeyValueView("Facebook ID", "facebook_id", "facebook_url"),
			this.getLinkedKeyValueView("Twitter ID", "twitter_id", "twitter_url")
		];
	}.property("model")
});

Balanced.CardTitledKeyValuesSectionView = Balanced.TitledKeyValuesSectionView.extend({
	title: "Card information",

	keyValueListViews: function() {
		return [
			this.getKeyValueView("Card ID", "id"),
			this.getKeyValueView("Name on account", "name"),
			this.getKeyValueView("Type", "type_name"),
			this.getKeyValueView("Bank", "formatted_bank_name"),
			this.getKeyValueView("Expiration date", "human_readable_expiration"),
			this.getKeyValueView("Address line 1", "address.line1"),
			this.getKeyValueView("Address line 2", "address.line2"),
			this.getKeyValueView("City", "address.city"),
			this.getKeyValueView("State", "address.state"),
			this.getKeyValueView("Postal code", "address.postal_code"),
			this.getKeyValueView("Country", "address.country_code")
		];
	}.property("model")
});

Balanced.BankAccountTitledKeyValuesSectionView = Balanced.TitledKeyValuesSectionView.extend({
	title: "Bank account information",

	keyValueListViews: function() {
		return [
			this.getKeyValueView("Bank account ID", "id"),
			this.getKeyValueView("Name on account", "name"),
			this.getKeyValueView("Account number", "account_number"),
			this.getKeyValueView("Routing number", "routing_number"),
			this.getKeyValueView("Type", "account_type_name"),
			this.getKeyValueView("Bank", "formatted_bank_name"),
			this.getKeyValueView("Expiration date", "human_readable_expiration"),
			this.getKeyValueView("Address line 1", "address.line1"),
			this.getKeyValueView("Address line 2", "address.line2"),
			this.getKeyValueView("City", "address.city"),
			this.getKeyValueView("State", "address.state"),
			this.getKeyValueView("Postal code", "address.postal_code"),
			this.getKeyValueView("Country", "address.country_code")
		];
	}.property("model")
});
