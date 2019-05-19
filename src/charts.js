
var chartsLibraryPromise;

async function loadChartsLibrary() {
  return await chartsLibraryPromise || (chartsLibraryPromise = new Promise(function(resolve) {
    var script = document.createElement('script');
    script.onload = function() {
      google.charts.load('current', {
        packages: ['corechart', 'line', 'geochart'],
        mapsApiKey: 'AIzaSyBrkGv8SU8FAnWVwGCfuE0YTS5_00YXuj0'
      });
      google.charts.setOnLoadCallback(() => resolve(google));
    };
    script.src = 'https://www.gstatic.com/charts/loader.js';
    document.head.appendChild(script);
  }));
}

export default angular
  .module('flare.charts', [])
  .directive('charts', function() {
    return {
      restrict: 'A',
      scope: {
        charts: '&'
      },
      async link(scope, element) {
        var google = await loadChartsLibrary();
        console.log(google);
        scope.charts({ element: element[0], google });
      }
    };
  })
  .name;
