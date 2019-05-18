
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
        path: 'server/' + this.$scope.ngDialogData.id
      });
    } else {
      this.model = {
        
      };
    }
  }
  
  async save() {
    await this.$ottp({
      endpoint: 'main',
      method: this.model.id ? 'PATCH' : 'PUT',
      path: this.model.id ? `server/${this.model.id}` : 'server',
      data: this.model
    });
    
    this.$scope.closeThisDialog(1);
  }
};
