var express = require('express');
var router = express.Router();

function HandleSqlRequest(sql, req, res, next) {
	console.log('Sql = ' + sql)
	res.locals.connection.query(sql, function (error, results, fields) {
	  	if (error){
	  		res.send(JSON.stringify({"status": 500, "error": error, "response": null})); 
	  		//If there is error, we send the error in the error section with 500 status
	  	} else {
  			res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  			//If there is no error, all is good and response is 200OK.
	  	}
	});
}

/* GET users listing. */
router.get('/', function(req, res, next) {
	var connection = res.locals.connection
	var username = req.query.username ? connection.escape(req.query.username) : ''
	var sql = ''
	
	if (req.query.username) 
	    sql = 'SELECT * FROM User WHERE UserName = ' + username 
	else
	    sql = 'SELECT * FROM User WHERE (1=1) '
	
	var officeid = parseInt(req.query.officeid);
	if (!isNaN(officeid)) {
		sql = sql + ' AND UserOfficeId = ' + req.query.officeid
	}
	
	HandleSqlRequest(sql, req, res, next)
});

/* GET user by id. */
router.get('/:userid', function(req, res, next) {
	var userid = parseInt(req.params.userid);
	
	if (!isNaN(userid))
		HandleSqlRequest('SELECT * FROM User WHERE UserId = ' + req.params.userid, req, res, next)
	else
		res.send(JSON.stringify({"status": 200, "error": "invalid user id", "response": ""}));
});

module.exports = router;
