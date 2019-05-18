
'use strict';

import "@babel/polyfill";
import "../assets/styles/page.css";

import 'angular';

window.Promise = require('bluebird');

window.Promise.config({
  warnings: true
});

var _endpoint = ENDPOINT;

if(_endpoint.port) {
  _endpoint = window.location.protocol + '//' + window.location.hostname + ':' + _endpoint.port;
}

const angular = require('angular');
const swal = require('sweetalert2');

angular
  .module('flare', [
    require('./router.js').default,
    require('ng-dialog'),
    require('angular1-scaffolder'),
    require('angular1-perfect-oauth2'),
    require('ui-select'),
    require('./upload.js').default,
    require('angular-sanitize'),
    require('angular-loading-bar')
  ])
  .config(function($sceProvider, $compileProvider){
    'ngInject';

    $sceProvider.enabled(false);
    $compileProvider.debugInfoEnabled(false);
  })
  .factory('$oauth', function (oauth2Factory, $rootScope, $state) {
    return oauth2Factory({
      name: 'flare',
      endpoints: {
        main: _endpoint
      },
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      access_token_url: ENDPOINT + '/otoken',

      onToken(oauth2, refresh_token, access_token) {
        $rootScope.$broadcast('token');
      },

      onExchangeCode(oauth2, code, data) {

        return true;
      },

      onError(oauth2, code, error, retry_logic) {
        // code == 1 error renewing access_token
        // code == 2 error exchanging code for token

        console.error('onError 1st time, retrying ', oauth2, code, error);
        return retry_logic()
          .then(function (data) {
            console.log('luckly');

            return data;
          }, function (error) {
            console.error('onError 2nd time: ', error);

            oauth2.$go_authenticate($state.href('exchange', {}, {
              absolute: true
            }));

            //return retry_logic() // try 3rd time

            return Promise.reject(error);
          });
      }
    });
  })
  .factory('$ottp', function (oauth2Factory, $oauth) {
    'ngInject';

    return async function (config) {
      try {
        return await $oauth.$http(config);
      } catch (e) {
        swal.fire('Error', (e.data && e.data.message) || e.message || 'Unknown error occurred.', 'error');
        throw e;
      }
    };
  })
  .filter('add_one', function() {
    return function(data) {
      return (data || []).concat([""]);
    };
  })
  .directive('loader', function () {
    return {
        restrict: 'A',
        scope: {
            loader: '='
        },
        transclude: true,
        template: `
          <div ng-if="!loader" ng-transclude></div>
          <div ng-if="loader" class="loading-container loading yh"></div>`
    };
  })
  .run(function($transitions, $rootScope, $oauth) {
    'ngInject';
    
    Promise.setScheduler(function (cb) {
      $rootScope.$evalAsync(cb);
    });
    
    $transitions.onStart({ }, async function(trans) {
      var data = trans._targetState._definition.data;
      if(!(data && data.free) && !$oauth.access_token) {
        return trans.router.stateService.target('login');
      }
      
      window.scrollTo(0, 0);
    });
  });
