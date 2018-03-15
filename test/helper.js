const greetbot = require('../src/index.js');
const user_id = process.env.SLACK_USER_ID;
const user_dm_id = process.env.SLACK_DM_ID;
const general_id = process.env.SLACK_GENERAL_ID;
const slack_ver_token = process.env.SLACK_VERIFICATION_TOKEN;

global.greetbot = greetbot;
global.user_id = user_id;
global.user_dm_id = user_dm_id;
global.general_id = general_id;
global.slack_ver_token = slack_ver_token;
