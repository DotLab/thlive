var path = require('path');
global.appRoot = path.resolve(__dirname);

var express = require('express');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var validator = require('express-validator');
var fileupload = require('express-fileupload');

var favicon = require('serve-favicon');

var logger = require('morgan');
var hasher = require('pbkdf2-password')();

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
var artists = require('./routes/artists');
var images = require('./routes/images');

var app = express();

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/thlive');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
	resave: false, // don't save session if unmodified
	saveUninitialized: false, // don't create session until something stored
	secret: '此生无悔入东方，来世愿生幻想乡。',
	store: new MongoStore({ mongooseConnection: db })
}));

app.use(validator());
app.use(fileupload());

app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/artists', artists);
app.use('/images', images);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	// res.locals.message = err.message;
	// res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error', { title: 'Error: ' + err.message, error: err });
});

module.exports = app;
