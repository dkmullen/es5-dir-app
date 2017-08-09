
// This file sets the various front-end app states for angular

(function() {
  var app = angular.module('directoryApp', ['ui.router']);
  app.config(function($stateProvider, $urlRouterProvider) {

    $stateProvider

    .state('main', {
      // If url is /, load header, home, and footer. Likewise w/other routes
      url: '/',
      views: {
        'header': {
          templateUrl: '/views/header.html',
          controller: 'NavController'
        },
        'content': {
          templateUrl: '/views/home.html'
          //controller: 'MemberListController'
        },
        'footer': {
          templateUrl: '/views/footer.html'
        }
      }
    })

    .state('detail', {
      url: '/member:id',
      views: {
        'header': {
          templateUrl: '/views/header.html',
          controller: 'NavController'
        },
        'content': {
          templateUrl: '/views/detail.html'
          //controller: 'MemberRecordController'
        },
        'footer': {
          templateUrl: '/views/footer.html'
        }
      }
    })

    .state('addnew', {
      url: '/add',
      views: {
        'header': {
          templateUrl: '/views/header.html',
          controller: 'NavController'
        },
        'content': {
          templateUrl: '/views/add-record.html',
          //controller: 'PostNewRecordController'
        },
        'footer': {
          templateUrl: '/views/footer.html'
        }
      }
    })

    .state('about', {
      url: '/about',
      resolve: {
      //  loggedin: checkLoggedin
      },
      views: {
        'header': {
          templateUrl: '/views/header.html',
          controller: 'NavController'
        },
        'content': {
          templateUrl: '/views/about.html',
        },
        'footer': {
          templateUrl: '/views/footer.html'
        },
      }
    })

    .state('login', {
      url: '/login',
      views: {
        'content': {
          templateUrl: '/views/login.html'
        }
      }
    })

    .state('signup', {
      url: '/signup',
      views: {
        'content': {
          templateUrl: '/views/signup.html',
        }
      }
    })

    .state('404', {
      url: '/404',
      views: {
        'content': {
          templateUrl: '/views/404.html',
        }
      }
    });

    // All other routes redirect to main view
    $urlRouterProvider.otherwise('/');
  });
})();
