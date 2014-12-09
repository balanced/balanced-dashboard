(function () {
	var holidays = {
	'M': [//Month, Day
			'01/01', // New Year's Day
			'07/04', // Independence Day
			'11/11', // Veterans Day
			'12/25' // Christmas Day
		],
		'W': [//Month, Week of Month, Day of Week
			'1/3/1', // Birthday of Martin Luther King, Jr.
			'2/3/1', // Washington's Birthday
			'5/5/1', // Memorial Day
			'9/1/1', // Labor Day
			'10/2/1', // Columbus Day
			'11/4/4' // Thanksgiving Day
		]
	};

	var moment = this.moment;


	//moment = typeof require !== "undefined" && require !== null ? require("moment") : this.moment;
	//console.log(moment);

	moment.fn.addBusinessDays = function (days) {
		var i = 0;
        var weekOfMonth, diff, memorial, holiday;

		while (i < days) {
			this.add(1, 'day');

			weekOfMonth = Math.ceil((this.date() + moment().startOf('month').day()) / 7);
			holiday = 	_.contains(holidays['M'], this.format('MM/DD')) ||
						_.contains(holidays['W'], this.format('M/'+ weekOfMonth +'/d'));

			if (!holiday && this.day() > 0 && this.day() < 6) {
				i++;

			}
		}
		return this;
	};

	moment.fn.subtractBusinessDays = function (days) {
		var i = 0;
        var weekOfMonth, diff, memorial, holiday;

		while (i < days) {
			this.subtract(1, 'day');

			weekOfMonth = Math.ceil((this.date() + moment().startOf('month').day()) / 7);
			holiday = 	_.contains(holidays['M'], this.format('MM/DD')) ||
						_.contains(holidays['W'], this.format('M/'+ weekOfMonth +'/d'));

			if (!holiday && this.day() > 0 && this.day() < 6) {
				i++;

			}
		}
		return this;
	};
}).call(this);
