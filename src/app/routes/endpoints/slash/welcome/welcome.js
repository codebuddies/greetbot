const axios = require('axios');
const qs = require('querystring');
const postResult = result => console.log(result.data);
const welcomeData = require('routes/data/slash/welcome/slashWelcome.js').message;
const helpData = require('routes/data/slash/welcome/welcomeHelp.js').help;
const incomingParser = require('util/incomingParser.js');


const welcome = async (req, res) => {
  console.log("Received slash command " + req.body.command + " from " + req.body.user_id + " with " + req.body.text);

  const recipients = await incomingParser.parsePayload(req);
  console.log(recipients);

  console.log(`USER ID :: ${req.body.user_id}`);
  console.log(`TARGET USER :: ${recipients.target_user_id}`);
  console.log(`ACTION :: ${recipients.action}`);
  console.log(`MESSAGE BODY :: ${recipients.payload}`);
  console.log(`CHANNEL NAME :: ${recipients.target_channel_id}`);

  if (req.body.token === process.env.SLACK_VERIFICATION_TOKEN) {
    switch (recipients.action) {
      case 'test': {
        filterAndPostResults(recipients.target_channel_id, recipients.target_user_id, welcomeMessage, welcomeData);
        res.sendStatus(200);
        break;
      }
      case 'post': {
        filterAndPostResults(recipients.target_channel_id, recipients.target_user_id, welcomeMessage, welcomeData);
        res.sendStatus(200);
        break;
      }
      default: {
        filterAndPostResults(recipients.target_channel_id, recipients.target_user_id, helpMessage, helpData);
        res.sendStatus(200);
      }
    }
  } else { res.sendStatus(503); }
};



const welcomeMessage = (welcomeData, target_channel_id, title, attachments) => {
  if (title) {
    welcomeData.text = title;
  }
  if (attachments) {
    welcomeData.attachments = JSON.stringify(attachments);
  }
  welcomeData.channel = target_channel_id;
  const params = qs.stringify(welcomeData);
  const sendMessage = axios.post('https://slack.com/api/chat.postMessage', params);
  sendMessage.then(postResult);
}

const helpMessage = (helpData, target_channel_id, title, attachments) => {
  if (title) {
    helpData.text = title;
  }
  if (attachments) {
    helpData.attachments = JSON.stringify(attachments);
  }
  helpData.channel = target_channel_id;
  const params = qs.stringify(helpData);
  const sendMessage = axios.post('https://slack.com/api/chat.postMessage', params);
  sendMessage.then(postResult);
};

const filterAndPostResults = (channels, users, callback, data, title = '', attachments = '') => {
  const common = channels.filter(common_id => users.includes(common_id));
  channels.forEach(channel_id => {
    if (!common.includes(channel_id)) {
      callback(data, channel_id, title, attachments);
    }
  });
  users.forEach(user_id => {
    if (!common.includes(user_id)) {
      callback(data, user_id, title, attachments);
    }
  });
  common.forEach(common_id => {
    callback(data, common_id, title, attachments);
  });
}

module.exports = { welcome };
