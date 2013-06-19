Balanced.AlertView = Balanced.View.extend({
    tagName: 'div',
    classNames: ['row alert-row'],
    classNameBindings: ['controller.message_type::hidden'],
    layoutName: '_alert'
});
