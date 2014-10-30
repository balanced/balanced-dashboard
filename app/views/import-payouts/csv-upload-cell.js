import Ember from "ember";
import initializePopover from "./initialize-popover";

var CsvUploadCellView = Ember.View.extend({
	tagName: "td",
	fieldsErrors: Ember.computed.reads("item.validationErrors.csvFields"),

	didInsertElement: function() {
		this._super();
		if (this.get("isError")) {
			this.initializePopover();
		}
	},

	labelClasses: function() {
		var classes = ["label"];
		if (this.get("isError")) {
			classes.push("label-error");
		}
		if (this.get("hasIsRequiredError")) {
			classes.push("label-required");
		} else if (!this.get("fieldValue")) {
			classes.push("label-blank");
		}
		return classes.join(" ");
	}.property("fieldValue", "isError"),

	isError: Ember.computed.gt("errorMessages.length", 0),
	errorMessages: function() {
		var fieldName = this.get("fieldName");
		var errors = this.get("fieldsErrors");
		if (errors) {
			errors = errors.get(fieldName);
		}
		return errors || [];
	}.property("fieldName", "fieldsErrors"),

	fieldValue: function() {
		var fieldName = this.get("fieldName");
		var fields = this.get("item.csvFields");
		if (fields) {
			var value = (fields[fieldName] || "").trim();
			if (value.length > 0) {
				return value;
			}
		}
		return undefined;
	}.property("item.csvFields", "fieldName"),

	hasIsRequiredError: function() {
		var messages = this.get("errorMessages.allMessages") || [];
		return messages.any(function(array, index) {
			return array[1] === "can't be blank";
		});
	}.property("errorMessages"),

	titleValue: Ember.computed.readOnly("fieldValue"),

	displayValue: function() {
		var f = this.get("fieldValue");
		if (f) {
			return f;
		} else if (this.get("hasIsRequiredError")) {
			return "required";
		} else {
			return "----------";
		}
	}.property("fieldValue", "hasIsRequiredError"),

	initializePopover: function() {
		initializePopover(this, this.get("fieldName"), "[data-tooltip]", 'errorMessages.messages');
	}
});

export default CsvUploadCellView;
