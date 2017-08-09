/* These front-end controllers make the requests necessary to build the pages */

(function() {
  angular.module('directoryApp') // this only retrieves the module, created in app.js

  .controller('MemberListController', [ '$http', '$log', '$location', '$window',
    function($http, $log, $location, $window) {
      var directory = this;
      directory.members = [];
      /* This gets the list of members from the DB for the home view, binds it to
         directory.members. MemberListController is called from the home view.
      */
      $http.get('/members' + '?token=' + $window.sessionStorage.token)
        .then(function(data) {
          directory.members = data;
        })
        .catch(function(err) {
          // Check for a token from MemberController on the back-end
          if(err.status === 401) {
            $location.url('/login'); //redirect to /login view
          } else {
            $log.error('Unknown error from MemberListController');
          }
        });
  }])

  .controller('MemberRecordController', [ '$http', '$scope', '$log', '$location', '$stateParams', '$window',
    function($http, $scope, $log, $location, $stateParams, $window) {
      var record = this;
      record.member = [];
      $scope.id = $stateParams.id;

      // Get a single member, bind it to record,member for detail view
      $http.get('/members/' + $scope.id + '?token=' + $window.sessionStorage.token)
        .then(function(data) {
          record.member = data;
        })
        .catch(function(err) {
          // Check for a token from MemberController on the back-end
          if(err.status === 401) {
            $location.url('/login'); //redirect to /login view
          } else {
            $log.error('Unknown error from MemberRecordController');
          }
        });
    }])

  .controller('PostNewRecordController', [ '$scope', '$http', '$log', '$location', '$timeout', '$window',
    function($scope, $http, $log, $location, $timeout, $window) {
      // Load the page and check for a token from MemberController on the back-end
      $http.get('/add' + '?token=' + $window.sessionStorage.token)
        .catch(function(err) {
          if(err.status === 401) {
            $location.url('/login');        }
          else {
            $log.error('Unknown error from PostNewRecordController - Status: ' + err.status);
          }
        });
      function clearRecord() {
        var blankRecord = {
          firstName: '',
          lastName: '',
          dateOfBirth: '',
          email: '',
          phone: {
            phoneNumber: '',
            textCapable: ''
          },
          address: {
            streetOne: '',
            streetTwo: '',
            city: '',
            state: 'TN',
            zip: ''
            }
          };
          return blankRecord;
      }
      $scope.newRecord = clearRecord();
      $scope.clearform = function() {
        $scope.newRecord = clearRecord();
        $scope.newRecordForm.$setPristine();
      };

      // Got this from: http://jsfiddle.net/mHVWp/
      $scope.pickImage = function() {
        var input = $(document.createElement('input'));
        input.attr("type", "file");
        input.trigger('click');
        return false;
      };

      $scope.successmessage = false;
      $scope.phoneregex = '[\\+]?[(]?[0-9]{3}[)]?[-\\s\\.]?[0-9]{3}[-\\s\\.]?[0-9]{4,6}';
      $scope.zipregex = '\\d{5}([ \\-]\\d{4})?';

      // Add a new member to the DB from add-record view
      $scope.saveNewRecord = function() {
        $http({
          method: 'POST',
          url: 'members' + '?token=' + $window.sessionStorage.token,
          data: $scope.newRecord,
          headers : { 'Content-Type': 'application/json' }
        })
        .then(function(data) {
          $scope.newRecord = clearRecord();
          $scope.newRecordForm.$setPristine();
          $scope.successmessage = true;
          $timeout(function() {
            /* We use 'apply' to add this to the watchlist so the view
            updates when this model updates. This causes the success message to
            appear for 3 seconds after user posts, then disapper. */
            $scope.$apply(function() {
              $scope.successmessage = false;
            });
          }, 3000);
        })
        .catch(function(err) {
          // Might as well check again for a token before submitting the data
          if(err.status === 401) {
            $location.url('/login');
          } else {
            $log.error('Unknown error from PostNewRecordController');
          }
        });
      };
  }])

  // Determines which page we are on so nav pill can be highlighted accordingly
  .controller('NavController', ['$scope', '$state', '$window', '$location',
    function($scope, $state, $window, $location) {
    $scope.stateis = function(currentState) {
     return $state.is(currentState);
    };
    $scope.logOut = function() {
      delete $window.sessionStorage;
      $location.url('/login');
    };
  }])

  .controller('LogInController', ['$scope', '$http', '$window', '$log', '$location',
    function($scope, $http, $window, $log, $location) {
      function clearRecord() {
        var blankRecord = {
          email: '',
          password: ''
          };
          return blankRecord;
      }
      $scope.errorMessage = '';
      delete $window.sessionStorage.token;
      $scope.logInCreds = clearRecord();
      $scope.pwregex = '^.{5,}$'; // Five or more characters

      $scope.logIn = function() {
        $http({
          method: 'POST',
          url: 'auth',
          data: $scope.logInCreds,
          message: 'Success!',
          headers : { 'Content-Type': 'application/json' },
        })
        .then(function(data, status, headers, config) {
          if(data.data.success === true) {
            $window.sessionStorage.token = data.data.token;
            $scope.isAuthenticated = true;
            var encodedProfile = data.data.token.split('.')[1];
            var profile = JSON.parse(url_base64_decode(encodedProfile));
            $location.url('/');
          } else {
            $scope.errorMessage = data.data.message;
          }
        })
        .catch(function(err) {
          //Erase the token on failure to log in
          delete $window.sessionStorage.token;
          $scope.errorMessage = 'An error occured. Please refresh the page';
        });
      };
  }])

  .controller('SignUpController', ['$scope', '$http', '$log', '$location',
    function($scope, $http, $log, $location) {
    function clearRecord() {
      var blankRecord = {
        name: '',
        email: '',
        password: '',
        password2: ''
        };
        return blankRecord;
    }
    $scope.signUpCreds = clearRecord();
    $scope.pwregex = '^.{5,}$'; // Five or more characters
    $scope.signUp = function() {
      $http({
        method: 'POST',
        url: 'users',
        data: $scope.signUpCreds,
        headers : { 'Content-Type': 'application/json' }
      })
      .then(function(data) {
        if(data.data.success === false) {
          $scope.errorMessage = data.data.message;
        } else {
          $location.url('/login');
        }
      })
      .catch(function(err) {
        $log.error('Unknown error from SignUpController');
      });
    };
}])

  .factory('authInterceptor', function($rootScope, $q, $window) {
    return {
      request: function(config) {
        config.headers = config.headers || {};
        if ($window.sessionStorage.token) {
          config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
        }
        return config;
      },
      responseError: function(rejection) {
        if (rejection.status === 401) {
          // handle the case where the user is not authenticated
        }
        return $q.reject(rejection);
      }
    };
  })

  .config(function($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  });

  //this is used to parse the profile
  function url_base64_decode(str) {
    var output = str.replace('-', '+').replace('_', '/');
    switch (output.length % 4) {
      case 0:
        break;
      case 2:
        output += '==';
        break;
      case 3:
        output += '=';
        break;
      default:
        throw 'Illegal base64url string!';
    }
    return window.atob(output); //polifyll https://github.com/davidchambers/Base64.js
  }

})();
