
export default class {
  constructor($scope, $ottp, uploader) {
    'ngInject';
    
    this.roles = [{ id: 8, name: "Customer" }, { id: 512, name: "Admin" }];
    
    this.$scope = $scope;
    this.$ottp = $ottp;
    this.uploader = uploader;
    
    this.init();
  }
  
  async init() {
    if(this.$scope.ngDialogData.id) {
      this.model = await this.$ottp({
        endpoint: 'main',
        path: 'user/' + this.$scope.ngDialogData.id
      });
      
      this.model.avatar = this.uploader(this.model.avatar);
    } else {
      this.model = {
        avatar: this.uploader()
      };
    }
  }
  
  async save() {
    await this.$ottp({
      endpoint: 'main',
      method: this.model.id ? 'PATCH' : 'PUT',
      path: this.model.id ? `user/${this.model.id}` : 'user',
      data: this.model
    });
    
    this.$scope.closeThisDialog(1);
  }
};
