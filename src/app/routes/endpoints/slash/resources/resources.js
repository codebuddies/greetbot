const axios = require('axios');
const qs = require('querystring');
const postResult = result => console.log(result.data);

const resourcesData = require('util/ymlLoader.js').resourcesData;

const helpData = require('routes/data/slash/resources/resourcesHelp.js').help;
const resourcesTemplateMessage = require('routes/data/slash/resources/resourcesMessage.js').message;
const incomingParser = require('util/incomingParser.js');

const resources = async (req, res) => {
  console.log(`Received slash command ${req.body.command} from ${req.body.user_id} with ${req.body.text}.`);

  const parsedCommand = await incomingParser.parsePayload(req);

  console.log(`parsedCommand is ${parsedCommand}`);

  if (req.body.token === process.env.SLACK_VERIFICATION_TOKEN) {
    switch (parsedCommand.action) {
      case 'list': {
        if (!parsedCommand.action_arguments.length) {
          let title = "*Here is the full list of resources:*";
          let attachments = generateResourcesMessage(resourcesData.resources);
        } else {
          const filteredResources = resourcesData.resources.filter(resource => {
            return parsedCommand.action_arguments.includes(resource.language.toLowerCase()) ||
                    parsedCommand.action_arguments.includes(resource.level.toLowerCase());
          });
          let title = `*Here are the topics for ${parsedCommand.action_arguments.join(" ")}*`;
          let attachments = generateResourcesMessage(filteredResources);
        }
        filterAndPostResults(parsedCommand.target_channel_id, parsedCommand.target_user_id, resourceMessage, resourcesTemplateMessage, title, attachments);
        res.sendStatus(200);
        break;
      }
      case 'post': {
        filterAndPostResults(parsedCommand.target_channel_id, parsedCommand.target_user_id, helpMessage, helpData);
        // const common = parsedCommand.target_channel_id.filter(common_id => parsedCommand.target_user_id.includes(common_id));
        // parsedCommand.target_channel_id.forEach(channel_id => {
        //   if (!common.includes(channel_id)) {
        //     helpMessage(helpData, channel_id);
        //   }
        // })
        // parsedCommand.target_user_id.forEach(user_id => {
        //   if (!common.includes(user_id)) {
        //     helpMessage(helpData, user_id);
        //   }
        // })
        // common.forEach(common_id => {
        //   helpMessage(helpData, common_id);
        // })
        res.sendStatus(200);
        break;
      }
      default: {
        filterAndPostResults(parsedCommand.target_channel_id, parsedCommand.target_user_id, helpMessage, helpData);
        // helpMessage(helpData, parsedCommand.target_channel_id[0]);
        res.sendStatus(200);
      }
    }
  } else {
    res.sendStatus(503);
  }
};

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

const generateResourcesMessage = (resources) => {
  let attachments = [];
  resources.forEach(resource => {
    const pretext = "resource['language-icon']  resource['language-desc']";
    const title = "\nresource['level'] resource['language']\n\n";
    const text = "resource['video-link']  resource['video-desc']\n\nresource['tutorial-link']  resource['tutorial-desc']\n\nresource['book-link']  resource['book-desc']\n\nresource['class-link']  resource['class-desc']\n\nresource['help_link']\n\nresource['more-questions']\n\n\nresource['maintainer']";
    const color = "${sidebar-color}";
    attachments.push({pretext, title, text, color});
  });
  return attachments;
};

const resourceMessage = (resourcesTemplateMessage, target_channel_id, title, attachments) => {
  if (title) {
    resourcesTemplateMessage.text = title;
  }
  if (attachments) {
    resourcesTemplateMessage.attachments = JSON.stringify(attachments);
  }
  resourcesTemplateMessage.channel = target_channel_id;
  const params = qs.stringify(resourcesTemplateMessage);
  const sendMessage = axios.post('https://slack.com/api/chat.postMessage', params);
  sendMessage.then(postResult);
}

const filterAndPostResults = (channels, users, callback, data, title = '', attachments = '') => {
  const common = channels.filter(common_id => users.includes(common_id));
  channels.forEach(channel_id => {
    if (!common.includes(channel_id)) {
      callback(data, channel_id, title, attachments);
    }
  });
  parsedCommand.target_user_id.forEach(user_id => {
    if (!common.includes(user_id)) {
      callback(data, user_id, title, attachments);
    }
  });
  common.forEach(common_id => {
    callback(data, common_id, title, attachments);
  });
}

module.exports = { resources };
