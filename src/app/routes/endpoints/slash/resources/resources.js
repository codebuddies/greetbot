const axios = require('axios');
const qs = require('querystring');
const postResult = result => console.log(result.data);

const helpData = require('routes/data/slash/resources/resourcesHelp.js').help;
const incomingParser = require('util/incomingParser.js');

const resources = async (req, res) => {
  console.log(`Received slash command ${req.body.command} from ${req.body.user_id} with ${req.body.text}.`);

  const parsedCommand = await incomingParser.parsePayload(req);

  console.log(`parsedCommand is ${parsedCommand}`);

  if (req.body.token === process.env.SLACK_VERIFICATION_TOKEN) {
    switch (parsedCommand.action) {
      case 'list':
        console.log("this is the list action");
        res.sendStatus(200);
        break;
      case 'post':
        const common = parsedCommand.target_channel_id.filter(common_id => parsedCommand.target_user_id.includes(common_id));
        parsedCommand.target_channel_id.forEach(channel_id => {
          if (!common.includes(channel_id)) {
            helpMessage(helpData, channel_id);
          }
        })
        parsedCommand.target_user_id.forEach(user_id => {
          if (!common.includes(user_id)) {
            helpMessage(helpData, user_id);
          }
        })
        common.forEach(common_id => {
          helpMessage(helpData, common_id);
        })
        res.sendStatus(200);
        break;
      default:
        helpMessage(helpData, parsedCommand.target_channel_id[0]);
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
