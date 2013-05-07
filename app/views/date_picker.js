Balanced.DatePickerView = Balanced.View.extend({
  templateName: 'date_picker',

  minTime: null,
  maxTime: null,

  didInsertElement: function() {
    var now = new Date();
    this.$('.before .dp').datepicker({
      maxDate: now
    });
    this.$('.after .dp').datepicker({
      maxDate: now
    }).on('changeDate', $.proxy(function () {
      this.$('.before .dp').focus();
    }, this));
  },

  toggleDateTimePicker: function() {
    this.$('.timing').find('.selected .dp').datepicker('show');
  },

  selectDateTimePicker: function(e) {
    this.$('.date-picker').children().removeClass('selected').find('.dp').datepicker('hide');
    $(e.currentTarget).parent().addClass('selected').find('.dp').focus().datepicker('show');
    this.$('.set-times li').removeClass('selected');
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
    var $dps = this.$('.dp'),
    $sets = this.$('.set-times li');

    $sets.removeClass('selected');
    $dps.val('');
    this.$('.timing > .dropdown-toggle > span').text('Any time');
  },

  setDateFixed: function(presetText) {
    this._setMaxDate(null);
    switch (presetText) {
      case 'Past hour':
        this._setMinDate(new Date().addHours(-1));
        break;
      case 'Past 24 hours':
        this._setMinDate(new Date().addHours(-24));
        break;
      case 'Past week':
        this._setMinDate(new Date().addHours(-24 * 7));
        break;
      case 'Past month':
        this._setMinDate(new Date().addHours(-24 * 31));
        break;
    }
    this._changeDateFilter(presetText);
  },

  setDateVariable: function() {
    this.resetDateTimePicker();
    this._changeDateFilter(this._extractVariableTimePeriod());
  },

  _changeDateFilter: function(label) {
    this._setTimingTitle(label);
    this.get("controller").send("changeDateFilter", this.minTime, this.maxTime);
  },

  _setMinDate: function(minDate) {
    this.minTime = minDate;
  },

  _setMaxDate: function(maxDate) {
    this.maxTime = maxDate;
  },

  _setTimingTitle: function(title) {
    this.$('.dropdown-toggle > span').text(title);
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
    dates = $.map(dates, function (date) {
      return date.strftime('%d %b %Y');
    });

    //  check for uniques, if both the same we'll pop one
    if (dates.length === 2 && dates[0] === dates[1]) {
      dates.pop();
    }
    return dates.join(' - ');
  },
});

Balanced.DatePickerPresetView = Balanced.View.extend({
  tagName: 'li',

  click: function(e) {
    this.get('parentView').resetDateTimePicker();
    var $t = $(e.currentTarget);
    $t.addClass('selected');
    var presetText = $t.text();
    this.get('parentView').setDateFixed(presetText);
  }
});

Balanced.DatePickerDateFieldView = Balanced.View.extend({
  click: function(e) {
    this.get('parentView').selectDateTimePicker(e);
  },

  change: function(e) {
    this.get('parentView').selectDateTimePicker(e);
  },

  focusIn: function(e) {
    this.get('parentView').selectDateTimePicker(e);
  }
});