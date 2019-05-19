
var swal = require('sweetalert2');

export default class {
  constructor(ngDialog, $ottp, $stateParams) {
    'ngInject';
    
    this.ngDialog = ngDialog;
    this.$ottp = $ottp;
    this.$stateParams = $stateParams;
    
    this.init();
  }
  
  async init() {
    this.stats = await this.$ottp({
      endpoint: 'main',
      path: `server/${this.$stateParams.server_id}/statistic`
    });
  }

  drawRequestsHr(google, element) {
    var array = [
      ['Time', 'Requests', 'Attacks']
    ].concat(this.stats.by_hourly_all.map(a => [
      a.key, a.requests, a.attacks
    ]));

    var data = google.visualization.arrayToDataTable(array);

    var options = {
      title: 'Requests/hr'
    };

    var chart = new google.visualization.LineChart(element);
    chart.draw(data, options);
  }

  drawCountryPie(google, element) {
    var data = google.visualization.arrayToDataTable([
      ['Country', 'Requests']
    ].concat(
      this.stats.by_countries
        .map(a => [a.key, a.good + a.bad])
    ));

    var options = {
      title: 'Requests/Country'
    };

    var chart = new google.visualization.PieChart(element);

    chart.draw(data, options);
  }

  drawGeoChart(google, element) {
    this._google = google;
    this._element = element;

    var array = [
      ['Country', 'Total Attack']
       // .concat(this.stats.by_really_hourly.map(a => a.key+'.00 - '+(a.key + 1)+'.00'))
    ].concat(
      this.stats.by_country_hourly
        .map(a => [a.key, a.total]
        /*
          .concat(
            this.stats.by_really_hourly
              .map(b => a.data.filter(c => c.key == b.key)[0] && a.data.filter(c => c.key == b.key)[0].count)
          )*/
        )
    );

    console.log(array);

    var data = google.visualization.arrayToDataTable(array);

    var options = {};

    var chart = new google.visualization.GeoChart(element);
    chart.draw(data, options);
  }

  redrawGeoChart(filter) {
    if(filter == -1) {
      return this.drawGeoChart(this._google, this._element);
    }

    var array = [
      ['Country', 'Attacks during ' + filter + '.00 - '+filter+'.00']
    ].concat(
      this.stats.by_country_hourly
        .filter(a => a.data.filter(c => c.key == filter)[0])
        .map(a => [a.key, a.data.filter(c => c.key == filter)[0].count]
        )
    );

    console.log(array);

    var data = this._google.visualization.arrayToDataTable(array);

    var options = {};

    var chart = new this._google.visualization.GeoChart(this._element);
    chart.draw(data, options);
  }
};
