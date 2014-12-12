import LinkedTextCellView from "./linked-text-cell";
import Utils from "balanced-dashboard/lib/utils";

var LinkedTwoLinesCellView = LinkedTextCellView.extend({
	classNames: ["two-lines"],
	isBlank: Ember.computed.empty('primaryLabelText'),
	labelText: function() {
		var label = '<span class="primary">%@</span><span class="secondary">%@</span>';
		var secondaryLabel = this.get('secondaryLabelText') || '';
		return Utils.safeFormat(label, this.get('primaryLabelText'), secondaryLabel).htmlSafe();
	}.property('primaryLabelText', 'secondaryLabelText')
});

export default LinkedTwoLinesCellView;
