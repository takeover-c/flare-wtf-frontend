
var swal = require('sweetalert2');

export default class {
  constructor(ngDialog, $ottp, $stateParams) {
    'ngInject';
    
    this.ngDialog = ngDialog;
    this.$ottp = $ottp;
    
    this.init();
  }
  
  async init() {
    this.servers = await this.$ottp({
      endpoint: 'main',
      path: 'server'
    });
  }
  
  async edit_or_add(id) {
    if((await this.ngDialog.open({
      template: require('../../html/server.html'),
      plain: true,
      disableAnimation: true,
      className: 'ngdialog-theme-plain',
      controllerAs: 'ctrl',
      controller: require('./ServerCtrl.js').default,
      data: { id: id }
    }).closePromise).value == 1)
      await this.init();
  }
  
  async delete(id) {
    var res = await swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });
    
    if(res.value) {
      await this.$ottp({
        endpoint: 'main',
        method: 'DELETE',
        path: 'server/' + id
      });
      
      await this.init();
    }
  }
};