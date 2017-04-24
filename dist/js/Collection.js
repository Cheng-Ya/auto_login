var Collection;

Collection = (function() {
  function Collection() {
    this.status = false;
    this.div = document.createElement('div');
    this.input = document.createElement('input');
    this.button = document.createElement('button');
    $(this.input).hide();
    $(this.input).keydown((function(_this) {
      return function(e) {
        var url;
        if (e.keyCode === 13) {
          e.stopPropagation();
          e.preventDefault();
          url = $(_this.input).val();
          if (url) {
            return _this.request(url);
          }
        }
      };
    })(this));
    $(this.button).text('采集url');
    $(this.button).click((function(_this) {
      return function() {
        return _this.showInput();
      };
    })(this));
    $(this.div).addClass('collection-div');
    $(this.input).attr('placeholder', '输入完整url（以www开头）');
    $(this.input).appendTo($(this.div));
    $(this.button).appendTo($(this.div));
    $(this.div).appendTo($('body'));
  }

  Collection.prototype.toggleInput = function() {
    $(this.input).toggle();
    $(this.input).focus();
    if (this.status) {
      $(this.button).text('采集url');
      return this.status = false;
    } else {
      $(this.button).text('确认');
      return this.status = true;
    }
  };

  Collection.prototype.showInput = function() {
    var url;
    url = $(this.input).val();
    if (url) {
      return this.request(url);
    } else {
      return this.toggleInput();
    }
  };

  Collection.prototype.request = function(url) {
    return $.ajax({
      url: 'http://' + url,
      success: (function(_this) {
        return function(data) {
          var div, title;
          $(_this.input).val('');
          div = document.createElement('div');
          div.innerHTML = data;
          console.log(div);
          title = $(div).find('title').text();
          $('head').find('title').text(title);
          return _this.toggleInput();
        };
      })(this),
      error: (function(_this) {
        return function() {
          return $.ajax({
            url: 'https://' + url,
            success: function(data) {
              var div, title;
              $(_this.input).val('');
              div = document.createElement('div');
              div.innerHTML = data;
              title = $(div).find('title').text();
              $('head').find('title').text(title);
              return _this.toggleInput();
            },
            error: function() {
              $(_this.input).val('');
              $(_this.input).attr('placeholder', '请检查网址格式是否正确！');
              return setTimeout(function() {
                _this.toggleInput();
                return $(_this.input).attr('placeholder', '输入完整url（以www开头）');
              }, 1500);
            }
          });
        };
      })(this)
    });
  };

  return Collection;

})();

module.exports = Collection;
