var express = require('express'),
  path = require('path'),
  favicon = require('serve-favicon'),
  logger = require('morgan'),
  cookieParser = require('cookie-parser'),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose'),
  passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  config = require('./config'),
  member = require('./models/member'),
  routes = require('./routes/routes'),
  jwt = require('jsonwebtoken'),
  user = require('./models/user'),
  app = express();

mongoose.connect(config.mongoUrl);
mongoose.Promise = global.Promise;
app.set('secret', config.secret);

app.use(favicon(path.join(__dirname, 'front-end/public/resources', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'front-end/public')));
app.use('/routes', routes);

routes(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
// DEBUG=dirapp:* npm start
