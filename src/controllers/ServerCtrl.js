
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
        domains: []
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

  refer(array, i) {
    var that = this;
    if(array && array.length && i < array.length) {
      return {
        get val() {
          return array[i];
        },

        set val(a) {
          if(a == "") {
            array.splice(i, 1);
            return "";
          } else {
            array[i] = a;
          }
        }
      };
    } else {
      return {
        a: "",

        get val() {
          return "";
        },

        set val(a) {
          if(a != "") {
            array.push(a);
          }
        }
      };
    }
  }
};
