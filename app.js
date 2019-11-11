var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var mysql = require("mysql");

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Database connection
app.use(function(req, res, next) {
	res.locals.connection = mysql.createConnection({
		host     : 'remotemysql.com',
		user     : 'S7KfpQKH7d',
		password : 'jPyMp2osof',
		database : 'S7KfpQKH7d'
	});
	res.locals.connection.connect(function (err) {
	  if (err) {
		console.error('An error occurred while connecting to the DB')
		throw err
	  }
	  console.log('Connected')
	});
	next();
});

app.use('/', indexRouter);
app.use('/api/v2/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
