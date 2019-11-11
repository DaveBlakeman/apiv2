var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('Killer Island Home', { title: 'By Izzy and Nat' });
});

module.exports = router;
