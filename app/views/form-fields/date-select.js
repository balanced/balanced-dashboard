import ControlGroupFieldView from "./control-group-field";

var DateSelectView = Balanced.ControlGroupFieldView.extend({
	tagName: 'div',
	classNames: ['control-group'],
	classNameBindings: ['cssError:error'],
	templateName: '_date_select_field',
	type: 'select'
});

export default DateSelectView;
