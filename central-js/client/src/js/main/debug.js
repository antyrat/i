define(['angularAMD', 'templates', 'server'], function (angularAMD) {
    var app = angular.module("main", ['ct.ui.router.extras', 
        'templates-main', 'ngMessages', 'ui.bootstrap', 'ui.utils', 'ui.uploader', 'ui.event', 'server', 'ngResource']);

    app.config(['$locationProvider', function ($locationProvider) {
		$locationProvider.html5Mode(true);
    }]);
	
    app.config(['$futureStateProvider', '$controllerProvider', function ($futureStateProvider, $controllerProvider) {
        var ngloadStateFactory = ['$q', 'futureState', function ($q, futureState) {
            var ngloadDeferred = $q.defer();
            require(["ngload!" + futureState.src, 'ngload', 'angularAMD'], function ngloadCallback(result, ngload, angularAMD) {
                angularAMD.processQueue();
                ngloadDeferred.resolve(undefined);
            });
            return ngloadDeferred.promise;
        }];
        // Loading states from .json file during runtime
        var loadAndRegisterFutureStates = ['$http', function ($http) {
            // $http.get().then() returns a promise
            return $http.get('./data.json').then(function (response) {
                angular.forEach(response.data, function (futureState) {
                    // Register each state returned from $http.get() with $futureStateProvider
                    $futureStateProvider.futureState(futureState);
                });
            });
        }];
        $futureStateProvider.stateFactory('ngload', ngloadStateFactory); // register AngularAMD ngload state factory
        $futureStateProvider.addResolve(loadAndRegisterFutureStates);
    }]);
	
    app.config(['$urlRouterProvider', function ($urlRouterProvider) {
		$urlRouterProvider.when('', ['$match', '$state', function ($match, $state) {
			$state.transitionTo('index', $match, false);
		}]);
        $urlRouterProvider.otherwise('/404');
    }]);

    angularAMD.bootstrap(app);
    return app;
});