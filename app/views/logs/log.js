Balanced.LogsLogView = Balanced.View.extend({
    templateName: 'logs/log',

    didInsertElement: function() {
        prettyPrint();
    }
});