
var swal = require('sweetalert2');

export default class {
  constructor($state, $oauth) {
    'ngInject';
    
    this.$state = $state;
    this.$oauth = $oauth;
  }
  
  async login() {
    try {
      await this.$oauth.$login(this.username, this.password);
    } catch(e) {
      await swal.fire('Error', 'An error occured, please check the login details.', 'error');
    }
    
    this.$state.go('page.home');
  }
};
