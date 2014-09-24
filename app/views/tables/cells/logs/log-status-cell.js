import Computed from "balanced-dashboard/utils/computed";
import LinkedTextCellView from "../linked-text-cell";
import Ember from "ember";
import Utils from "balanced-dashboard/lib/utils";

var LogStatusCellView = LinkedTextCellView.extend({
	routeName: Ember.computed.oneWay("item.route_name"),
	classNameBindings: [":black"],
	isBlank: false,
	primaryLabelText: Ember.computed.oneWay('item.status_code'),
	secondaryLabelText: Computed.transform('item.category_code', Utils.formatStatusCode),

	spanClassNames: function() {
		return this.get('primaryLabelText').match(/2\d\d/) ? 'succeeded' : 'failed';
	}.property('labelText'),

	displayValue: function() {
		var label = '<span class="primary">%@</span><span class="secondary">%@</span>';
		return Utils.safeFormat(label, this.get('primaryLabelText'), this.get('secondaryLabelText')).htmlSafe();
	}.property('primaryLabelText', 'secondaryLabelText'),

	title: function() {
		if (this.get('secondaryLabelText')) {
			return '%@ (%@)'.fmt(this.get('primaryLabelText'), this.get('secondaryLabelText'));
		} else {
			return this.get('primaryLabelText');
		}
	}.property('primaryLabelText', 'secondaryLabelText')
});

export default LogStatusCellView;
