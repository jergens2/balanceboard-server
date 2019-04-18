var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var authenticationRoutes = require('./routes/authentication');
var userRoutes = require('./routes/userPreferences');
var genericDataRoutes = require('./routes/genericData');
var timeSegmentRoutes = require('./routes/timeSegment');
var userDefinedActivityRoutes = require('./routes/userDefinedActivity');
var dayScheduleTemplateRoutes = require('./routes/dayScheduleTemplate');
var scheduleRotationRoutes = require('./routes/scheduleRotation');
var dayRoutes = require('./routes/day');
var objectiveRoutes = require('./routes/objective');
var notebookRoutes = require('./routes/notebookEntry');

var config = require('./config.json');

var mongoDB = 'mongodb://'+config.database.user+':'+config.database.password+'@'+config.database.host;
mongoose.connect(mongoDB);
// Get Mongoose to use the global promise library
mongoose.Promise = global.Promise;
//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
  res.sendFile(path.resolve(public + '/index.html'))
})

// app.get('*', function(req, res){
//   res.send('what???', 404);
// });

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, observe');
  res.setHeader('Access-Control-Allow-Methods', "POST, GET, PATCH, DELETE, OPTIONS");
  next();
});

app.use('/api/authentication', authenticationRoutes);
app.use('/api/user', userRoutes );
app.use('/api/genericData', genericDataRoutes);
app.use('/api/timeSegment', timeSegmentRoutes);
app.use('/api/activity', userDefinedActivityRoutes);
app.use('/api/dayScheduleTemplate', dayScheduleTemplateRoutes);
app.use('/api/scheduleRotation', scheduleRotationRoutes);
app.use('/api/day', dayRoutes);
app.use('/api/objective', objectiveRoutes);
app.use('/api/notebook', notebookRoutes);


app.use('/', function(req, res) {
  res.sendFile(path.resolve('public/index.html'))
})

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
