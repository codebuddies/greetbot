const greetbot = require('../src/index.js');

const {
  SLACK_USER_ID,
  SLACK_DM_ID,
  SLACK_DM_NAME,
  SLACK_OTHER_USER_ID,
  SLACK_OTHER_DM_ID,
  SLACK_OTHER_DM_NAME,
  SLACK_GENERAL_ID,
  SLACK_OTHER_CHANNEL_ID,
  SLACK_VERIFICATION_TOKEN,
} = process.env;

global.greetbot = greetbot;
global.user_id = SLACK_USER_ID;
global.user_dm_id = SLACK_DM_ID;
global.user_dm_name = SLACK_DM_NAME;
global.other_user_id = SLACK_OTHER_USER_ID;
global.other_dm_id = SLACK_OTHER_DM_ID;
global.other_dm_name = SLACK_OTHER_DM_NAME;
global.general_id = SLACK_GENERAL_ID;
global.other_channel_id = SLACK_OTHER_CHANNEL_ID;
global.slack_ver_token = SLACK_VERIFICATION_TOKEN;
