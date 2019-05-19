
export default class {
  constructor($state, $oauth, $ottp) {
    'ngInject';
    
    this.types = {
      8: 'Customer',
      512: 'Admin'
    };

    this.vulnerabilities = {
      1: 'SQL Injection',
      2: 'XSS (Cross-Site Scripting)',
      4: 'LFI (Local File Inclusion)',
      8: 'SSI (Server Side Injection)'
    };
    
    this.$state = $state;
    this.$oauth = $oauth;
    this.$ottp = $ottp;
    
    this.init();
  }
  
  getFlagsAsArray(_flags) {
    var flags = [];
    for(let key in this.vulnerabilities) {
      if((_flags & key) == key) {
        flags.push(this.vulnerabilities[key]);
      }
    }
    return flags;
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

