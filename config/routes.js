/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

  /***************************************************************************
   *                                                                          *
   * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
   * etc. depending on your default view engine) your home page.              *
   *                                                                          *
   * (Alternatively, remove this and add an `index.html` file in your         *
   * `assets` directory)                                                      *
   *                                                                          *
   ***************************************************************************/
  'post /android/getuser': 'UserController.getAndUser',
  'post /android/getStudent': 'StudentController.andgetstudent',
  'get /android/getimage/:id': 'StudentController.andgetImage',
  'post /android/pushsign': 'SignController.push',
  'post /android/getSign':'SignController.getsign',
  'post /android/updateSign':'SignController.updateSign',

  // '/':'LoginController.go',
  'post /user/del': 'UserController.deluser',
  'post /user/add': 'UserController.adduser',
  'post /student/del': 'StudentController.del',
  'get /student/getimage/:id': 'StudentController.getImage',
  'post /student/add': 'StudentController.addstudent',
  'post /uploadface/:id': 'StudentController.uploadImg',
  'get /student/:id': 'StudentController.getstudent',
  'get /login': {
    view: 'login',
    locals: {
      layout: false,
    }
  },
  'post /login': 'LoginController.login',

  '/': [{
      policy: 'userkey'
    },
    {
      controller: 'SignController',
      action: 'go'
    }
  ],

  'get /user': [{
      policy: 'userkey'
    },
    {
      controller: 'UserController',
      action: 'user'
    }
  ],
  'get /student': [{
      policy: 'userkey'
    },
    {
      controller: 'StudentController',
      action: 'student'
    }
  ],
  'get /resetpass': [{
      policy: 'userkey'
    },
    {
      controller: 'LoginController',
      action: 'resetpass'
    }
  ],

  'post /resetpass': [{
      policy: 'userkey'
    },
    {
      controller: 'LoginController',
      action: 'resetpasspost'
    }
  ],

  'get /logout': 'LogoutController.logout',

  /***************************************************************************
   *                                                                          *
   * Custom routes here...                                                    *
   *                                                                          *
   * If a request to a URL doesn't match any of the custom routes above, it   *
   * is matched against Sails route blueprints. See `config/blueprints.js`    *
   * for configuration options and examples.                                  *
   *                                                                          *
   ***************************************************************************/

};
