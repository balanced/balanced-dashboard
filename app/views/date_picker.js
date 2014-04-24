var BALANCED_CREATED_AT = moment('2011-04-01');

var DEFAULT_MAX_TIME = moment().add('hours', 2).startOf('hour').toDate();
var DEFAULT_MIN_TIME = moment(DEFAULT_MAX_TIME).subtract('months', 1).toDate();

var DEFAULT_LOCALE = {
	monthNames: moment()._lang._months,
	daysOfWeek: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
	cancelLabel: false,
	applyLabel: 'Update'
};

Balanced.DatePickerView = Balanced.View.extend({
	templateName: 'date_picker',

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
		this.set('minTime', (this.get('controller.minDate') || DEFAULT_MIN_TIME).getTime());

		Ember.run.scheduleOnce('afterRender', this, this.bindDatePicker);

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
		this.$('.datetime-picker').daterangepicker({
			endDate: moment(this.get('maxTime')),
			startDate: moment(this.get('minTime')),
			locale: DEFAULT_LOCALE,
			timePicker: true,
			format: 'MMM D, YYYY',
			minDate: BALANCED_CREATED_AT,
			maxDate: moment().add('days', 2),
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
