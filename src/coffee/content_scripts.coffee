Router = require './Router'
Collection = require './Collection'
Email163 = require './Email163'

router = new Router()
router.route location.origin,->
  new Email163()
router.route 'http://email.163.com',->
  new Email163()
