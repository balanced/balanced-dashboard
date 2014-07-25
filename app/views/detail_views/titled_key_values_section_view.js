Balanced.TitledKeyValuesSectionView = Balanced.View.extend({
	layoutName: "detail_views/titled_key_values_section",

	title: function() {
		return "%@ information".fmt(this.get("model.type_name"));
	}.property("model.type_name"),

	getFieldValue: function(fieldName) {
		var model = this.get("model");
		var value = Ember.get(model, fieldName);

		if (_.isDate(value)) {
			value = Balanced.Utils.humanReadableDateLong(value);
		}

		return value;
	},

	getKeyValueView: function(label, fieldName) {
		var value = this.getFieldValue(fieldName);
		return Balanced.KeyValueView.create({
			key: label,
			value: value
		});
	},

	getLinkedKeyValueView: function(label, fieldName, hrefFieldName) {
		var value = this.getFieldValue(fieldName);
		var link = Ember.get(this.get("model"), hrefFieldName);

		return Balanced.LinkedKeyValueView.create({
			key: label,
			value: value,
			link: link
		});
	},
});

var ListValueGenerator = function() {
	this.values = [];
};

ListValueGenerator.create = function() {
	return new this();
};

ListValueGenerator.prototype.add = function(label, fieldName, hrefField) {
	this.values.push({
		label: label,
		fieldName: fieldName,
		hrefField: hrefField
	});
	return this;
};

ListValueGenerator.prototype.toProperty = function() {
	var values = this.values;
	var fieldNames = values.mapBy("fieldName").map(function(name) {
		return "model." + name
	});
	var method = function() {
		var view = this;
		return values.map(function(value) {
			if (Ember.isBlank(value.hrefField)) {
				return view.getKeyValueView(value.label, value.fieldName);
			} else {
				return view.getLinkedKeyValueView(value.label, value.fieldName, value.hrefField);
			}
		});
	};

	return method.property.apply(method, fieldNames);
};

Balanced.OrderTitledKeyValuesSectionView = Balanced.TitledKeyValuesSectionView.extend({
	keyValueListViews: ListValueGenerator.create()
		.add("Order ID", "id")
		.add("Internal description", "description")
		.toProperty()
});

Balanced.TransactionTitledKeyValuesSectionView = Balanced.TitledKeyValuesSectionView.extend({
	editModelModalClass: function() {
		return Balanced.Modals.EditTransactionModalView;
	}.property(),

	keyValueListViews: function() {
		var idTitle = "%@ ID".fmt(this.get("model.type_name"));
		return [
			this.getKeyValueView(idTitle, "id"),
			this.getKeyValueView("Transaction number", "transaction_number"),
			this.getKeyValueView("Internal description", "description"),
			this.getKeyValueView("On statement as", "appears_on_statement_as")
		];
	}.property("model", "model.id", "model.transaction_number", "model.description", "model.appears_on_statement_as")
});

Balanced.DisputeTitledKeyValuesSectionView = Balanced.TransactionTitledKeyValuesSectionView.extend({
	editModelModalClass: function() {
		return undefined;
	}.property(),

	keyValueListViews: ListValueGenerator.create()
		.add("Dispute ID", "id")
		.add("Initiated at", "initiated_at", "date")
		.add("Respond by", "respond_by", "date")
		.add("Reason", "reason")
		.toProperty()
});

Balanced.CustomerTitledKeyValuesSectionView = Balanced.TitledKeyValuesSectionView.extend({
	title: "Customer information",
	titleModalLinkView: function() {
		return Balanced.EditCustomerInfoModalView.create({
			customer: this.get("model")
		});
	}.property("model"),

	keyValueListViews: ListValueGenerator.create()
		.add("Customer ID", "id")
		.add("Business Name", "business_name")
		.add("EIN", "ein")
		.add("Name", "name")
		.add("Email", "email")
		.add("Address line 1", "address.line1")
		.add("Address line 2", "address.line2")
		.add("City", "address.city")
		.add("State", "address.state")
		.add("Postal code", "address.postal_code")
		.add("Country", "country_name")
		.add("Phone number", "phone")
		.add("Date of birth", "dob")
		.add("SSN", "ssn_last4")
		.add("Country", "country_name")

	.add("Facebook ID", "facebook_id", "facebook_url")
		.add("Twitter ID", "twitter_id", "twitter_url")
		.toProperty()
});

Balanced.CardTitledKeyValuesSectionView = Balanced.TitledKeyValuesSectionView.extend({
	title: "Card information",

	keyValueListViews: ListValueGenerator.create()
		.add("Card ID", "id")
		.add("Name on account", "name")
		.add("Type", "type_name")
		.add("Bank", "formatted_bank_name")
		.add("Expiration date", "human_readable_expiration")
		.add("Address line 1", "address.line1")
		.add("Address line 2", "address.line2")
		.add("City", "address.city")
		.add("State", "address.state")
		.add("Postal code", "address.postal_code")
		.add("Country", "address.country_code")
		.toProperty()
});

Balanced.BankAccountTitledKeyValuesSectionView = Balanced.TitledKeyValuesSectionView.extend({
	title: "Bank account information",

	keyValueListViews: ListValueGenerator.create()
		.add("Bank account ID", "id")
		.add("Name on account", "name")
		.add("Account number", "account_number")
		.add("Routing number", "routing_number")
		.add("Type", "account_type_name")
		.add("Bank", "formatted_bank_name")
		.add("Expiration date", "human_readable_expiration")
		.add("Address line 1", "address.line1")
		.add("Address line 2", "address.line2")
		.add("City", "address.city")
		.add("State", "address.state")
		.add("Postal code", "address.postal_code")
		.add("Country", "address.country_code")
		.toProperty()
});

Balanced.InvoiceTitledKeyValuesSectionView = Balanced.TitledKeyValuesSectionView.extend({
	keyValueListViews: ListValueGenerator.create()
		.add("Invoice ID", "id")
		.add("From", "from_date", "date")
		.add("To", "to_date", "date")
		.toProperty()
});

Balanced.SettingsMarketplaceTitledKeyValuesSectionView = Balanced.TitledKeyValuesSectionView.extend({
	classNameBindings: [":marketplace-info"],
	title: "Marketplace information",
	editModelModalClass: function() {
		return Balanced.Modals.MarketplaceEditModalView;
	}.property("model"),

	keyValueListViews: ListValueGenerator.create()
		.add("Marketplace ID", "id")
		.add("Name", "name")
		.add("Support email", "support_email_address")
		.add("Domain URL", "domain_url")
		.add("Support phone number", "support_phone_number")
		.toProperty()
});

Balanced.SettingsOwnerTitledKeyValuesSectionView = Balanced.TitledKeyValuesSectionView.extend({
	classNameBindings: [":owner-info"],
	title: "Owner information",

	titleModalLinkView: function() {
		if (Ember.isBlank(this.get("model"))) {
			return undefined;
		}
		return Balanced.EditCustomerInfoModalView.create({
			customer: this.get("model"),
			marketplaceOwner: true
		});
	}.property("model"),

	keyValueListViews: ListValueGenerator.create()
		.add("Type", "type")
		.add("Name", "display_me")
		.add("Support email", "email")
		.add("Address line 1", "address.line1")
		.add("Address line 2", "address.line2")
		.add("City", "address.city")
		.add("State", "address.state")
		.add("Postal code", "address.postal_code")
		.add("Country", "address.country_code")
		.add("Phone number", "phone")
		.toProperty()
});
