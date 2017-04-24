var Account, App;

Account = (function() {
  function Account(data) {
    this.selectid = chrome.storage.local.get('selectId', (function(_this) {
      return function(res) {
        var img_one, img_two, p;
        _this.selectId = res['selectId'] || null;
        _this.tpl = $('#account-template')[0].cloneNode(true);
        _this.data = data;
        _this.id = data.id;
        img_one = $(_this.tpl).find('img[alt="选择"]');
        img_two = $(_this.tpl).find('img[alt="删除"]');
        p = $(_this.tpl).find('p');
        img_one.click(function() {
          return _this.select();
        });
        if (_this.selectId === _this.id) {
          img_one.attr('src', '/static/img/selected.png');
        } else {
          img_one.attr('src', '/static/img/unselected.png');
        }
        p.text(data.account);
        p.click(function() {
          return _this.select();
        });
        img_two.click(function() {
          return _this["delete"]();
        });
        $(_this.tpl).attr('id', _this.data.id);
        $(_this.tpl).show();
        return $(_this.tpl).appendTo($('#account-lists'));
      };
    })(this));
  }

  Account.prototype.select = function() {
    var accountLists, div, fn, i, len, ref;
    $('#select-account').text(this.data.account);
    accountLists = $('#account-lists');
    ref = accountLists.find('div');
    fn = function(div) {
      return ($(div).find('img[alt="选择"]')).attr('src', '/static/img/unselected.png');
    };
    for (i = 0, len = ref.length; i < len; i++) {
      div = ref[i];
      fn(div);
    }
    ($('#' + this.data.id).find('img[alt="选择"]')).attr('src', '/static/img/selected.png');
    return chrome.storage.local.set({
      'selectId': this.data.id
    });
  };

  Account.prototype["delete"] = function() {
    $('#' + this.data.id).remove();
    return chrome.storage.local.get('selectId', (function(_this) {
      return function(data) {
        var id;
        id = data['selectId'] || null;
        if (id === _this.data.id) {
          $('#select-account').text('');
          chrome.storage.local.set({
            'selectId': null
          });
        }
        return chrome.storage.local.get('accountData', function(data) {
          var accountData;
          accountData = data['accountData'] || null;
          delete accountData[_this.data.account];
          return chrome.storage.local.set({
            'accountData': accountData
          });
        });
      };
    })(this));
  };

  return Account;

})();

App = (function() {
  function App() {
    chrome.storage.local.get(null, (function(_this) {
      return function(data) {
        var results;
        _this.autoStatus = data['autoStatus'];
        _this.selectId = data['selectId'];
        _this.accountData = data['accountData'];
        _this.changeStatus(_this.autoStatus);
        _this.onAddAccount();
        if (_this.accountData) {
          results = [];
          for (data in _this.accountData) {
            new Account(_this.accountData[data]);
            if (_this.accountData[data].id === _this.selectId) {
              results.push($('#select-account').text(_this.accountData[data].account));
            } else {
              results.push(void 0);
            }
          }
          return results;
        }
      };
    })(this));
  }

  App.prototype.changeStatus = function(status) {
    var changeInput;
    changeInput = $('#change-status');
    if (status) {
      changeInput.prop('checked', true);
      chrome.browserAction.setIcon({
        path: {
          "48": "/static/img/auto48.png",
          "64": "/static/img/auto64.png"
        }
      });
    } else {
      changeInput.prop('checked', false);
      chrome.browserAction.setIcon({
        path: {
          "48": "/static/img/unauto48.png",
          "64": "/static/img/unauto64.png"
        }
      });
    }
    return changeInput.on('click', function() {
      status = changeInput.prop('checked');
      if (status) {
        chrome.browserAction.setIcon({
          path: {
            "48": "/static/img/auto48.png",
            "64": "/static/img/auto64.png"
          }
        });
      } else {
        chrome.browserAction.setIcon({
          path: {
            "48": "/static/img/unauto48.png",
            "64": "/static/img/unauto64.png"
          }
        });
      }
      return chrome.storage.local.set({
        'autoStatus': status
      });
    });
  };

  App.prototype.onAddAccount = function() {
    var addBtn;
    addBtn = $('#add-account-btn');
    $('#password-input').keydown((function(_this) {
      return function(e) {
        if (e.keyCode === 13) {
          e.stopPropagation();
          e.preventDefault();
          _this.addAccount();
          return $('#account-input').focus();
        }
      };
    })(this));
    return addBtn.click((function(_this) {
      return function() {
        return _this.addAccount();
      };
    })(this));
  };

  App.prototype.addAccount = function() {
    var account, id, password;
    account = $('#account-input').val();
    password = $('#password-input').val();
    $('#account-input').val('');
    $('#password-input').val('');
    if (account && password) {
      id = account + ((new Date()).getTime() - 10000000000);
      return chrome.storage.local.get('accountData', function(data) {
        var accountData, accountObj;
        accountData = data['accountData'] || {};
        accountObj = {
          'id': id,
          'account': account,
          'password': password
        };
        accountData[account] = accountObj;
        new Account(accountData[account]);
        return chrome.storage.local.set({
          'accountData': accountData
        });
      });
    }
  };

  return App;

})();

$(document).ready(function() {
  return new App();
});
