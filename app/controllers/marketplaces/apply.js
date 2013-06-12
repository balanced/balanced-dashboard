Balanced.MarketplacesApplyController = Balanced.ObjectController.extend({

    selectType: function (applicationType) {
        this.set('applicationType', applicationType);
    },

    typeSelected: function () {
        return this.get('applicationType');
    }.property('applicationType'),

    isBusiness: function () {
        return this.get('applicationType') === 'business';
    }.property('applicationType'),

    isGuest: function () {
        return !Balanced.Auth.get('user');
    }.property(),

    submitApplication: function () {
        var model = this.get('content');
        if (model.validate()) {
            this.send('signup', model);
        } else {
//            console.log('failed');
//            console.log(this.get('content.validationErrors'));
        }
    },

    accountTypes: ['CHECKING', 'SAVINGS']
});

Balanced.ControlGroupFieldView = Balanced.View.extend({
    tagName: 'div',
    layoutName: '_control_group_field',

    error: function (field, prefix) {
        var errors = this.get('controller.validationErrors.' + field + '.messages');
        if (errors) {
            var error = errors[0];
            if (error.indexOf(prefix) !== 0) {
                error = prefix + ' ' + error;
            }
            return error;
        }
    },

    cssError: function () {
        var field = this.get('field');
        return this.get('controller.validationErrors.' + field);
    }.property('controller.validationErrors.length'),

    value: function () {
        var field = this.get('field');
        return this.get('controller.content.' + field);
    }.property(),

    valueChange: function () {
        var field = this.get('field'),
            value = this.get('value');
        this.get('controller.content').set(field, value);
    }.observes('value'),

    labelForField: function () {
        var field = this.get('field');
        return this.error(field, field) || this.get('help');
    }.property('controller.validationErrors.length')
});
