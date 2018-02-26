const qs = require('querystring');
const axios = require('axios');
const JsonDB = require('node-json-db');

const db = new JsonDB('users', true, false);

const postResult = result => console.log(result.data);
const message = require('../slash/welcomeData');

const eventWelcome = (req, res) => {
  switch (req.body.type) {
    case 'url_verification': {
      // verify Events API endpoint by returning challenge if present
      res.send({ challenge: req.body.challenge });
      break;
    }
    case 'event_callback': {
      if (req.body.token === process.env.SLACK_VERIFICATION_TOKEN) {
        const event = req.body.event;

        // `team_join` is fired whenever a new user (incl. a bot) joins the team
        // check if `event.is_restricted == true` to limit to guest accounts
        if (event.type === 'team_join' && !event.is_bot) {
          const { team_id, id } = event.user;
          initialMessage(team_id, id);
        }
        res.sendStatus(200);
      } else { res.sendStatus(500); }
      break;
    }
    default: { res.sendStatus(500); }
  }
};

const initialMessage = (teamId, userId) => {
  let data = false;
  // try fetch team/user pair. This will throw an error if nothing exists in the db
  try { data = db.getData(`/${teamId}/${userId}`); } catch (error) {
    console.error(error);
  }

  // `data` will be false if nothing is found or the user hasn't accepted the ToS
  if (!data) {
    // add or update the team/user record
    db.push(`/${teamId}/${userId}`, false);

    // send the default message as a DM to the user
    message.channel = userId;
    const params = qs.stringify(message);
    const sendMessage = axios.post('https://slack.com/api/chat.postMessage', params);
    sendMessage.then(postResult);
  } else {
    console.log('Already onboarded');
  }
};

// set the team/user record to true to indicate that they've accepted the ToS
// you might want to store the date/time that the terms were accepted

const accept = (userId, teamId) => db.push(`/${teamId}/${userId}`, true);

module.exports = { eventWelcome, initialMessage, accept };
