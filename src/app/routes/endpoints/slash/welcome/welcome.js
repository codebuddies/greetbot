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
        const common = recipients.target_channel_id.filter(common_id => recipients.target_user_id.includes(common_id));
        recipients.target_channel_id.forEach(channel_id => {
          if (!common.includes(channel_id)) {
            welcomeMessage(welcomeData, channel_id);
          }
        });
        recipients.target_user_id.forEach(user_id => {
          if (!common.includes(user_id)) {
            welcomeMessage(welcomeData, user_id);
          }
        });
        common.forEach(common_id => {
          welcomeMessage(welcomeData, common_id);
        });
        res.sendStatus(200);
        break;
      }
      case 'post': {
        const common = recipients.target_channel_id.filter(common_id => recipients.target_user_id.includes(common_id));
        recipients.target_channel_id.forEach(channel_id => {
          if (!common.includes(channel_id)) {
            welcomeMessage(welcomeData, channel_id);
          }
        });
        recipients.target_user_id.forEach(user_id => {
          if (!common.includes(user_id)) {
            welcomeMessage(welcomeData, user_id);
          }
        });
        common.forEach(common_id => {
          welcomeMessage(welcomeData, common_id);
        });
        // if (recipients.target_user_id != recipients.target_channel_id){
        //   welcomeMessage(welcomeData, recipients.target_user_id);
        //   welcomeMessage(welcomeData, recipients.target_channel_id);
        //   res.sendStatus(200);
        //   break;
        // } else {
        //  welcomeMessage(welcomeData, recipients.target_channel_id);
        // }
        res.sendStatus(200);
        break;
      }
      default: {
        const common = recipients.target_channel_id.filter(common_id => recipients.target_user_id.includes(common_id));
        recipients.target_channel_id.forEach(channel_id => {
          if (!common.includes(channel_id)) {
            helpMessage(helpData, channel_id);
          }
        });
        recipients.target_user_id.forEach(user_id => {
          if (!common.includes(user_id)) {
            helpMessage(helpData, user_id);
          }
        });
        common.forEach(common_id => {
          helpMessage(helpData, common_id);
        });
        res.sendStatus(200);
        // if (recipients.target_user_id != recipients.target_channel_id){
        //   helpMessage(helpData, recipients.target_user_id);
        //   helpMessage(helpData, recipients.target_channel_id);
        //   res.sendStatus(200);
        //   break;
        // } else {
        //   helpMessage(helpData, recipients.target_channel_id);
        // }
      }
    }
  } else { res.sendStatus(503); }
};



const welcomeMessage = ( welcomeData, target_channel_id ) => {
   welcomeData.channel = target_channel_id;
   const params = qs.stringify(welcomeData);
   const sendMessage = axios.post('https://slack.com/api/chat.postMessage', params);
   sendMessage.then(postResult);
 }

 const helpMessage = (helpData, target_channel_id) => {
   helpData.channel = target_channel_id;
   const params = qs.stringify(helpData);
   const sendMessage = axios.post('https://slack.com/api/chat.postMessage', params);
   sendMessage.then(postResult);
 };

module.exports = { welcome };
