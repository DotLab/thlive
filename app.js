var debug = require('debug')('thlive:app');

// env ----------------------------------------------------------------------------------------------------
global.isProduction = (process.env.NODE_ENV == 'production');
global.isDevelopment = !isProduction;
debug('isProduction:', isProduction);

var path = require('path');
global.appRoot = path.resolve(__dirname);
debug('appRoot', appRoot);

// mongoose ----------------------------------------------------------------------------------------------------
var mongoose = require('mongoose').set('debug', true);
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/thlive');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// express ----------------------------------------------------------------------------------------------------
var express = require('express');
var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
if (isProduction) {
	app.set('view cache', true);
}

// morgan ----------------------------------------------------------------------------------------------------
var morgan = require('morgan');
app.use(morgan('dev')); // log requests

// static ----------------------------------------------------------------------------------------------------
if (isDevelopment)  // use nginx to serve static files in production
	app.use(express.static(path.join(__dirname, 'public')));

// fileupload ----------------------------------------------------------------------------------------------------
var fileupload = require('express-fileupload');
app.use(fileupload());

// session ----------------------------------------------------------------------------------------------------
var crypto = require('crypto');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
app.use(session({
	resave: false, // don't save session if unmodified
	saveUninitialized: false, // don't create session until something stored
	secret: isDevelopment ? '此生无悔入东方，来世愿生幻想乡。' : (function (len) {
		debug('generating secret of length', len);

		return crypto.randomBytes(Math.ceil(len * 3 / 4))
		.toString('base64')   // convert to base64 format
		.slice(0, len)        // return required number of characters
		.replace(/\+/g, '0')  // replace '+' with '0'
		.replace(/\//g, '0'); // replace '/' with '0'
	})(128),
	store: new MongoStore({ mongooseConnection: db })
}));

// bodyParser ----------------------------------------------------------------------------------------------------
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// validator ----------------------------------------------------------------------------------------------------
var validator = require('express-validator');
app.use(validator({
	errorFormatter: (param, msg, value) => {
		return { name: param, message: `${msg} '${value}'` }
	}
}));

// locals ----------------------------------------------------------------------------------------------------
app.use(function (req, res, next) {
	res.locals.mortal = req.session.user;

	res.locals.body = req.body;
	res.locals.query = req.query;

	next();
});

// routes ----------------------------------------------------------------------------------------------------
var router = require('./routes/router');
app.use('/', router);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	var err = new Error('Page Not Found');
	err.status = 404;

	next(err);
});

// error handler
app.use(function (err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', { title: err.name, error: err });
});

module.exports = app;