const axios = require('axios');
const postResult = result => console.log(result.data);
const qs = require('querystring');


const parsePayload = async (req) => {
  const textPayload = req.body.text.trim();

  //team_id of the Slack team where the app is installed.  Used for Auth.
  const team_id = req.body.team_id;

  //user_id of the @<user_name> typed with the slash command (if any).
  // Extract all user ids
  let target_user_id_array = [];
  const userIdRegexp = /@(.*?)\|/g;
  // if (textPayload.indexOf("@") > -1) {
  //   target_user_id = textPayload.match(/@(.*?)\|/)[1]
  // } else {
  //   target_user_id = ''
  // }
  let userMatch;
  userMatch = userIdRegexp.exec(textPayload);
  while (userMatch != null) {
    console.log(userMatch[1]);
    target_user_id_array.push(userMatch[1]);
    userMatch = userIdRegexp.exec(textPayload);
  }

  if (target_user_id_array.length) {
    target_user_id_array = target_user_id_array.map(await findDmChannel);
  }

  console.log(target_user_id_array);

  //public/private channel_id typed with the slash command (if any).
  //Msgs sent here will be in-channel, and the bot_user needs permissions/join for it.
  // Extract all channels
  // let target_channel_id;
  // if (textPayload.indexOf("#") > -1) {
  //   target_channel_id = textPayload.match(/#(.*?)\|/)[1]
  // } else {
  //   target_channel_id = '';
  // }

  let target_channel_id_array = [];
  const channelIdRegexp = /#(.*?)\|/g;
  let channelMatch;
  channelMatch = channelIdRegexp.exec(textPayload);
  while (channelMatch != null) {
    target_channel_id_array.push(channelMatch[1]);
    channelMatch = channelIdRegexp.exec(textPayload);
  }

  // console.log(target_channel_id);

  //The command word (if any) typed.
  //If there's no legitimate command (or if it's blank), sent Msg should default to "help".
  const action_request = target_user_id_array.length || target_channel_id_array.length ? textPayload.substring(textPayload.indexOf(''),textPayload.indexOf("<")-1) : req.body.text;

  //user_id of the user who typed the slash command
  //If no other info is specified, the Msg should go back to this user on the DM channel_id.
  const default_user_id = await findDmChannel(req.body.user_id);

  //The DM channel id. Default if no target_channel_id is specified.
  //Msgs sent here will come from the bot_user as a DM.
  const default_channel_id = req.body.channel_id;

  if (!target_user_id_array.length) {
    target_user_id_array.push(default_user_id);
  }

  if (!target_channel_id_array.length) {
    target_channel_id_array.push(default_channel_id);
  }

  // const parsedList = { team_id, target_user_id, target_channel_id, action_request, default_user_id, default_channel_id }

  return { target_user_id: target_user_id_array, target_channel_id: target_channel_id_array, action: action_request, payload: textPayload }

    // //If there isIn  a target user and channel, send both.
    // // channel=yes AND DM=yes....so two seperate messages.
    // if (parsedList.target_channel_id && parsedList.target_user_id) {

    //   const target_user_dm_chan = await findDmChannel(target_user_id);
    //   return { target_user_id: target_user_dm_chan, target_channel_id: parsedList.target_channel_id, action: action_request, payload: textPayload }
    // }

    // //If there is a target user only, send target_user_dm_chan and omit the default_channel_id
    // else if (parsedList.target_user_id && !parsedList.target_channel_id) {
    //   const target_user_dm_chan = await findDmChannel(parsedList.target_user_id);
    //   return { target_user_id: target_user_dm_chan, target_channel_id: target_user_dm_chan, action: action_request, payload: textPayload }
    // }

    // //If there is a target channel only, send tartget_channel_id and omit default_user_id
    // else if (parsedList.target_channel_id && !parsedList.target_user_id) {
    //   return { target_user_id: '', target_channel_id: target_channel_id, action: action_request, payload: textPayload }
    // }

    // //send default_channel_id
    // //message will be a DM under Applications as the bot_user
    // else {

    //   return { target_user_id: '', target_channel_id: default_user_id, action: action_request, payload: textPayload }
    // }
};


const findDmChannel = async (userId) => {
  const dmRequest = {token: process.env.SLACK_TOKEN, user: userId };
  const params = qs.stringify(dmRequest);
  const sendDmRequest = axios.post('https://slack.com/api/im.open', params);
  const req_id = sendDmRequest.then(result => {
                  /*console.log(result.data.channel.id);*/
                  return result.data.channel.id;
                })
               .catch(error => console.log(error));

  return req_id;
};

module.exports = { parsePayload };
