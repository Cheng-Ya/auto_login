var Email163;

Email163 = (function() {
  function Email163() {
    var key, m, name, rootEl;
    this.data = {
      email163: {
        domain: 'email.163.com',
        "class": 'email-163-btn',
        root: {
          name: '#login-form',
          aInput: 'input[name=email]',
          pInput: 'input[name=password]',
          bSubmit: '#dologin'
        }
      },
      mail163: {
        domain: 'dl.reg.163.com',
        "class": 'mail-163-btn',
        root: {
          name: '#login-form',
          aInput: 'input[name=email]',
          pInput: 'input[name=password]',
          bSubmit: '#dologin'
        }
      },
      mail1631: {
        domain: 'webzj.reg.163.com',
        "class": 'mail-163-btn',
        root: {
          name: '#login-form',
          aInput: 'input[name=email]',
          pInput: 'input[name=password]',
          bSubmit: '#dologin'
        }
      },
      qq: {
        domain: 'xui.ptlogin2.qq.com',
        "class": 'mail-qq-btn',
        root: {
          name: '#login',
          aInput: 'input[name=u]',
          pInput: 'input[name=p]',
          bSubmit: '#login_button'
        }
      }
    };
    this._data = {};
    for (key in this.data) {
      if (this.data[key].domain === $(document)[0].domain) {
        chrome.storage.local.get('autoStatus', (function(_this) {
          return function(data) {
            var autoStatus;
            autoStatus = data['autoStatus'];
            if (autoStatus) {
              return $(_this.button).show();
            }
          };
        })(this));
        this._data = this.data[key];
        this.button = document.createElement('button');
        $(this.button).html('一键登录');
        $(this.button).addClass(this._data["class"]);
        $(this.button).attr('id', this._data["class"]);
        $(this.button).hide();
        $(this.button).click((function(_this) {
          return function(e) {
            e.preventDefault();
            return _this.autoLogin();
          };
        })(this));
        name = this._data.root.name;
        m = name.slice(0, 1);
        console.log('m', m);
        switch (m) {
          case '#':
            rootEl = document.getElementById(name.slice(1));
            rootEl && rootEl.appendChild(this.button);
            break;
          case '.':
            rootEl = document.getElementsByClassName(name.slice(1))[0];
            rootEl && rootEl.appendChild(this.button);
        }
        this.onStorageChange();
      }
    }
  }

  Email163.prototype.autoLogin = function() {
    return chrome.storage.local.get(null, (function(_this) {
      return function(data) {
        var _data, account, accountData, index, password, selectId, selected;
        accountData = data['accountData'];
        selectId = data['selectId'];
        selected = false;
        for (index in accountData) {
          _data = accountData[index];
          if (_data.id === selectId) {
            account = _data.account;
            password = _data.password;
            $(_this._data.root.name).find(_this._data.root.aInput).val(account);
            $(_this._data.root.name).find(_this._data.root.pInput).val(password);
            console.log('11');
            $(_this._data.root.name).find(_this._data.root.bSubmit);
            $(_this._data.root.name).find(_this._data.root.bSubmit)[0].click();
            selected = true;
            break;
          }
        }
        if (!selected) {
          $(_this.button).html('未选择帐号');
          return setTimeout(function() {
            return $(_this.button).html('一键登录');
          }, 1000);
        }
      };
    })(this));
  };

  Email163.prototype.onStorageChange = function() {
    return chrome.storage.onChanged.addListener((function(_this) {
      return function(data) {
        var key, results;
        results = [];
        for (key in data) {
          if (key === 'autoStatus') {
            if (data[key].newValue) {
              results.push($(_this.button).show());
            } else {
              results.push($(_this.button).hide());
            }
          } else {
            results.push(void 0);
          }
        }
        return results;
      };
    })(this));
  };

  return Email163;

})();

module.exports = Email163;
