var Router;

Router = (function() {
  function Router() {
    this.routes = {};
    this.currentUrl = '';
    this.init();
  }

  Router.prototype.route = function(path, callback) {
    return this.routes[path] = callback || function() {};
  };

  Router.prototype.refresh = function() {
    this.currentUrl = location.origin || '/';
    return this.routes[this.currentUrl]();
  };

  Router.prototype.init = function() {
    return $(document).ready((function(_this) {
      return function() {
        return _this.refresh();
      };
    })(this));
  };

  return Router;

})();

module.exports = Router;
