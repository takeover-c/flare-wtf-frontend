
export default class {
  constructor($state, $oauth, $ottp) {
    'ngInject';
    
    this.types = {
      8: 'Customer',
      512: 'Admin'
    }
    
    this.$state = $state;
    this.$oauth = $oauth;
    this.$ottp = $ottp;
    
    this.init();
  }
  
  async init() {
    this.user = await this.$ottp({
      endpoint: 'main',
      path: 'user/me'
    });
  }

  logout() {
    this.$oauth.$logout();
    this.$state.go('login');
  }
};

