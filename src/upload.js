'use strict';

const angular = require('angular'),
      cropper = require('modal-cropper');

require('cropperjs').default = require('cropperjs');

export default angular
    .module('flare.cropper', [
        require('ng-dialog')
    ])
    .factory('uploader', function ($http, $ottp) {
      'ngInject';

      class Uploader {
          constructor(data) {
              this.iptal = null;

              this.id = data && data.id;
              this.access_url = data && data.access_url;
              this.name = data && data.name;
              this.size = data && data.size;

              this.type = this.id ? 3 : 1;
          }

          async upload(name, contentType, blob, second) {
              console.log('upload called ', blob);

              this.cancel();

              this.name = name;

              var previous_type = this.type,
                  previous_id = this.id,
                  previous_access_url = this.access_url,
                  previous_img = this.img,
                  previous_img_url = this.img_url,
                  previous_pr = this.pr;

              this.iptal = Promise.defer();

              try {
                  this.img = blob;
                  this.img_url = URL.createObjectURL(blob);
                  this.type = 2;
                  this.pr = {
                      min: second ? 1 : 0,
                      max: 2
                  };

                  var file = await $ottp({
                      method: 'PUT',
                      endpoint: 'main',
                      path: `file/${name}`,
                      data: blob,
                      timeout: this.iptal.promise,
                      merge: false,
                      headers: {
                          'Content-Type': contentType
                      },
                      uploadEventHandlers: {
                          progress: (event) => {
                              this.pr = {
                                  min: (second ? event.total : 0) + event.loaded,
                                  max: event.total * (second ? 2 : 1)
                              };
                          }
                      }
                  });

                  this.type = 3;
                  this.id = file.id;
                  this.access_url = file.access_url;
              } catch (e) {
                  this.type = previous_type;
                  this.id = previous_id;
                  this.access_url = previous_access_url;
                  this.img = previous_img;
                  this.img_url = previous_img_url;
                  this.pr = previous_pr;

                  throw e;
              }
          }

          remove() {
              this.cancel();
              this.img = null;
              this.img_url = null;
              this.id = null;
              this.access_url = null;
              this.type = 1;
          }

          cancel() {
              if (this.iptal) {
                  this.iptal.resolve();
                  this.iptal = null;
              }
          }

          toJSON() {
              return this.type == 3 ? {
                  id: this.id
              } : null;
          }
      };

      return function (data) {
          return data && (data instanceof Uploader) ? data : new Uploader(data);
      };
    })
    .directive('cropper', function($parse) {
       "use strict";

       return {
           restrict: 'E',
           scope: {
             size: '=',
             data: '=',
             format: '='
           },
           template: `
          <div class="rcrop">
            <input type="file" style="display:none" />
            <div class="area" ng-style="{'paddingBottom': (size.h / size.w * 100) + '%'}">
              <div>
                <a href ng-click="show($event)">
                  <div ng-if="!data.img && !data.id">
                    {{size.w}} x {{size.h}}
                  </div>
                  <div ng-if="data.img || data.id">
                    <img ng-src="{{data.img_url || data.access_url}}" />
                  </div>
                </a>
              </div>
            </div>
            <span ng-if="data.type == 1" class="mt-3 btn btn-sm btn-primary" aria-hidden="true" ng-click="show($event)">Upload Image</span>
            <span ng-if="data.type == 2" class="mt-3 btn btn-sm btn-danger" aria-hidden="true" ng-click="data.cancel()">Cancel</span>
            <span ng-if="data.type == 3" class="mt-3 btn btn-sm btn-danger" aria-hidden="true" ng-click="data.remove()">Remove</span>
           </div>`,
           link(scope, element, attrs) {
             var file_input = element.find('input[type=file]');

             file_input.on('change', function(event) {
                event.preventDefault();
                event.stopImmediatePropagation();
                
                var file = file_input[0].files[0];

                file_input
                  .attr("value", "")
                  .val("");

                scope.image(file);
             });

             scope.show = function($event) {
               $event.preventDefault();

              file_input
                .trigger('click');
             };
           },
           controller($scope) {
             'ngInject';

             $scope.image = async function(blob) {
               var ddd = await cropper(blob, $scope.size.w, $scope.size.h, $scope.format || "png");
               if(ddd) {
                await $scope.data.upload($scope.format == "jpg" ? "image.jpg" : "image.png", $scope.format == "jpg" ? "image/jpeg" : "image/png", ddd);
               }
             };

             $scope.remove = function() {
               $scope.img = null;
               $scope.img_url = null;
               $scope.pr = null;
               $scope.type = 1;
             };

             $scope.type = 1;
           },
           controllerAs: 'ctrl2'
       };
   })
   .directive('fileSelection', function($parse) {
    "use strict";

    return {
        restrict: 'A',
        transclude: true,
        scope: {
          fileSelection: '&'
        },
        template: `
          <input type="file" style="display:none" />
          <ng-transclude></ng-transclude>
        `,
        link(scope, element) {
          var file_input = element.find('input[type=file]');

          file_input.on('change', function(event) {
             event.preventDefault();
             event.stopImmediatePropagation();
             
             var file = file_input[0].files[0];

             file_input
               .attr("value", "")
               .val("");

             scope.fileSelection({$file: file});
          });

          element.on('click', function(event) {
            if(event.originalEvent) {
              event.preventDefault();

              file_input
                .trigger('click');
            }
           });
        }
      };
    })
    .name;
