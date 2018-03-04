const axios = require('axios');
const qs = require('querystring');
const postResult = result => console.log(result.data);

const helpData = require('routes/data/slash/resources/resourcesHelp.js').help;
const incomingParser = require('util/incomingParser.js');

const resources = async (req, res) => {
  console.log(`Received slash command ${req.body.command} from ${req.body.user_id} with ${req.body.text}.`);

  const parsedCommand = await incomingParser.parsePayload(req);

  console.log(parsedCommand);

  if (req.body.token === process.env.SLACK_VERIFICATION_TOKEN) {
    switch (recipients.action) {
      case 'list':
        console.log("this is the list action");
        break;
      default:
        helpMessage(helpData, recipients.target_channel_id);
        res.sendStatus(200);
    }
  } else {
    res.sendStatus(503);
  }
};

const helpMessage = (helpData, target_channel_id) => {
  helpData.channel = target_channel_id;
  const params = qs.stringify(helpData);
  const sendMessage = axios.post('https://slack.com/api/chat.postMessage', params);
  sendMessage.then(postResult);
};

module.exports = { resources };
