import ModalView from "./modal";

var ActionModalView = ModalView.extend({
	modalElement: Balanced.computed.concat('idElement', '#', true),
	templateName: 'modals/action_modal',

	name: 'Override This',
	description: 'Override This',
	submitTitle: 'Confirm',
	submittingTitle: 'Confirming'
});

export default ActionModalView;
