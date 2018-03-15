const greetbot = require('../src/index.js');
const user_id = process.env.SLACK_USER_ID;
const slack_ver_token = process.env.SLACK_VERIFICATION_TOKEN;

global.greetbot = greetbot;
global.user_id = user_id;
global.slack_ver_token = slack_ver_token;
