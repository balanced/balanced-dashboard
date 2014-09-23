import ControlGroupFieldView from "./control-group-field";

var DateSelectView = ControlGroupFieldView.extend({
	tagName: 'div',
	classNames: ['control-group'],
	classNameBindings: ['cssError:error'],
	templateName: 'form-fields/date-select-field',
	type: 'select'
});

export default DateSelectView;
