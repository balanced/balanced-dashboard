import Ember from "ember";

var ResultsSortableColumnHeaderView = Ember.View.extend({
	tagName: 'div',
	classNameBindings: 'sortClass',

	sortClass: function() {
		var SORTS = {
			asc: 'ascending',
			desc: 'descending'
		};

		var sortField = this.get('controller.sortField');
		var sortOrder = this.get('controller.sortOrder');
		if (sortField !== this.get('field')) {
			return 'unsorted';
		} else {
			return SORTS[sortOrder] || 'unsorted';
		}
	}.property('controller.sortField', 'controller.sortOrder'),

	click: function(e) {
		var sortField = this.get('controller.sortField');
		var sortOrder = this.get('controller.sortOrder');
		var allowSortByNone = this.get('controller.allowSortByNone');
		var nextSortOrder = 'desc';

		if (sortField === this.get('field')) {
			switch (sortOrder) {
				case 'asc':
					nextSortOrder = 'desc';
					break;
				case 'desc':
					nextSortOrder = 'asc';
					if (allowSortByNone) {
						nextSortOrder = 'none';
					}
					break;
			}
		}

		this.get('controller').send('changeSortOrder', this.get('field'), nextSortOrder);
	}
});

export default ResultsSortableColumnHeaderView;
