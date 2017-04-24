class Router
  constructor:->
    @routes = {}
    @currentUrl = ''
    @init()
  route: (path,callback)->
    @routes[path] = callback || ->
  refresh: ->
    @currentUrl = location.origin || '/'
    @routes[@currentUrl]()
  init:->
    $(document).ready  =>
      @refresh()

module.exports = Router
