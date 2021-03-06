require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');
const cors         = require('cors');
const session       = require('express-session');
const passport      = require('passport');

require('./configs/passport');

mongoose
  .connect(process.env.MONGODB_URI, {useNewUrlParser: true})
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// // config for heroku 
// // (see: https://stackoverflow.com/questions/64958647/express-not-sending-cross-domain-cookies)
// app.set("trust proxy", 1);

// Session settings 
// (see: https://hacks.mozilla.org/2020/08/changes-to-samesite-cookie-behavior/)
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'Super Secret (change it)',
    resave: true,
    saveUninitialized: false,
    cookie: {
      sameSite: process.env.NODE_ENV === "production" ? 'none' : 'lax', // must be 'none' to enable cross-site delivery
      secure: process.env.NODE_ENV === "production", // must be true if sameSite='none'
    }
  })
);

app.use(passport.initialize());
app.use(passport.session());


// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

// Cors
app.use(
  cors({
    credentials: true,
    origin: [process.env.CORS_ALLOWED]
  })
);

// default value for title local
app.locals.title = 'Express - Generated with IronGenerator';



// ROUTES MIDDLEWARE STARTS HERE:
app.use('/', require('./routes/index'));
app.use('/api', require('./routes/auth-routes'));
app.use('/api', require('./routes/project-routes'));
app.use('/api', require('./routes/task-routes'));
app.use('/api', require('./routes/file-upload-routes'));

module.exports = app;
