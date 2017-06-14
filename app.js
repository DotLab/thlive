var path = require('path');
global.appRoot = path.resolve(__dirname);

var marked = require('marked');
var hljs = require('highlight.js');

var express = require('express');

var compression = require('compression');
var morgan = require('morgan');

var favicon = require('serve-favicon');

var fileupload = require('express-fileupload');

var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

var bodyParser = require('body-parser');
var validator = require('express-validator');

var router = require('./routes/router');

marked.setOptions({
	highlight: code => hljs.highlightAuto(code).value,
	langPrefix:'hljs '
});

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/thlive');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
// app.set('view cache', true);

// middlewares ----------------------------------------------------------------------------------------------------
app.use(compression()); // GZIP all assets

app.use(morgan('dev')); // log requests

app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(fileupload());

app.use(session({
	resave: false, // don't save session if unmodified
	saveUninitialized: false, // don't create session until something stored
	secret: '此生无悔入东方，来世愿生幻想乡。',
	store: new MongoStore({ mongooseConnection: db })
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(validator({
	errorFormatter: (param, msg, value) => {
		return { name: param, message: `${msg} '${value}'` }
	}
}));

app.use(function (req, res, next) {
	res.locals.mortal = req.session.user;
	res.locals.body = req.body;

	next();
});

// routes ----------------------------------------------------------------------------------------------------
app.use('/', router);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	var err = new Error('Page Not Found');
	err.status = 404;

	next(err);
});

// error handler
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', { title: err.name, error: err });
});

module.exports = app;