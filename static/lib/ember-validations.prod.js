(function() {
var get = Ember.get, set = Ember.set;

/**
   @class

   This class corresponds to an error due to an invalid state.
   Its basically a key and a message.

   Class methods give the ability to map the key to a message, and override
   default messages easily by using `addMessage`, or by overriding `getMessage`.

 */
Ember.ValidationError = Ember.Object.extend(/** @scope Ember.ValidationError.prototype */{
  /**
      The message key
   */
  key: null,

  /**
     A custom message which has priority over `key`
  */
  customMessage: null,

  /**
     Message format options.

     When getting `message` property, message will be formatted by replacing {option} with
     the associated `messageFormat` property.

     For example:

         error = Ember.ValidationError.create({
           customMessage: 'should have at least #{length} characters',
           messageFormat: { 'length': '8' }
         });
         error.get('message') // 'should have at least 8 characters'

   */
  messageFormat: null,

  /**
     A property that returns the custom message if set, or the message corresponding to the key else.

     @property {String}
   */
  message: Ember.computed(function() {
    var message = get(this, 'customMessage') || Ember.ValidationError.getMessage(get(this, 'key')),
        messageFormat = get(this, 'messageFormat');

    Ember.assert("no message are defined for key: " + get(this, 'key'), message);

    if (messageFormat) {
      for (var key in messageFormat) {
        if (!messageFormat.hasOwnProperty(key)) continue;
        var keyRegex = new RegExp('@{' + key + '}');
        if (message.match(keyRegex)) {
          message = message.replace(keyRegex, messageFormat[key]);
        }
      }
    }

    return message;
  }).property('key', 'customMessage').cacheable()
});

Ember.ValidationError.reopenClass(/** @scope Ember.ValidationError */{

  /**
      The object used to map message keys and values.
   */
  messages: {},

  /**
     Add or override a message defined by the key passed as argument.

     @param {String} key
     @param {String} message
   */
  addMessage: function(key, message) {
    this.messages[key] = message;
  },

  /**
     Add or override each message passed as arguments.

     @param {Object} messages
  */
  addMessages: function(messages) {
    var addMsg = get(this, 'addMessage');
    for (var msgKey in messages) {
      if (!messages.hasOwnProperty(msgKey)) continue;
      this.addMessage(msgKey, messages[msgKey]);
    }
  },

  /**
     Return the message associated to the key passed as argument.

     Override this method for a custom behaviour (i.e. for internationalization).

     @param {String} key
     @returns {String}
      The message associated to the key, or undefined
   */
  getMessage: function(key) {
    return this.messages[key];
  }
});
})();



(function() {
var get = Ember.get, set = Ember.set;

/**
   @class

   This class is responsible to handle a list of errors.
   These errors are defined with a path (for example: `user.address.city`).

 */
Ember.ValidationErrors = Ember.Object.extend(/** @scope Ember.ValidationErrors.prototype */{
  _nestedErrors: null,
  _content: null,

  /** @private */
  init: function() {
    this._super();
    this._resetErrors();
  },

  /**
     The array which contains each error paths and keys.

     A simple example :

         [['name', 'hasWrongLength'], ['address', 'cantBeBlank'], ['address.zipCode', 'isNaN'], ['address.city', 'cantBeBlank']]

     NOTE: If you get this property from a nested error (for example "errors.get('address.allKeys')",
     there could be empty path.

     With the same example, based on "address.allKeys":

         [['', 'cantBeBlank'], ['zipCode', 'isNaN'], ['city', 'cantBeBlank']]

     @property {Ember.Array}
   */
  allKeys: Ember.computed(function() {
    return this._allErrorsData('keys');
  }).property('length').cacheable(),

  /**
     The array which contains each error paths and messages. It works exactly like `allKeys` property.

     A simple example :

         [['name', 'should have between 2 and 10 characters'], ['address', 'can not be blank'], ['address.zipCode', 'should be a number'], ['address.city', 'can not be blank']]

    @property {Ember.Array}
   */
  allMessages: Ember.computed(function() {
    return this._allErrorsData('messages');
  }).property('length').cacheable(),


  /**
      The array which contains formatted messages with path.

      For eaxmple:

          ["can't be blank", "address.city should have at least 3 characters"]

      @property {Ember.Array}
  */
  fullMessages: Ember.computed(function() {
    return get(this, 'allMessages').map(function(m) {
      var msg = m[0];
      if (m[0] !== '') msg += ' ';
      msg += m[1];
      return msg;
    });
  }).property('allMessages').cacheable(),

  /**
     The array which contains each direct error keys.

     It differs from `allKeys` because no path is specified, it just returns error keys for the current path.

     A simple example :

         ['cantBeBlank', 'hasWrongLength', 'isNaN']

    @property
  */
  keys: Ember.computed(function() {
    var content = get(this, '_content'), keys = Ember.A();
    content.forEach(function(error) { keys.push(error.get('key')); });
    return keys;
  }).property('length').cacheable(),

  /**
     The array which contains each direct error messages.

     A simple example :

         ["can not be blank", "should have between 2 and 10 characters"]

    @property
   */
  messages: Ember.computed(function() {
    var content = get(this, '_content'), messages = Ember.A();
    content.forEach(function(error) { messages.push(error.get('message')); });
    return messages;
  }).property('length').cacheable(),

  /**
     The error count, including nested errors.

     @property
   */
  length: Ember.computed(function() {
    var length = 0,
        content = get(this, '_content'),
        errors = get(this, '_nestedErrors');

    length += content.length;
    errors.forEach(function(nestedErrorsPath, nestedErrors) { length += get(nestedErrors, 'length'); });
    return length;
  }).cacheable(),

  /** @private */
  unknownProperty: function(key) {
    var errors = get(this, '_nestedErrors');
    return errors.get(key);
  },

  /**
     Add an error.
     The attributePath could be:

       - A simple path (i.e. 'name')
       - A complete path (i.e. "address.country.code")
       - A falsy value, then the error is directly added to the error.

     @param {String} attributePath
     @param {String} key
     @param {Object} format contains message format values
     @param {Object} used to replace default message
   */
  add: function(attributePath, key, format, customMessage) {
    this.propertyWillChange('length');

    if (!attributePath) {
      var error = Ember.ValidationError.create({
        key: key,
        customMessage: customMessage,
        messageFormat: format
      });
      get(this, '_content').pushObject(error);

    } else {
      var attrPaths = this._pathsForAttribute(attributePath);
      var errors = this._getOrCreateNestedErrors(attrPaths['path']);
      errors.add(attrPaths['nestedPath'], key, format, customMessage);
    }

    this.propertyDidChange('length');
  },


  /**
     Remove an error depending on the `attributePath`.

     If the `attributePath` is empty, it will act as the `clear` method.
     Else, it remove all errors starting with this path.

     @param {String} attributePath
  */
  remove: function(attributePath) {
    this.propertyWillChange('length');
    if (!attributePath) {
      this._resetErrors();
    } else {
      var nestedErrors = get(this, '_nestedErrors'),
          attrPaths = this._pathsForAttribute(attributePath);
      var errors = nestedErrors.get(attrPaths['path']);
      if (errors) {
        errors.remove(attrPaths['nestedPath']);
      }
    }
    this.propertyDidChange('length');
  },

  /**
     Remove all errors (direct and nested).
   */
  clear: function() {
    this.propertyWillChange('length');
    this._resetErrors();
    this.propertyDidChange('length');
  },

  /** @private */
  _getOrCreateNestedErrors: function(path) {
    var nestedErrors = get(this, '_nestedErrors');
    var errors = nestedErrors.get(path);
    if (!errors) {
      errors = Ember.ValidationErrors.create();
      nestedErrors.set(path, errors);
    }
    return errors;
  },

  /** @private */
  _pathsForAttribute: function(attributePath) {
    var splittedPath = Ember.A(attributePath.split('.'));
    return {
      path: splittedPath[0],
      nestedPath: splittedPath.removeAt(0).join('.')
    };
  },

  /** @private */
  _resetErrors: function() {
    set(this, '_content', Ember.A());
    set(this, '_nestedErrors', Ember.Map.create());
  },


  /** @private */
  _allErrorsData: function(dataName) {
    var directData = get(this, dataName),
        data = Ember.A();
    directData.forEach(function(singleData) { data.push(['', singleData]); });

    var nestedErrors = get(this, '_nestedErrors');
    nestedErrors.forEach(function(path, errors) {
      var allErrorsDataPath = 'all' + dataName[0].toUpperCase() + dataName.slice(1);
      var allErrorsData = errors.get(allErrorsDataPath);

      allErrorsData.forEach(function(error) {
        var errorPath = path;
        if (error[0] !== '') errorPath += '.' + error[0];
        data.push([errorPath, error[1]]);
      });
    });

    return data;
  }
});

})();



(function() {
var get = Ember.get, set = Ember.set;

/**
   @class

   This mixin is used to handle validations on ember objects.

   If you are implementing an object and want it to support validations, just include
   this mixin in your object and set the `validations` property.


   Here is an example of an object using validations :

       Ember.Object.create(Ember.Validations, {
         validations: {
           name: {presence: true}
         }
       });

   When calling the `validate` method on the object above, the method `validate` of the
   `Ember.Validators.PresenceValidator` is called, and add error messages if the `name`
   of the object is not present.

   Options can be passed to the validator, as shown in this example :

       Ember.Object.create(Ember.Validations, {
         validations: {
           name: {
             length: {
               moreThan: 3,
               lessThan: 10
             }
           }
         }
       });

   You could also set custom validations and pass options, like in this example :

       Ember.Object.create(Ember.Validations, {
         validations: {
           amount: {
             aCustomValidation: {
               validator: MyApp.CustomValidator,
               options: {
                 isNumber: true,
                 otherOption: 12
               }
             }
           }
         }
       });

   Or even directly set the validation function :

       Ember.Object.create(Ember.Validations, {
         validations: {
           amount: {
             aCustomValidation: {
               validator: function(obj, attr, value) {
                 var moreThan = this.get('options.moreThan');
                 if (value <= moreThan) {
                   obj.get('validationErrors').add(attr, "should not be falsy");
                 }
               },
               options: {
                 moreThan: 5
               }
             }
           }
         }
       });

   @extends Ember.Mixin
 */
Ember.Validations = Ember.Mixin.create(/**@scope Ember.Validations.prototype */{

  /** @private */
  init: function() {
    this._super();
    if (get(this, 'validationErrors') === undefined) {
      set(this, 'validationErrors', Ember.ValidationErrors.create());
    }
  },

  /**
     Method used to verify that the object is valid, according to the `validations`
     hash.

     @returns {Boolean} true if the object if valid
  */
  validate: function() {
    var validations = get(this, 'validations'),
        errors = get(this, 'validationErrors');

    this.propertyWillChange('validationErrors');

    errors.clear && errors.clear();

    for (var attribute in validations) {
      if (!validations.hasOwnProperty(attribute)) continue;
      this._validateProperty(attribute);
    }

    this.propertyDidChange('validationErrors');
    return get(this, 'isValid');
  },

  /**
     Method used to verify that a property is valid, according to the `validations`
     hash.

     @returns {Boolean} true if the property is valid
   */
  validateProperty: function(attribute) {
    this.propertyWillChange('validationErrors');
    var isValid = this._validateProperty(attribute);
    this.propertyDidChange('validationErrors');
    return isValid;
  },

  /** @private */
  _validateProperty: function(attribute) {
    var validations = get(this, 'validations'),
        errors = get(this, 'validationErrors');

    errors.remove(attribute);

    var attributeValidations = validations[attribute];
    for (var validationName in attributeValidations) {
      if (!attributeValidations.hasOwnProperty(validationName)) continue;

      var options = attributeValidations[validationName];
      var validator = Ember.Validators.getValidator(validationName, options);
      validator.validate(this, attribute, this.get(attribute));
    }

    var isValid = !get(this, 'validationErrors.' + attribute + '.length');
    return isValid;
  },

  /**
     Property updated when calling `validate()` or `validateProperty()`.
     True when the object is valid.
   */
  isValid: function() {
    return get(this, 'validationErrors.length') === 0;
  }.property('validationErrors.length')
});
})();



(function() {
/**
   @namespace

   This namespace is used to reference each available class which extends `Ember.Validator`.

   By defining a validator in this namespace allow validations to use it by its name.
   Each validator name should end with 'Validator', and has to be capitalized.

   For example, if you want to use the `App.Validators.PresenceValidator` in validations,
   you could only specify :

       Ember.Object.create(Ember.Validations, {
         validations: {
           presence: true
         }
       });

   The `PresenceValidator` will automatically be found if defined in this namespace.

 */
Ember.Validators = Ember.Namespace.create(/**@scope Ember.Validators */{


  /**
     Return validator depending on name and options passed as arguments.

     @param {String} name
     @param {Object} options
     @returns {Ember.Validator}
  */
  getValidator: function(name, options) {
    var validator = null;
    var validatorOptions = options;

    if (typeof options === 'object') {
      /* Check if a custom validator is specified in options */
      if (options['validator']) {
        if (Ember.Validator.detect(options['validator'])) {
          validator = options.validator.create();
        } else if (typeof options['validator'] === 'function') {
          validator = Ember.Validator.create();
          validator.set('validate', options['validator']);
        }

        if (validator && options['options']) {
            validatorOptions = options['options'];
        }
      }
    }

    if (!validator) {
      /* Check if the validator exist in the namespace */
      var validatorName = name.charAt(0).toUpperCase() + name.substring(1) + 'Validator';
      if (Ember.Validator.detect(this[validatorName])) {
        validator = this[validatorName].create();
      }
    }

    if (!validator) {
      throw new Error("Validator not found for name '" + name + "'.");
    }

    if (Ember.typeOf(validatorOptions) !== 'object') {
      validatorOptions = {value: validatorOptions};
    }
    validator.set('options', validatorOptions);
    return validator;
  }
});
})();



(function() {
/**
   @class

   This class is used by `Ember.Validations` to validate attributes of an object.

   Subclasses should implement the private `_validate` method, and add an error when the object is not valid.
   It could be done with `add` method of `Ember.ValidationErrors` class, as shown in this example:


       App.TruthyValidator = Ember.Validator.extend({
         _validate: function(obj, attr, value) {
           if (!value) {
             obj.get('validationErrors').add(attr, "should be truthy");
           }
         }
       });


 */
Ember.Validator = Ember.Object.extend(/**@scope Ember.Validator.prototype */{

  /** @private */
  init: function() {
    this._super();
    if (!this.hasOwnProperty('options')) {
      this.set('options', {});
    }
    if (this.checkValidity) {
      this.checkValidity();
    }
  },

  /**
    This public method simply calls the `shouldSkipValidations` method and, if it returns true, then calls the private `_validate` function.
     @param {Object} object
      The object which contains the attribute that has to be validated
     @param {String} attribute
      The attribute path on which the validation should be done
     @param {Object} value
      The value of the attribute
  */
  validate: function(obj, attr, value) {
    if (this.shouldSkipValidations(obj, attr, value)) {
      return false;
    } else {
      this._validate(obj, attr, value);
    }
  },


  /**
    Method used to determine whether subclass of `Ember.Validator` should call private method `_validate`. Returns true if the allowBlank option is set to true, so it is not necessary to implement it in sub-classes you would like to implement a different logic for the skipping of the validation.
     @param {Object} object
      The object which contains the attribute that has to be validated
     @param {String} attribute
      The attribute path on which the validation should be done
     @param {Object} value
      The value of the attribute
  */
  shouldSkipValidations: function(obj, attr, value) {
    var options = Ember.get(this, 'options');
    if (options.allowBlank === true) {
      return value ==="" || value === null || value === undefined;
    }
    return false;
  },

  /** @private
     Abstract method used to validate the attribute of an object.

     @param {Object} object
      The object which contains the attribute that has to be validated
     @param {String} attribute
      The attribute path on which the validation should be done
     @param {Object} value
      The value of the attribute
  */
  _validate: function(obj, attr, value) {
    throw new Error("Ember.Validator subclasses should implement _validate() method.");
  },

  /**
     Return the value of the option, or null is the type does not match
     the expected.
     When type is not specified, it always return the value

     @param {Object} object
      The object which contains the attribute that has to be validated
     @param {String} option
      The option you want its value
     @param {String} type
      Optional. When renseigned, return null if the value does not match the type
   */
  optionValue: function(obj, option, type) {
    var val = this.get('options.' + option);
    if (typeof val === 'function') {
      val = val.apply(obj);
    }

    if (!type || (typeof type === 'string' && typeof val === type)) {
      return val;
    } else if (type === undefined) {
      return val;
    }
    return null;
  }
});

})();



(function() {
Ember.ValidationError.addMessage('blank', "can't be blank");

/**
   @class

   This validator validates that the attribute is not blank (`undefined`, `null`, empty string
   or string which contains only spaces).

   It can add the error key 'blank'.

   @extends Ember.Validator
*/
Ember.Validators.PresenceValidator = Ember.Validator.extend({
  /**
    The presence validators `shouldSkipValidations` method should return false regardless of whether the `allowBlank` option is set to `true` since it would be contradictory for a PresenceValidator to allow blank values.
     @param {Object} object
      The object which contains the attribute that has to be validated
     @param {String} attribute
      The attribute path on which the validation should be done
     @param {Object} value
      The value of the attribute
  */
  shouldSkipValidations: function(obj, attr, value) {
    return false;
  },

  _validate: function(obj, attr, value) {
    var invalidValues = Ember.A([undefined, null]);
    if (invalidValues.contains(value) || (value.match && value.match(/^\s*$/))) {
      obj.get('validationErrors').add(attr, "blank");
    }
  }
});

})();



(function() {
var get = Ember.get;

Ember.ValidationError.addMessages({
  'notNumber': "is not a number",
  'notInteger': "is not an integer",
  'notGreaterThan': "is not greater than @{value}",
  'notGreaterThanOrEqualTo': "is not greater than or equal to @{value}",
  'notLessThan': "is not less than @{value}",
  'notLessThanOrEqualTo': "is not less than or equal to @{value}",
  'notEqual': "is not equal to @{value}"
});


/**
   @class

   Validates whether the value is numeric.

   Options:

    - `onlyInteger` - The value has to be an integer
    - `greaterThan` - The value must be greater than the supplied value
    - `greaterThanOrEqualTo` - The value must be greater than or equal to the supplied value
    - `lessThan` - The value must be less than the supplied value
    - `lessThanOrEqualTo` - The value must be less than or equal to the supplied value
    - `equalTo` - The value must be equal to the supplied value

   The simple way to use the `NumericalityValidator` is to set the validation to `true`.
   The validator will add an error if the value can't be parsed as a number:

       validations: {
         amount: {
           numericality: true
         }
       }

   You can also supply custom options, as follow:

       validations: {
         amount: {
           numericality: {
             onlyInteger: true,
             greaterThanOrEqualTo: 1,
             lessThan: 100
           }
         }
       }

   @extends Ember.Validator
 */
Ember.Validators.NumericalityValidator = Ember.Validator.extend(/** @scope Ember.Validators.NumericalityValidator.prototype */{

  /** @private */
  _validate: function(obj, attr, value) {
    var parsedValue = parseFloat(value),
        parsedInt = parseInt(value, 10),
        errors = get(obj, 'validationErrors');

    if (isNaN(value) || isNaN(parsedValue)) {
      errors.add(attr, 'notNumber');
    } else {
      var options = get(this, 'options');
      if (options.onlyInteger === true && (parsedValue !== parsedInt)) {
        errors.add(attr, 'notInteger');
      }

      var optionValue;

      optionValue = this.optionValue(obj, 'greaterThan', 'number');
      if (optionValue !== null && parsedValue <= optionValue) {
        errors.add(attr, 'notGreaterThan', {value: optionValue});
      }

      optionValue = this.optionValue(obj, 'greaterThanOrEqualTo', 'number');
      if (optionValue !== null && parsedValue < optionValue) {
        errors.add(attr, 'notGreaterThanOrEqualTo', {value: optionValue});
      }

      optionValue = this.optionValue(obj, 'lessThan', 'number');
      if (optionValue !== null && parsedValue >= optionValue) {
        errors.add(attr, 'notLessThan', {value: optionValue});
      }

      optionValue = this.optionValue(obj, 'lessThanOrEqualTo', 'number');
      if (optionValue !== null && parsedValue > optionValue) {
        errors.add(attr, 'notLessThanOrEqualTo', {value: optionValue});
      }

      optionValue = this.optionValue(obj, 'equalTo', 'number');
      if (optionValue !== null && parsedValue !== optionValue) {
        errors.add(attr, 'notEqual', {value: optionValue});
      }
    }
  },

  isValidForOption: function(obj, option, condition) {
    var optionValue = this.optionValue(option);
    return optionValue !== null && condition.apply(obj, optionValue);
  }

});

})();



(function() {
var get = Ember.get;

Ember.ValidationError.addMessages({
  'tooShortLength': "is too short (minimum @{value} characters)",
  'tooLongLength': "is too long (maximum @{value} characters)",
  'wrongLength': "is the wrong length (should be @{value} characters)"
});

/**
   @class

   Validates whether the attribute has the supplied length.

   Options:

    - `minimum` - The value must have at least this length
    - `is` - The value must equal this length
    - `maximum` - The value must have at most this length

    When passing a number as option to the validation, it will use it as the `is` option:

        validations: {
          zipCode: {
            length: 5
          }
        }

    Another implementation could be:

        validations: {
          zipCode: {
            length: {
              is: 5
            }
          }
        }

   @extends Ember.Validator
 */
Ember.Validators.LengthValidator = Ember.Validator.extend(/** @scope Ember.Validators.LengthValidator */{

  /** @private */
  _validate: function(obj, attr, value) {
    var options = get(this, 'options'),
        errors = get(obj, 'validationErrors'),
        length = value ? Ember.get(value, 'length') : 0,
        optionValue;

    optionValue = this.optionValue(obj, 'is', 'number');
    if (optionValue === null) {
      optionValue = this.optionValue(obj, 'value', 'number');
    }

    if (optionValue !== null) {
      if (length !== optionValue) {
        errors.add(attr, 'wrongLength', {value: optionValue});
      }
    } else {

      optionValue = this.optionValue(obj, 'minimum', 'number');
      if (optionValue !== null && length < optionValue) {
        errors.add(attr, 'tooShortLength', {value: optionValue});
      }

      optionValue = this.optionValue(obj, 'maximum', 'number');
      if (optionValue !== null && length > optionValue) {
        errors.add(attr, 'tooLongLength', {value: optionValue});
      }
    }
  }

});

})();



(function() {
var get = Ember.get;

Ember.ValidationError.addMessages({
  'invalid': "is invalid"
});


/**
   @class

   Validates whether the attribute has (not) the supplied regexp.

   Options:

    - `with` - The value must match this pattern
    - `without` - The value must not match this pattern

    The simplest way to use the `FormatValidator` is to set the validation to a `String`, or
    a `RegExp`:

        validations: {
          email: {
            format: /.+@.+\..{2,4}/
          }
        }


   @extends Ember.Validator
 */
Ember.Validators.FormatValidator = Ember.Validator.extend({
  _validate: function(obj, attr, value) {
    var options = get(this, 'options'),
        errors = get(obj, 'validationErrors'),
        optionValue;

    if (!value || typeof value.match !== 'function') {
      value = "";
    }

    optionValue = this.optionValue(obj, 'with') || this.optionValue(obj, 'value');
    if ((typeof optionValue === 'string' || optionValue instanceof RegExp) && !value.match(optionValue)) {
      errors.add(attr, 'invalid');
    }

    optionValue = this.optionValue(obj, 'without');
    if ((typeof optionValue === 'string' || optionValue instanceof RegExp) && value.match(optionValue)) {
      errors.add(attr, 'invalid');
    }
  }

});

})();



(function() {
var get = Ember.get;

Ember.ValidationError.addMessages({
  'match': "fields do not match"
});

/**
   @class

   Validates whether the property matches the other specified property.

   Options:

    - `property` - The other property to validate against

    When passing a property as option to the validation, it will use it as the `property` option:

        validations: {
          password: {
            property: 'confirmPassword'
          }
        }

   @extends Ember.Validator
 */
Ember.Validators.MatchValidator = Ember.Validator.extend({
    /** @private */
    _validate: function( obj, attr, value ) {
      var options = get(this, 'options' ) || {};

      if( options.property ) {
        if( obj.get( options.property ) !==  value ) {
          obj.get( 'validationErrors' ).add( attr, 'match' );
        }
      }
    }

});

})();
