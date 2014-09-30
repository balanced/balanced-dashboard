import Ember from "ember";

var MetaDictionary = Ember.Object.extend(Ember.Validations, {
	validations: {
		fields: {
			keyPresent: {
				validator: function(obj, attr, value) {
					var error = obj.get('fields').any(function(item, index) {
						return Ember.isBlank(item.key);
					});

					if (error) {
						obj.get("validationErrors").add(attr, "keyPresent", null, "All keys must be present.");
					}
				}
			}
		}
	},

	save: function() {
		var self = this;
		var newMeta = {};

		self.validate();

		if (self.get("isValid")) {
			self.get("fields").forEach(function(metaField) {
				newMeta[metaField.key] = metaField.value || "";
			});
			self.get("transaction").set("meta", newMeta);

			return self.get("transaction").save();
		} else {
			return Ember.RSVP.reject();
		}

	}
});

export default MetaDictionary;
