require('dotenv').config();
require('app-module-path').addPath(`${__dirname}/app`);

const app = require('express')();
const bodyParser = require('body-parser');
const initalEvent = require('routes/endpoints/events/initial');
const slashWelcome = require('routes/endpoints/slash/welcome/welcome');
const slashResources = require('routes/endpoints/slash/resources/resources');
const initalResponse = require('routes/data/interactive/initialResponse');

// parse application/x-www-form-urlencoded && application/json
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  const welcomeMsg =
    `<h2>The Welcome/Code of Conduct app for CodeBuddies is running.</h2>
    <p>Follow the instructions in the README on GitHub to clone/configure this Slack App & your environment variables.</p>`;
  res.send(welcomeMsg);
});

// Endpoint to receive events from Slack's Events API.
// Handles:
//   - url_verification: Returns challenge token sent when present.
//   - event_callback: Confirm verification token & handle `team_join` event.
app.post('/events', (req, res) => { initalEvent.eventWelcome(req, res); });

// Endpoints to receive various slash commands from Slack's API.
// Handles:
//   - A given `slash` command is fired whenever a user evokes the "slash ---"
//     in a channel.
//   - Each function attempts to confirm a verification token & then executes
//     various commmand scenarios.
//   - Command extentions for each slash command can be added via case
//     statements in the various command files.
app.post('/welcome', (req, res) => { slashWelcome.welcome(req, res); });
app.post('/resources', (req, res) => { slashResources.resources(req, res); });

// Endpoint to receive events from interactive welcome message on Slack.
// Checks the verification token before continuing.
app.post('/interactive-message', (req, res) => {
  initalResponse.welcomeResponse(req, res);
});

app.listen(process.env.PORT, () => {
  console.log(`App listening on port ${process.env.PORT}!`);
});

module.exports = app;
