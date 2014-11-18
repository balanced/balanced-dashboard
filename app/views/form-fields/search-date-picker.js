import DatePickerView from './date-picker';

var SearchDatePickerView = DatePickerView.extend({
	_changeDateFilter: function(label) {
		var maxTime = new Date(this.get('maxTime'));
		var minTime = new Date(this.get('minTime'));
		this.get('parentView').send('changeDateFilter', minTime, maxTime, label);
	}
});

export default SearchDatePickerView;
