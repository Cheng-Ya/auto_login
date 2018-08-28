class Email163
  constructor:->
    @data = {
      email163: {
        domain: 'email.163.com',
        class: 'email-163-btn',
        root: {
          name: '#login-form',
          aInput: 'input[name=email]',
          pInput: 'input[name=password]',
          bSubmit: '#dologin'
        }
      },
      mail163: {
        domain: 'dl.reg.163.com',
        class: 'mail-163-btn',
        root: {
          name: '#login-form',
          aInput: 'input[name=email]',
          pInput: 'input[name=password]',
          bSubmit: '#dologin'
        }
      },
      mail1631: {
        domain: 'webzj.reg.163.com',
        class: 'mail-163-btn',
        root: {
          name: '#login-form',
          aInput: 'input[name=email]',
          pInput: 'input[name=password]',
          bSubmit: '#dologin'
        }
      }
      qq: {
        domain: 'xui.ptlogin2.qq.com',
        class: 'mail-qq-btn',
        root: {
          name: '#login',
          aInput: 'input[name=u]',
          pInput: 'input[name=p]',
          bSubmit: '#login_button'
        }
      }
    }
    @_data = {}
    for key of @data
      if @data[key].domain == $(document)[0].domain
        chrome.storage.local.get 'autoStatus',(data)=>
          autoStatus = data['autoStatus']
          if autoStatus
            $(@button).show()
        @_data = @data[key]
        @button = document.createElement 'button'
        $(@button).html '一键登录'
        $(@button).addClass @_data.class
        $(@button).attr 'id',@_data.class
        $(@button).hide()
        $(@button).click (e)=>
          e.preventDefault()
          @autoLogin()
        name = @_data.root.name
        m = name.slice(0,1)
        console.log 'm', m
        switch m
          when '#'
            rootEl = document.getElementById(name.slice(1))
            rootEl &&  rootEl.appendChild @button
          when '.'
            rootEl = document.getElementsByClassName(name.slice(1))[0]
            rootEl &&  rootEl.appendChild @button
        @onStorageChange()
  autoLogin:->
    chrome.storage.local.get null,(data)=>
      accountData = data['accountData']
      selectId = data['selectId']
      selected = false
      for index of accountData
        _data = accountData[index]
        if _data.id == selectId
          account = _data.account
          password = _data.password
          $(@_data.root.name).find(@_data.root.aInput).val account
          $(@_data.root.name).find(@_data.root.pInput).val password
          console.log '11'
          $(@_data.root.name).find(@_data.root.bSubmit)
          $(@_data.root.name).find(@_data.root.bSubmit)[0].click()
          selected = true
          break
      if not selected
        $(@button).html '未选择帐号'
        setTimeout =>
          $(@button).html '一键登录'
        ,1000
  onStorageChange:->
    chrome.storage.onChanged.addListener (data)=>
      for key of data
        if key == 'autoStatus'
          if data[key].newValue
            $(@button).show()
          else
            $(@button).hide()

module.exports = Email163
