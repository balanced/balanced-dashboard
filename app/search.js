Balanced.Search = (function () {
    var resultsClass = 'with-results';

    function toggleResults() {
        var $q = $('#q');
        var $searchArea = $('#search');
        var fn = $q.val() ? $searchArea.addClass : $searchArea.removeClass;
        fn.call($searchArea, resultsClass);
    }

    function clear() {
        var $q = $('#q');
        var $searchArea = $('#search');
        $searchArea.removeClass(resultsClass);
        $q.val('').focus();
    }

    function toggleDatePickers() {
        $('.timing', '#search').find('.dp').datepicker('show');
    }

    function selectDatePicker(e) {
        $('.date-picker').children().removeClass('selected').find('.dp').datepicker('hide');
        $(this).parent().addClass('selected').find('.dp').focus().datepicker('show');
        $('#search .set-times li').removeClass('selected');
        // have to do this to stop bootstrap dropdown from closing
        return false;
    }

    function resetTimePicker() {

        var $dps = $('#search .dp'),
            $sets = $('#search .set-times li');

        $sets.removeClass('selected');
        $dps.val('');
    }

    function setFixedTiming(e) {
        var $t = $(this);
        resetTimePicker();
        $t.addClass('selected');
        switch ($t.innerText) {
            case 'Past hour':
                break;
            case 'Past 24 hours':
                break;
            case 'Past week':
                break;
            case 'Past month':

                break;
        }
        e.preventDefault();
        return false;
    }

    function selectSearchType(e) {
        var $t = $(this);
        $t.closest('nav').find(' > li').removeClass('selected');
        $t.closest('li').addClass('selected');
        $('#search .items').removeClass('selected');
        $('#search .items.' + $t.data('type')).addClass('selected');
    }

    return {
        init: function () {
            //  need this in case the page content is re-generated
            $(document).on('keyup change click', '#q', toggleResults);
            $(document).on('click', '#search .close', clear);
            $(document).on('click', '#search .timing .dropdown-toggle', toggleDatePickers);
            $(document).on('click change focus', '#search .dt', selectDatePicker);
            $(document).on('click', '#search .set-times li', setFixedTiming);
            var now = new Date();
            $('.after .dp').datepicker({
                maxDate: now
            }).on('changeDate', function () {
                    $('.before .dp').focus();
                });
            $('.before .dp').datepicker({
                maxDate: now
            });
            $(document).on('click', '#search .results > header > nav > li > a', selectSearchType);
        }
    };
})();
