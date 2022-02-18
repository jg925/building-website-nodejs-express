const express = require('express');
const path = require('path');
const cookieSession = require('cookie-session');

const routes = require('./routes');
const FeedbackService = require('./services/FeedbackService');
const SpeakersService = require('./services/SpeakerService');

const feedbackService = new FeedbackService('./data/feedback.json');
const speakersService = new SpeakersService('./data/speakers.json');

const app = express();

const port = 3000;

app.set('trust proxy', 1); // makes express trust cookies that pass through a reverse proxy

app.use(
  cookieSession({
    name: 'session',
    keys: ['Gdhsioean389ewf', 'dhsioane82ls'],
  })
);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));

app.locals.siteName = 'ROUX Meetups';

app.use(express.static(path.join(__dirname, './static')));
app.use(async (req, res, next) => {
  try {
    const names = await speakersService.getNames();
    res.locals.speakerNames = names;

    return next();
  } catch (err) {
    return next(err);
  }
});

app.use(
  '/',
  routes({
    feedbackService,
    speakersService,
  })
);

app.listen(port, () => {
  console.log(`express server listening on port ${port}!`);
});
