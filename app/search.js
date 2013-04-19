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

    return {
        init: function () {
            //  need this in case the page content is re-generated
            $(document).on('keyup change click', '#q', toggleResults);
            $(document).on('click', '#search .close', clear);
        }
    };
})();
