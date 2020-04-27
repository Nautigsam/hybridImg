import fs from 'fs';
import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import serialize from 'serialize-javascript';
import cors from 'cors';
import passport from 'passport';
import session from 'express-session';
import connectMongo from 'connect-mongo';
const MongoStore = connectMongo(session);

import routes from 'server/routes';
import config from 'server/config';
import 'server/config/init-admin';
import 'server/config/passport';

/**
 * -------------- GENERAL SETUP ----------------
 */
const app = express();
app.enable('trust proxy');
app.use(morgan('common'));
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(
  cors({
    origin: `http://${config.host}:${config.port}`,
    credentials: true,
  })
);

app.locals.serialize = serialize;

try {
  app.locals.gVars = require('../../.reactful.json');
} catch (err) {
  app.locals.gVars = {};
}

/**
 * -------------- SESSION SETUP ----------------
 */
const sessionStore = new MongoStore({
  url: config.dbString,
  collection: 'sessions',
});

app.use(
  session({
    secret: config.secret,
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    mongoOptions: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

/**
 * -------------- PASSPORT AUTHENTICATION ----------------
 */

app.use(passport.initialize());
app.use(passport.session());

/**
 * -------------- ROUTES ----------------
 */
app.use(routes);

/**
 * --------------GLOBAL ERROR HAndler ----------------
 */
function errorHandler(err, req, res) {
  if (!res.status) {
    res = req;
    req = err;
    err = `No response from ${req.url}`;
  }
  if (typeof err === 'string') {
    return res.status(400).json({ message: err });
  }
  return res.status(500).json({ message: err.message });
}
app.use(errorHandler);

/**
 * -------------- SERVER ----------------
 */

app.listen(config.port, config.host, () => {
  fs.writeFileSync(
    path.resolve('.reactful.json'),
    JSON.stringify(
      { ...app.locals.gVars, host: config.host, port: config.port },
      null,
      2
    )
  );

  console.info(`Running on ${config.host}:${config.port}...`);
});
