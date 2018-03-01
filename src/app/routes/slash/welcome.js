const axios = require('axios');
const qs = require('querystring');
const postResult = result => console.log(result.data);
const messages = require('./welcome/message');
const message = messages.message;
const help = messages.help;

const parsePayload = (payload) => {
  const textPayload = payload.trim();
  // case 1: <#channel id|channel name> or <@user id|username>
  const idxUsername = textPayload.lastIndexOf('@');
  const idxChannelName = textPayload.lastIndexOf('#');
  const idxSeparator = textPayload.lastIndexOf('|'); 

  const target_user = idxUsername >= 0 ? textPayload.substring(idxUsername+1, idxSeparator) : undefined;
  const channel_name = idxChannelName >= 0 ? textPayload.substring(idxChannelName, idxSeparator) : undefined;

  let actionRequest = textPayload;
  if (target_user) {
    actionRequest = textPayload.substring(0, idxUsername).trim();
  } else if (channel_name) {
    actionRequest =textPayload.substring(0, idxChannelName).trim();
  }
  return { target_user, channel_name, actionRequest };
}

const welcome = (req, res) => {
  console.log("Received slash command " + req.body.command + " from " + req.body.user_id + " with " + req.body.text);

  const { user_id, text:textPayload } = req.body;
  const { target_user, channel_name, actionRequest } = parsePayload(textPayload);
  const user = target_user ? target_user : user_id;

  console.log(`USER ID :: ${user_id}`);
  console.log(`TARGET USER :: ${target_user}`);
  console.log(`ACTION :: ${actionRequest}`);
  console.log(`MESSAGE BODY :: ${textPayload}`);
  console.log(`USER :: ${user}`);
  console.log(`CHANNEL NAME :: ${channel_name}`);

  if (req.body.token === process.env.SLACK_VERIFICATION_TOKEN) {
     switch (actionRequest) {
       case 'test': {
         welcomeMessage(message, user);
         res.sendStatus(200);
         break;
       }
       /*case 'FOO': {
         fooMessage(team_id, channel, slashWelcome);
         res.sendStatus(200);
         break;
       }
       case 'python': {
         pythonMessage(team_id, channel, slashWelcome);
         res.sendStatus(200);
         break;
       }*/
       case 'post': {
         channelMessage(message, channel_name);
         res.sendStatus(200);
         break;
       }
       default: {
         welcomeMessage(help, user);
         res.sendStatus(200);
         break;
       }
    }
  } else { res.sendStatus(503); }
};

const welcomeMessage = (message, userId) => {
   message.channel = userId;
   const params = qs.stringify(message);
   const sendMessage = axios.post('https://slack.com/api/chat.postMessage', params);
   sendMessage.then(postResult);
 }

 const channelMessage = (message, channel_name = '#start_here') => {
   // send message to public channel
   message.channel = channel_name;
   const params = qs.stringify(message);
   const sendMessage = axios.post('https://slack.com/api/chat.postMessage', params);
   sendMessage.then(postResult);
 };

module.exports = { welcome };
