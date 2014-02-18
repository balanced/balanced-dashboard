require("app/views/popover");

Balanced.CsvUploadCellView = Balanced.View.extend({
	tagName: "td",

	initializePopover: function() {
		var self = this;
		self.$().find("span").popover({
			trigger: "hover",
			placement: "top",
			html: true,
			content: function() {
				var messages = [];
				var wrap = function(m) {
					var content = Ember.Handlebars.Utils.escapeExpression(m);;
					messages.push("<p>" + content + "</p>");
				};
				wrap("Invalid field " + self.get("fieldName"));
				self.get("errorMessages.fullMessages").forEach(function(m) {
					wrap(m);
				});
				messages = '<i class="icon icon-alert"></i>' + messages.join(" ");
				return messages;
			}
		});
	},

	didInsertElement: function() {
		this._super();
		if (this.get("isErrorField")) {
			this.initializePopover();
		}
	},

	isErrorField: Ember.computed.gt("errorMessages.length", 0),

	errorMessages: function() {
		var fieldName = this.get("fieldName");
		var errors = this.get("context.validationErrors.csvFields");
		if (errors) {
			errors = errors.get(fieldName);
		}
		return errors || [];
	}.property("fieldName"),

	cssClasses: function() {
		var classes = [];

		if (this.get("class")) {
			classes.push(this.get("class"));
		}

		if (this.get("isError")) {
			classes.push("label");
			classes.push("label-error");
		}
		return classes.join(" ");
	}.property("errorMessages"),

	isError: function() {
		var length = this.get("errorMessages.length");
		return length > 0;
	}.property("errorMessages"),

	value: function() {
		var fieldName = this.get("fieldName");
		var fields = this.get("context.csvFields");
		if (fields) {
			return fields[fieldName];
		} else {
			return "";
		}
	}.property("context.csvFields")
});

Balanced.DefaultCsvUploadCellView = Balanced.CsvUploadCellView.extend({
	templateName: "marketplace/upload_payments_csv/default_csv_upload_cell",
});
