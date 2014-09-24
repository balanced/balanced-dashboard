import Rev0Serializer from "../serializers/rev0";
import Model from "./core/model";
import Ember from "ember";

var UserInvite = Model.extend(Ember.Validations, {
	validations: {
		email_address: {
			presence: true,
			length: {
				minimum: 6
			},
			format: /.+@.+\..{2,4}/
		}
	},

	delete: function(settings) {
		settings = _.extend({
			data: {
				email_address: this.get('email_address')
			}
		}, settings || {});

		return this._super(settings);
	}
});

UserInvite.reopenClass({
	serializer: Rev0Serializer.create()
});

export default UserInvite;
