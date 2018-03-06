const message = {
      token: process.env.SLACK_TOKEN,
      as_user: true,
      link_names: true,
      mrkdwn_in: ['text', 'pretext'],
    };


module.exports = { message };
