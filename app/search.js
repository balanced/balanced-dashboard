Balanced.Search = (function () {
    var resultsClass = 'with-results';
    var minTime = null, maxTime = null;
    var sortOrder = null;
    var sorts = ['unsorted', 'ascending', 'descending'];

    function toggleDateTimePicker() {
        $('.timing', '#search').find('.selected .dp').datepicker('show');
    }

    function selectDateTimePicker(e) {
        $('.date-picker').children().removeClass('selected').find('.dp').datepicker('hide');
        $(this).parent().addClass('selected').find('.dp').focus().datepicker('show');
        $('#search .set-times li').removeClass('selected');
        // have to do this to stop bootstrap dropdown from closing
        return false;
    }

    function resetDateTimePicker() {

        var $dps = $('#search .dp'),
            $sets = $('#search .set-times li');

        $sets.removeClass('selected');
        $dps.val('');
        $('#search .timing > .dropdown-toggle > span').text('Any time');
    }

    function extractFixedTimePeriod($t) {
        $t.addClass('selected');
        maxTime = null;
        switch ($t.innerText) {
            case 'Past hour':
                minTime = new Date().addHours(-1);
                break;
            case 'Past 24 hours':
                minTime = new Date().addHours(-24);
                break;
            case 'Past week':
                minTime = new Date().addHours(-24 * 7);
                break;
            case 'Past month':
                minTime = new Date().addHours(-24 * 31);
                break;
        }
        return $t.find('a').text();
    }

    function extractVariableTimePeriod() {
        var min = minTime < maxTime ? minTime : maxTime;
        var max = minTime < maxTime ? maxTime : minTime;
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
    }

    function onDateTimeChange(e) {
        var $t = $(this);
        var label = 'Any time';
        resetDateTimePicker();
        if ($t.is('button')) {
            label = extractVariableTimePeriod();
        } else {
            label = extractFixedTimePeriod($t);
        }
        setTimingTitle(label);
    }

    function onDateSelected(e) {
        var date = e.date;
        if ($(e.target).attr('name') === 'before') {
            maxTime = date;
        } else {
            minTime = date;
        }
    }

    function setTimingTitle(title) {
        $('.timing > .dropdown-toggle > span', '#search').text(title);
    }

    function initDateTimePicker() {
        $(document).on('click', '#search .timing .dropdown-toggle', toggleDateTimePicker);
        $(document).on('click change focus', '#search .dt', selectDateTimePicker);
        $(document).on('click', '#search .set-times li', onDateTimeChange);
        var now = new Date();
        $('.before .dp').datepicker({
            maxDate: now
        });
        $('.after .dp').datepicker({
            maxDate: now
        }).on('changeDate', function () {
                $('.before .dp').focus();
            });
        $(document).on('click', '#search .timing .go', onDateTimeChange);
        $(document).on('changeDate', onDateSelected);
    }

    return {
        init: function () {
            // events are attached to document rather than specific elements
            // since we can recreate elements at run-time

            //  toggle and reset the search box
            initDateTimePicker();
        }
    };
})();
