var Collection, Email163, Router, router;

Router = require('./Router');

Collection = require('./Collection');

Email163 = require('./Email163');

router = new Router();

router.route(location.origin, function() {
  return new Email163();
});

router.route('http://email.163.com', function() {
  return new Email163();
});

router.route('https://email.163.com', function() {
  return new Email163();
});
