import Computed from "balanced-dashboard/utils/computed";
import ModalView from "./modal";

var ActionModalView = ModalView.extend({
	modalElement: Computed.concat('idElement', '#', true),
	templateName: 'modals/action-modal',

	name: 'Override This',
	description: 'Override This',
	submitTitle: 'Confirm',
	submittingTitle: 'Confirming'
});

export default ActionModalView;
