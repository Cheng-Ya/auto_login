
class Collection
  constructor:()->
    @status = false
    @div = document.createElement 'div'
    @input = document.createElement 'input'
    @button = document.createElement 'button'
    $(@input).hide()
    $(@input).keydown (e)=>
      if e.keyCode == 13
        e.stopPropagation()
        e.preventDefault()
        url = $(@input).val()
        if url
          @request url
    $(@button).text '采集url'
    $(@button).click =>
      @showInput()
    $(@div).addClass 'collection-div'
    $(@input).attr 'placeholder','输入完整url（以www开头）'
    $(@input).appendTo $(@div)
    $(@button).appendTo $(@div)
    $(@div).appendTo $('body')
  toggleInput:->
    $(@input).toggle()
    $(@input).focus()
    if @status
      $(@button).text '采集url'
      @status = false
    else
      $(@button).text '确认'
      @status = true
  showInput:->
    url = $(@input).val()
    if url
      @request url
    else
      @toggleInput()
  request:(url)->
    $.ajax {
      url:'http://' + url,
      success:(data)=>
        $(@input).val ''
        div = document.createElement 'div'
        div.innerHTML = data
        console.log div
        title = $(div).find('title').text()
        $('head').find('title').text title
        @toggleInput()
      ,
      error: =>
        $.ajax {
          url:'https://' + url,
          success:(data)=>
            $(@input).val ''
            div = document.createElement 'div'
            div.innerHTML = data
            title = $(div).find('title').text()
            $('head').find('title').text title
            @toggleInput()
          ,
          error: =>
            $(@input).val ''
            $(@input).attr 'placeholder','请检查网址格式是否正确！'
            setTimeout =>
              @toggleInput()
              $(@input).attr 'placeholder','输入完整url（以www开头）'
            ,1500
        }
    }

module.exports = Collection
