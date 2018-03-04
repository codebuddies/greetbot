const axios = require('axios');
const qs = require('querystring');

const helpData = require('routes/data/slash/resources/resourcesHelp.js').help;
const incomingParser = require('util/incomingParser.js');

const resources = async (req, res) => {
  console.log(`Received slash command ${req.body.command} from ${req.body.user_id} with ${req.body.text}.`);

  const parsedCommand = await incomingParser.parsePayload(req);

  console.log(parsedCommand);
}
