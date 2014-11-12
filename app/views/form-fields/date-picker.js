import Ember from "ember";
import Constants from "balanced-dashboard/utils/constants";

var BALANCED_CREATED_AT = Constants.DATES.CREATED_AT;

var DEFAULT_MAX_TIME = Constants.DATES.RESULTS_MAX_TIME;
var DEFAULT_MIN_TIME = BALANCED_CREATED_AT;

var DEFAULT_LOCALE = {
	monthNames: moment.localeData()._months,
	daysOfWeek: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
	cancelLabel: false,
	applyLabel: 'Update'
};

var DatePickerView = Ember.View.extend({
	templateName: 'form-fields/date-picker',

	// temporary properties to use for selecting time periods, controller
	// stores the values used for filtering
	minTime: null,
	maxTime: null,

	format: 'MMM D, YYYY, h:mm a',

	maxDate: function() {
		return moment(this.get('maxTime')).format(this.get('format'));
	}.property('maxTime', 'format'),

	minDate: function() {
		return moment(this.get('minTime')).format(this.get('format'));
	}.property('minTime', 'format'),

	didInsertElement: function() {
		this.set('maxTime', (this.get('controller.maxDate') || DEFAULT_MAX_TIME).getTime());
		this.set('minTime', (this.get('controller.minDate') || moment(BalancedApp.currentMarketplace.get('created_at')).toDate() || DEFAULT_MIN_TIME).getTime());

		Ember.run.scheduleOnce('afterRender', this, this.bindDatePicker);
		this._changeDateFilter('');

		this._super();
	},

	willDestroyElement: function() {
		var dateRangePicker = this.$('.datetime-picker').data('daterangepicker');
		if (!dateRangePicker) {
			return;
		}

		dateRangePicker.remove();

		this._super();
	},

	bindDatePicker: function() {
		if (!this.$('.datetime-picker')) {
			return;
		}

		this.$('.datetime-picker').daterangepicker({
			endDate: moment(this.get('maxTime')),
			startDate: moment(this.get('minTime')),
			locale: DEFAULT_LOCALE,
			timePicker: true,
			format: 'MMM D, YYYY',
			minDate: BALANCED_CREATED_AT,
			maxDate: moment().add(2, 'days'),
			parentEl: '.ember-application'
		}, _.bind(this.chooseDateTime, this)).on('apply.daterangepicker', _.bind(this.applyDateTime, this));
	},

	applyDateTime: function(e, dateRangePicker) {
		this.chooseDateTime(dateRangePicker.startDate.valueOf(), dateRangePicker.endDate.valueOf());
	},

	chooseDateTime: function(start, end) {
		this.setProperties({
			minTime: start.valueOf(),
			maxTime: end.valueOf()
		});

		this._changeDateFilter('');
	},

	_changeDateFilter: function(label) {
		var maxTime = new Date(this.get('maxTime'));
		var minTime = new Date(this.get('minTime'));
		this.get('controller').send('changeDateFilter', minTime, maxTime, label);
	}
});

export default DatePickerView;
