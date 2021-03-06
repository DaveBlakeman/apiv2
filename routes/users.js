var express = require('express');
var router = express.Router();

function HandleSqlRequest(sql, req, res, next) {
	console.log('Sql = ' + sql)
	try {
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
	catch (err) {
		res.send(JSON.stringify({"status": 500, "error": err, "response": null}));
	}
		
}

function HandleSqlUpdate(sql, args, req, res) {
	console.log('Sql = ' + sql)
	res.locals.connection.query(sql, args, function (error, result) {
	  	if (error){
	  		res.send(JSON.stringify({"status": 500, "error": error, "response": null})); 
	  		//If there is error, we send the error in the error section with 500 status
	  	} else {
  			res.send(JSON.stringify({"status": 200, "error": null, "response": result}));
  			//If there is no error, all is good and response is 200OK.
	  	}
	});
}

/* GET all users. */
router.get('/', function(req, res, next) {
	var connection = res.locals.connection
	var username = req.query.username ? connection.escape(req.query.username) : ''
	var sql = ''
	
	if (req.query.username) 
	    sql = 'SELECT * FROM User WHERE UserName = ' + username 
	else
	    sql = 'SELECT * FROM User WHERE (1=1) '
		
	HandleSqlRequest(sql, req, res, next)
});

/* GET user by id. */
router.get('/:userid', function(req, res, next) {
	var userid = parseInt(req.params.userid);
	
	if (!isNaN(userid))
		HandleSqlRequest('SELECT * FROM User WHERE UserId = ' + req.params.userid, req, res, next)
	else
		res.send(JSON.stringify({"status": 404, "error": "invalid user id", "response": ""}));
});


// Add a new user by POSTing to /users
router.post('/', function (req, res) { 
  var userName = req.body.UserName;
  var userScore = req.body.UserScore;
  var userCostume = req.body.UserCostume;
  HandleSqlUpdate('INSERT INTO User (UserName, UserScore, UserCostume) VALUES (?, ?, ?)', [userName, userScore, userCostume], req, res)
})

// Update a user by POSTing to that Specific userId
router.post('/:userid', function (req, res) {
	var userId = parseInt(req.params.userid);
	
	if (!isNaN(userId)) {
		var userName = req.body.UserName;
		var userScore = req.body.UserScore;
		var userCostume = req.body.UserCostume;
		HandleSqlUpdate('UPDATE User SET UserName = ?, UserScore = ?, UserCostume = ? WHERE UserId = ?', [userName, userScore, userCostume, userId], req, res)
	}
	else
		res.send(JSON.stringify({"status": 404, "error": "invalid user id", "response": ""}));
})

// Delete a user by DELETEing that Specific userId
router.delete('/:userid', function (req, res) {
	var userId = parseInt(req.params.userid);
	
	if (!isNaN(userId)) {
		HandleSqlUpdate('DELETE FROM User WHERE UserId = ?', [userId], req, res)
	}
	else
		res.send(JSON.stringify({"status": 404, "error": "invalid user id", "response": ""}));
})

module.exports = router;
