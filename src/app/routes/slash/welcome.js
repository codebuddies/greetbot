const qs = require('querystring');

const = welcome (req, res) => {
  console.log("Received slash command " + req.body.command + " from " + req.body.user_id + " with " + req.body.text);

  const textPayload = req.body.text;
  const target_user = textPayload.substring(textPayload.lastIndexOf("@")+1, textPayload.lastIndexOf("|"));
  const actionRequest = target_user ? textPayload.substring(textPayload.indexOf(''),textPayload.lastIndexOf("<")-1) : req.body.text;
  const user_id = req.body.user_id;

  console.log("USER ID :: " + user_id);
  console.log("TARGET USER :: " + target_user);
  console.log("ACTION :: " + actionRequest);
  console.log("MESSAGE BODY :: " + textPayload);

  switch (actionRequest) {
    case 'test': {
      if (req.body.token === process.env.SLACK_VERIFICATION_TOKEN) {
        const team_id = req.body.team_id;
        const slashWelcome = true;

        if (!target_user){
          onboard.testMessage(team_id, user_id, slashWelcome);
          res.sendStatus(200);
        }else{
          onboard.testMessage(team_id, target_user, slashWelcome);
          res.sendStatus(200);
        }
      }else{ res.sendStatus(500);};
      break;
    }
    case 'FOO': {
      if (req.body.token === process.env.SLACK_VERIFICATION_TOKEN) {
        //const command = req.body.text;
        const team_id = req.body.team_id;
        const slashWelcome = true

        if (!target_user){
          onboard.fooMessage(team_id, user_id, slashWelcome);
          res.sendStatus(200);
        }else {
          onboard.fooMessage(team_id, target_user, slashWelcome);
          res.sendStatus(200);
        }
      } else { res.sendStatus(500); }
      break;
    }
    case 'python': {
      if (req.body.token === process.env.SLACK_VERIFICATION_TOKEN) {
        //const command = req.body.text;
        const team_id = req.body.team_id;
        const slashWelcome = true

        if (!target_user){
          onboard.pythonMessage(team_id, user_id, slashWelcome);
          res.sendStatus(200);
        }else {
          onboard.pythonMessage(team_id, target_user, slashWelcome);
          res.sendStatus(200);
        }
      } else { res.sendStatus(500); }
      break;
    }
    default: { res.sendStatus(503); }
  }
};


const testMessage = (teamId, userId, slashWelcome) => {
    // send the default message as a test DM to the requestor
    message.channel = userId;
    const params = qs.stringify(welcomeData.message);
    const sendMessage = axios.post('https://slack.com/api/chat.postMessage', params);
    sendMessage.then(postResult);
  };

  module.exports = { welcome };
