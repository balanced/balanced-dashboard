import ActionModalView from "./action-modal";

var BaseDeleteModalView = ActionModalView.extend({
	defaultModelAction: 'delete',
	submitTitle: 'Delete',
	submittingTitle: 'Deleting...'
});

export default BaseDeleteModalView;
