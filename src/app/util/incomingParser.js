// parsePayload is a utility class that takes in an input and returns a
// sanitized object; helps with parsing out input arguments (parsePayload(arg))
// and returns a standardized object.
// Usage:
// const parsePayload = require('/util/incomingParser').parsePayload;
const axios = require('axios');
const qs = require('querystring');
// TODO: Change to absolute paths due to `require`
const sortArguments = require('./sortArguments');

const parsePayload = async (req) => {
  const textPayload = req.body.text.trim();

  // user_id of the user who typed the slash command
  // If no other info is specified, the Msg should go back to this user
  // on the DM channel_id.
  // TODO:
  const defaultUserId = await findDmChannel(req.body.user_id);
  // const defaultUserId = req.body.user_id;

  // user_id of the @<user_name> typed with the slash command (if any).
  // Extracts all user ids
  let targetUserIdArray = [];
  const userIdRegexp = /@(.*?)\|/g;
  let userMatch;
  userMatch = userIdRegexp.exec(textPayload);
  while (userMatch != null) {
    targetUserIdArray.push(await findDmChannel(userMatch[1]));
    userMatch = userIdRegexp.exec(textPayload);
  }

  // public/private channel_id typed with the slash command (if any).
  // Msgs sent here will be in-channel, and the bot_user needs permissions/join
  // for it.
  // Extracts all channels
  let targetChannelIdArray = [];
  const channelIdRegexp = /#(.*?)\|/g;
  let channelMatch;
  channelMatch = channelIdRegexp.exec(textPayload);
  while (channelMatch != null) {
    targetChannelIdArray.push(channelMatch[1]);
    channelMatch = channelIdRegexp.exec(textPayload);
  }

  // Remove any usernames or channels, and extract keywords from the rest.
  // Check against a list of predefined keywords.
  const remainingText = textPayload.replace(/<.*?>/g, '').replace(/ +/g, ' ').toLowerCase().split(' ');
  let actionKeywords = [];
  let actionArguments = [];
  remainingText.forEach(word => {
    if (['test', 'list', 'post'].includes(word)) {
      actionKeywords.push(word);
    } else {
      actionArguments.push(word);
    }
  });

  if (actionKeywords.length > 1) {
    actionKeywords = [];
  }

  if (actionArguments.length === 1 && actionArguments[0] === '') {
    actionArguments = {};
  } else {
    actionArguments = sortArguments(actionArguments);
  }

  // NOTE: Currently not being used - good to remove? - Angelo 4/18
  //
  // The DM channel id. Default if no target_channel_id is specified.
  // Msgs sent here will come from the bot_user as a DM.
  // const default_channel_id = req.body.channel_id;

  // Return object
  // If both channel(s) and user(s) have been specified,
  // return both arrays as is
  if (targetChannelIdArray.length && targetUserIdArray.length) {
    return {
      target_user_id: targetUserIdArray,
      target_channel_id: targetChannelIdArray,
      action: actionKeywords[0],
      actionArguments: actionArguments,
      payload: textPayload
    };

  // If only user(s) have been specified,
  // set the target channel array to the user ids
  } else if (!targetChannelIdArray.length && targetUserIdArray.length) {
    return {
      target_user_id: targetUserIdArray,
      target_channel_id: targetUserIdArray,
      action: actionKeywords[0],
      actionArguments: actionArguments,
      payload: textPayload
    };

  // If only channel(s) have been specified,
  // no action is necessary on the arrays
  } else if (targetChannelIdArray.length && !targetUserIdArray.length) {
    return {
      target_user_id: targetUserIdArray,
      target_channel_id: targetChannelIdArray,
      action: actionKeywords[0],
      actionArguments: actionArguments,
      payload: textPayload
    };

  // Finally, if no channels or users, add the requested user's id as target
  // channel to receive the message as a DM
  } else {
    targetUserIdArray.push(defaultUserId);

    return {
      target_user_id: targetUserIdArray,
      target_channel_id: targetUserIdArray,
      action: actionKeywords[0],
      actionArguments: actionArguments,
      payload: textPayload
    };
  }
};

const findDmChannel = async (userId) => {
  const dmRequest = { token: process.env.SLACK_TOKEN, user: userId };
  const params = qs.stringify(dmRequest);
  const sendDmRequest = axios.post('https://slack.com/api/im.open', params);
  const reqId = sendDmRequest.then(result => {
    return result.data.channel.id;
  }).catch(error => console.log(error));

  return reqId;
};

module.exports = { parsePayload };
