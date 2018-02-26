const accept = require('./../../routes/events/initial');

const welcomeResponse = (req, res) => {
    const { token, user, team } = JSON.parse(req.body.payload);
    if (token === process.env.SLACK_VERIFICATION_TOKEN) {
      // simplest case with only a single button in the application
      // check `callback_id` and `value` if handling multiple buttons
      accept;
      res.send({ text: '_*Thank you!*_\n\n\nWe\'ll put this here so you don\'t forget:\n\n\n:smile:  Don\'t be shy! Introduce yourself in <https://codebuddies.slack.com/archives/C04AQ6GH4|#introduce-yourself> &amp; welcome fellow new members. _The more we know about each other, the better we can connect &amp; collaborate._\n\n\n:point_left::skin-tone-5:  Browse all our public Slack channels by clicking on `CHANNELS` over in the sidebar.\n\n\n:eyeglasses:  Make sure to read our <https://codebuddies.slack.com/files/U0G92F4J0/F8VRAGD0S/CodeBuddies_Slack_Etiquette_for_General_Members|Slack Etiquette for General Members>.\n\n\n:computer:  Log into our <http://codebuddies.org|website> using your new CodeBuddies Slack account &amp; take a look around -- or join a hangout.\n\n\n:calendar: Try scheduling a hangout yourself! (_You don\’t need to be an expert to collaborate._) Simply click on the `Schedule a Hangout` button on the website &amp; fill in the information. All hangouts get automatically posted back to <https://codebuddies.slack.com/archives/C04AQ6GH0|#announcements>.\n\n\n:books:  Interested in going deep on topics like * Functional JS* or that special *Ruby* book or *Blockchain*? Start a <codebuddies.org/study-groups|StudyGroup>!  All study groups created on the website also get automatically posted back to <https://codebuddies.slack.com/archives/C04AQ6GH0|#announcements>.  Invite folks here on Slack to join in so that you can motivate each other to master your learning goal.\n\n\n:question:  If you have any questions about the community or the project or want to talk to an admin, feel free to ask about it in <https://codebuddies.slack.com/archives/C04BRN86J|#codebuddies-meta>. It\'s where discussions related to our community happen.\n\n\n*Some Quick Links:*\n\n<http://codebuddies.org|CodeBuddies Website>\n<http://codebuddies.org/faq|CodeBuddies FAQ>\n<https://github.com/codebuddiesdotorg/codebuddies|CodeBuddies on GitHub>\n<https://www.facebook.com/groups/TOPSTUDYGROUP/|CodeBuddies on Facebook>\n<http://twitter.com/codebuddiesmeet|CodeBuddies on Twitter>\n\n\n_Happy Learning!_ :wave::skin-tone-5:'
      });
    } else { res.sendStatus(500); }
  };

  module.exports = { welcomeResponse };
