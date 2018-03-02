const qs = require('querystring');
const axios = require('axios');
const JsonDB = require('node-json-db');

const db = new JsonDB('users', true, false);

const postResult = result => console.log(result.data);
const message = require('routes/endpoints/slash/welcomeData');


// find all the users who've been presented the ToS and send them a reminder to accept.
// the same logic can be applied to find users that need to be removed from the team
const remind = () => {
  try {
    const data = db.getData('/');
    Object.keys(data).forEach((team) => {
      Object.keys(data[team]).forEach((user) => {
        if (!data[team][user]) {
          message.channel = user;
          message.text = ':heavy_exclamation_mark: This is a quick reminder.  At CodeBuddies, our goal is to maintain a safe, helpful &amp; friendly community for everyone, regardless of experience, gender identity &amp; expression, sexual identity &amp; orientation, disability, personal appearance, body size, race, ethnicity, age, religion, nationality, profession, or any other defining characteristic. \n\n\nPlease take the time to *read through &amp; acknowledge* the complete <https://github.com/codebuddiesdotorg/codebuddies/blob/master/CODE_OF_CONDUCT.md|Code of Conduct> before continuing in our community.';

          const params = qs.stringify(message);
          const sendMessage = axios.post('https://slack.com/api/chat.postMessage', params);

          sendMessage.then(postResult);
        }
      });
    });
  } catch (error) { console.error(error); }
};

module.exports = { remind };
