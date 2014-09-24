var initializePopover = function(self, label, selector, messagesProperty) {
	var $element = self.$(selector);
	var position = $element.attr("data-position") || "top";
	return $element.popover({
		trigger: "hover",
		placement: position,
		html: true,
		content: function() {
			var messages = self.get(messagesProperty);
			return "<span class='label'>%@: </span> %@".fmt(
				label,
				messages.join(", ")
			);
		}
	});
};

export default initializePopover;
