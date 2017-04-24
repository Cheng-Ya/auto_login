class Account
  constructor:(data)->
    @selectid = chrome.storage.local.get 'selectId',(res)=>
      @selectId = res['selectId'] || null
      @tpl = $('#account-template')[0].cloneNode true
      @data = data
      @id = data.id
      img_one = $(@tpl).find('img[alt="选择"]')
      img_two = $(@tpl).find('img[alt="删除"]')
      p = $(@tpl).find 'p'
      img_one.click =>
        @select()
      if @selectId == @id
        img_one.attr 'src','/static/img/selected.png'
      else
        img_one.attr 'src','/static/img/unselected.png'
      p.text data.account
      p.click =>
        @select()
      img_two.click =>
        @delete()
      $(@tpl).attr 'id',@data.id
      $(@tpl).show()
      $(@tpl).appendTo $('#account-lists')
  select:->
    $('#select-account').text @data.account
    accountLists = $('#account-lists')
    for div in accountLists.find('div')
      do(div) ->
        ($(div).find('img[alt="选择"]')).attr 'src','/static/img/unselected.png'
    ($('#'+@data.id).find('img[alt="选择"]')).attr 'src','/static/img/selected.png'
    chrome.storage.local.set {'selectId':@data.id}
  delete:->
    $('#'+@data.id).remove()
    chrome.storage.local.get 'selectId',(data)=>
      id = data['selectId'] || null
      if id == @data.id
        $('#select-account').text ''
        chrome.storage.local.set {'selectId':null}
      chrome.storage.local.get 'accountData',(data)=>
        accountData = data['accountData'] || null
        delete accountData[@data.account]
        chrome.storage.local.set {'accountData':accountData}

class App
  constructor:->
    chrome.storage.local.get null,(data)=>
      @autoStatus = data['autoStatus']
      @selectId = data['selectId']
      @accountData = data['accountData']
      @changeStatus @autoStatus
      @onAddAccount()
      if @accountData
        for data of @accountData
          new Account @accountData[data]
          if @accountData[data].id == @selectId
            $('#select-account').text @accountData[data].account
  changeStatus:(status)->
    changeInput = $('#change-status')
    if status
      changeInput.prop 'checked',true
      chrome.browserAction.setIcon {
        path:{
          "48":"/static/img/auto48.png",
          "64": "/static/img/auto64.png"
        }
      }
    else
      changeInput.prop 'checked',false
      chrome.browserAction.setIcon {
        path:{
          "48":"/static/img/unauto48.png",
          "64": "/static/img/unauto64.png"
        }
      }
    changeInput.on 'click',->
      status = changeInput.prop 'checked'
      if status
        chrome.browserAction.setIcon {
          path:{
            "48":"/static/img/auto48.png",
            "64": "/static/img/auto64.png"
          }
        }
      else
        chrome.browserAction.setIcon {
          path:{
            "48":"/static/img/unauto48.png",
            "64": "/static/img/unauto64.png"
          }
        }
      chrome.storage.local.set {'autoStatus':status}
  onAddAccount:->
    addBtn = $('#add-account-btn')
    $('#password-input').keydown (e)=>
      if e.keyCode is 13
        e.stopPropagation()
        e.preventDefault()
        @addAccount()
        $('#account-input').focus()
    addBtn.click =>
      @addAccount()
  addAccount:->
    account = $('#account-input').val()
    password = $('#password-input').val()
    $('#account-input').val ''
    $('#password-input').val ''
    if account and password
      id = account + ((new Date()).getTime() - 10000000000)
      chrome.storage.local.get 'accountData',(data)->
        accountData = data['accountData'] || {}
        accountObj = {
          'id':id,
          'account':account,
          'password':password
        }
        accountData[account] = accountObj
        new Account accountData[account]
        chrome.storage.local.set {'accountData':accountData}

$(document).ready ->
  new App()
