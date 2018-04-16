const axios = require('axios');
const qs = require('querystring');
const postResult = result => console.log(result.data);

const resourcesData = require('util/ymlLoader.js').messageAttachments;
const messageBodies = require('util/ymlLoader.js').messageBodies;

const helpData = require('routes/data/slash/resources/messageTemplates/resourcesHelp.js').help;
const resourcesTemplateMessage = require('routes/data/slash/resources/messageTemplates/resourcesMessage.js').message;
const genericResourcesAttachmentTemplate = require('routes/data/slash/resources/messageTemplates/genericResourcesAttachmentTemplate.js').generateResourcesMessage;
const incomingParser = require('util/incomingParser.js');

const filterResources = require('util/ymlFilters.js').filterResources;
const filterBodies = require('util/ymlFilters.js').filterTemplates;

const resources = async (req, res) => {
  console.log(`Received slash command ${req.body.command} from ${req.body.user_id} with ${req.body.text}.`);

  const parsedCommand = await incomingParser.parsePayload(req);

  console.log(`parsedCommand is ${JSON.stringify(parsedCommand)}`);

  if (req.body.token === process.env.SLACK_VERIFICATION_TOKEN) {
    switch (parsedCommand.action) {
      case 'list': {
        console.log(JSON.stringify(resourcesData));
        let resourcesCounted = resourcesData.reduce((count, resource) => {
          count[resource.language.toLowerCase()] = (count[resource.language.toLowerCase()] || 0) + 1;
          return count;
        }, Object.create(null));
        filterAndPostResults(parsedCommand.target_channel_id, parsedCommand.target_user_id, listResourcesMessage, resourcesTemplateMessage, "Here is the current count of resources", resourcesCounted);
        res.sendStatus(200);
        break;
      }
      case 'post': {
        let title;
        let attachments;
        if (!(Object.keys(parsedCommand.actionArguments).length && parsedCommand.actionArguments.constructor === Object)) {
          title = "*Here is the full list of resources:*";
          attachments = genericResourcesAttachmentTemplate(resourcesData, messageBodies);
        } else {
          const filteredResources = filterResources(resourcesData, parsedCommand.actionArguments);
          const filteredBodies = filterBodies(filteredResources, messageBodies);
          title = `*Here are the resources you requested:*`;
          attachments = genericResourcesAttachmentTemplate(filteredResources, filteredBodies);
        }
        filterAndPostResults(parsedCommand.target_channel_id, parsedCommand.target_user_id, resourceMessage, resourcesTemplateMessage, title, attachments);
        res.sendStatus(200);
        break;
      }
      default: {
        filterAndPostResults(parsedCommand.target_channel_id, parsedCommand.target_user_id, helpMessage, helpData);
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

const listResourcesMessage = (resourcesTemplateMessage, target_channel_id, title, attachments) => {
  resourcesTemplateMessage.text = title;
  resourcesTemplateMessage.attachments = JSON.stringify([
    {
      text: Object.entries(attachments).map(entry => {
        return `We have ${entry[1]} ${entry[0]} resource${entry[1] == 1 ? '' : 's'}.`
      }).join('\n'),
      color: '#74C8ED',
    },
    {
      title: 'How to view these resources:',
      text: 'To view a language list, type `/resources post {language}`.\nFor more specific resources, you can also filter by level (beginner, intermediate, or advanced), type (video, book, class, or tutorial), and whether it is free or not.\nFor example, `/resources post javascript beginner book free` would give you a list of free books, aimed at beginning your javascript career.',
      color: '#551A8B',
    }]);
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
  users.forEach(user_id => {
    if (!common.includes(user_id)) {
      callback(data, user_id, title, attachments);
    }
  });
  common.forEach(common_id => {
    callback(data, common_id, title, attachments);
  });
}

module.exports = { resources };
