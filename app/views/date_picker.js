Balanced.DatePickerView = Balanced.View.extend({
	templateName: 'date_picker',

	// temporary properties to use for selecting time periods, controller
	// stores the values used for filtering
	minTime: null,
	maxTime: null,

	didInsertElement: function() {
		var now = new Date();

		this.$('.before .dp').datepicker({
			maxDate: now
		});

		this.$('.after .dp').datepicker({
			maxDate: now
		}).on('changeDate', $.proxy(function() {
			this.$('.before .dp').focus();
		}, this));

		this._super();
	},

	actions: {
		toggleDateTimePicker: function() {
			this.$('.timing').find('.selected .dp').datepicker('show');
		},

		setDateVariable: function() {
			this._changeDateFilter(this._extractVariableTimePeriod(), true);
		},
	},

	selectDateTimePicker: function(datePickerSelector) {
		this.$('.date-picker').children().removeClass('selected').find('.dp').datepicker('hide');
		datePickerSelector.parent().addClass('selected').find('.dp').focus().datepicker('show');
	},

	changeDate: function(e) {
		var date = e.date;
		if ($(e.target).attr('name') === 'before') {
			this._setMaxDate(date);
		} else {
			this._setMinDate(date);
		}
	},

	resetDateTimePicker: function() {
		this.$('.dp').val('');
		this.selectDateTimePicker(this.$('.after input'));
		this.send('toggleDateTimePicker');
		this.setProperties({
			minTime: null,
			maxTime: null
		});
	},

	setDateFixed: function(presetText) {
		this._setMaxDate(null);
		var hours = 0;
		switch (presetText) {
			case 'Past hour':
				hours = -1;
				break;
			case 'Past 24 hours':
				hours = -24;
				break;
			case 'Past week':
				hours = -24 * 7;
				break;
			case 'Past month':
				hours = -24 * 31;
				break;
		}
		var minDate = (hours) ? new Date(new Date().getTime() + (hours * 60 * 60 * 1000)) : null;
		this._setMinDate(minDate);
		this._changeDateFilter(presetText);
	},

	_changeDateFilter: function(label, date_range) {
		/* as this is a date range, we want to include the end date (maxTime here),
		 * for example, 2013/07/01 to 2013/07/31, the 31st should also
		 * be included, so we need to advance the maxTime by one day
		 */
		if (date_range && this.maxTime) {
			/*
			 * Notice: date 32end is okay, js should handle this for us
			 */
			this.maxTime.setDate(this.maxTime.getDate() + 1);
		}
		this.get('controller').send('changeDateFilter', this.minTime, this.maxTime, label);
		this.resetDateTimePicker();
	},

	_setMinDate: function(minDate) {
		this.minTime = minDate;
	},

	_setMaxDate: function(maxDate) {
		this.maxTime = maxDate;
	},

	_extractVariableTimePeriod: function() {
		var min = this.minTime < this.maxTime ? this.minTime : this.maxTime;
		var max = this.minTime < this.maxTime ? this.maxTime : this.minTime;
		var dates = [];
		if (min) {
			dates.push(min);
		}
		if (max) {
			dates.push(max);
		}
		dates = $.map(dates, function(date) {
			return date.strftime('%d %b %Y');
		});

		//  check for uniques, if both the same we'll pop one
		if (dates.length === 2 && dates[0] === dates[1]) {
			dates.pop();
		}
		if (!dates.length) {
			return 'Any time';
		}
		return dates.join(' - ');
	}
});

Balanced.DatePickerPresetView = Balanced.View.extend({
	tagName: 'li',
	classNameBindings: 'isSelected',

	isSelected: function() {
		if (!this.get('elementInDom')) {
			return null;
		}
		return this.get('controller.dateFilterTitle') === this.$().text() ? "selected" : null;
	}.property('controller.dateFilterTitle', 'elementInDom'),

	click: function(e) {
		e.preventDefault();
		var $t = $(e.currentTarget);
		var presetText = $t.text();
		this.get('parentView').setDateFixed(presetText);
	}
});

Balanced.DatePickerDateFieldView = Balanced.View.extend({
	beforeSelector: function() {
		return this.get('controller.baseClassSelector') + ' .timing .before';
	}.property(),

	afterSelector: function() {
		return this.get('controller.baseClassSelector') + ' .timing .after';
	}.property(),

	click: function(e) {
		e.preventDefault();
		this.get('parentView').selectDateTimePicker($(e.currentTarget));
		return false;
	},

	change: function(e) {
		this.get('parentView').selectDateTimePicker($(e.currentTarget));
	},

	focusIn: function(e) {
		this.get('parentView').selectDateTimePicker($(e.currentTarget));
	}
});
