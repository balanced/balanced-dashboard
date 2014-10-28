import Ember from "ember";
import KeyValueView from "../key-value";
import LinkedKeyValueView from "../linked-key-value";
import Utils from "balanced-dashboard/lib/utils";

var TitledKeyValuesSectionView = Ember.View.extend({
	layoutName: "detail-views/titled-key-values-section",

	title: function() {
		return "%@ information".fmt(this.get("model.type_name"));
	}.property("model.type_name"),

	getFieldValue: function(fieldName) {
		var model = this.get("model");
		var dateFields = ["created_at", "initiated_at", "respond_by", "from_date", "to_date"];

		if (model === undefined) {
			return;
		}
		var value = Ember.get(model, fieldName);

		if (_.contains(dateFields, fieldName)) {
			value = Utils.humanReadableDateTime(value);
		}

		return value;
	},

	getKeyValueView: function(label, fieldName) {
		var value = this.getFieldValue(fieldName);
		return KeyValueView.extend({
			key: label,
			value: value
		});
	},

	getLinkedKeyValueView: function(label, fieldName, hrefFieldName) {
		if (Ember.isBlank(this.get("model"))) {
			return this.getKeyValueView(label, fieldName);
		}

		var value = this.getFieldValue(fieldName);
		var link = Ember.get(this.get("model"), hrefFieldName);

		if (Ember.isBlank(link)) {
			return this.getKeyValueView(label, fieldName);
		}

		if (link.indexOf('@') > 0) {
			link = "mailto:" + link;
		} else if (link.indexOf('http') < 0) {
			link = "http://" + link;
		}

		return LinkedKeyValueView.extend({
			key: label,
			value: value,
			link: link
		});
	},
});

export default TitledKeyValuesSectionView;
