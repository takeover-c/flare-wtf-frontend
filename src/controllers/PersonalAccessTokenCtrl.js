
const swal = require("sweetalert2");

export default class {
  constructor($scope, $ottp) {
    'ngInject';
    
    this.$scope = $scope;
    this.$ottp = $ottp;
    
    this.init();
  }
  
  async init() {
    if(this.$scope.ngDialogData.id) {
      this.model = await this.$ottp({
        endpoint: 'main',
        path: 'token/' + this.$scope.ngDialogData.id
      });
    } else {
      this.model = {
        
      };
    }
  }
  
  async save() {
    var data = await this.$ottp({
      endpoint: 'main',
      method: this.model.id ? 'PATCH' : 'PUT',
      path: this.model.id ? `token/${this.model.id}` : 'token',
      data: this.model
    });
    
    if(!this.model.id) {
      swal.fire("Success!", `<pre>username = ${data.username}<br />password = ${data.password}</pre>`, 'success');
    }
    
    this.$scope.closeThisDialog(1);
  }
};
