import express from 'express';
import bodyParser from 'body-parser';
import logger from 'morgan';
import cors from 'cors';
import fs from 'fs';
// Header security deps
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
// API handlers
import auth from './routes/auth';
import user from './routes/user';
import news from './routes/news';

require('dotenv').config();

const app = express();

app.use(cors());
// set logger see: https://www.npmjs.com/package/morgan for log formatting.
// console log
app.use(logger('dev'));
// file log
app.use(
  logger('common', {
    stream: fs.createWriteStream(process.env.LOGGER_FILE_PATH, { flags: 'w' })
  })
);
// set body parser
app.use(bodyParser.json({ limit: '1mb' }));

// port setup
app.set('port', process.env.PORT || 3000);

// use helmet header protection. see: https://expressjs.com/en/advanced/best-practice-security.html
app.use(helmet());

// setup ratelimit
const apiLimiter = rateLimit({
  windowMs: process.env.RATE_LIMIT_SUSPEND_TIME * 60 * 1000, // 15 minutes after rate limit reach
  max: process.env.RATE_LIMIT_MAX_HIT_PER_IP // max hit per IP
});

// Set General rate limitting rule for all endpoint
app.use('/api/v1/auth', apiLimiter);
// Set API endpoints handlers
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', user);
app.use('/api/v1/news', apiLimiter);
app.use('/api/v1/news', news);


app.listen(app.get('port'), () => {});

module.exports = app;
