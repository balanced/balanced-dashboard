/*
 * Helpers and utils - not static 3rd party libraries
 */

require('app/lib/**/*');

/*
 * Model layer.
 * Ember.Object itself provides most of what
 * model layers elsewhere provide.
 */
require('app/models/core/core');
require('app/models/**/*');

require('app/auth');

/*
 * Views layer.
 * Ember accomplishes a lot in its templates and
 * Views are only necessary if you have view-specific
 * programming to do.
 */
require('app/views/_base');
require('app/views/**/*');

/*
 * Controller layer.
 * Controllers wrap objects and provide a place
 * to implement properties for display
 * whose value is computed from the content of the
 * controllers wrapped objects.
 */
require('app/controllers/_base');
require('app/controllers/mixins/**/*');
require('app/controllers/**/*');

/*
 * Components
 */
require('app/components/**/*');

/*
 * States (i.e. Routes)
 * Handles serialization of the application's current state
 * which results in view hierarchy updates. Responds to
 * actions.
 */
require('app/routes/router');
require('app/routes/auth_route');
require('app/routes/**/*');
