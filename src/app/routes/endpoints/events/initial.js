const qs = require('querystring');
const axios = require('axios');
const JsonDB = require('node-json-db');
const db = new JsonDB('src/app/users', true, false);

const postResult = result => console.log(result.data);

const eventWelcome = (req, res) => {
  switch (req.body.type) {
    case 'url_verification': {
      // verify Events API endpoint by returning challenge if present
      res.send({
        challenge: req.body.challenge
      });
      break;
    }
    case 'event_callback': {
      if (req.body.token === process.env.SLACK_VERIFICATION_TOKEN) {
        const event = req.body.event;

        // `team_join` is fired whenever a new user (incl. a bot) joins the team
        // check if `event.is_restricted == true` to limit to guest accounts
        if (event.type === 'team_join' && !event.user.is_bot) {
          const { team_id, id } = event.user;
          initialMessage(team_id, id);
        }
        res.sendStatus(200);
      } else {
        res.sendStatus(500);
      }
      break;
    }
    default: {
      res.sendStatus(500);
    }
  }
};

const initialMessage = (teamId, userId) => {
  let data = false;
  // try fetch team/user pair. This will throw an error if nothing exists in the db
  try {
    data = db.getData(`/${teamId}/${userId}`);
  } catch (error) {
    console.error(error);
  }

  // `data` will be false if nothing is found or the user hasn't accepted the ToS
  if (!data) {
    // add or update the team/user record
    db.push(`/${teamId}/${userId}`, false);

    // send the default message as a DM to the user
    message.channel = userId;
    const params = qs.stringify(message);
    const sendMessage = axios.post(
      'https://slack.com/api/chat.postMessage',
      params
    );
    sendMessage.then(postResult);
  } else {
    console.log('Already onboarded');
  }
};

const message = {
  token: process.env.SLACK_TOKEN,
  as_user: true,
  link_names: true,
  mrkdwn_in: ['text', 'pretext'],
  attachments: JSON.stringify([
    {
      pretext:
        "*Welcome!* _We're glad you're here._\n\n:question: *What exactly is CodeBuddies?* :question:\n\n\nWe’re a community of independent code learners sharing knowledge &amp; helping each other learn faster.  We're 100% volunteer.  Our website, <https://codebuddies.org/|CodeBuddies.org> is open-sourced &amp; welcomes contributions on <https://www.github.com/codebuddiesdotorg|GitHub>.\n\n\nWe come from all over the world.  We're all different ages; we work & study across all sorts of professions.  Everyone is welcome - no previous experience required!  \n\n\nThis community thrives thanks to the generosity of our members, Slack admin moderators, GitHub code contributors, website community mentors, &amp; monetary donations on <https://opencollective.com/codebuddies|Open Collective.>\n\n.",
      title: "\n:large_blue_diamond:\n\nLet's Get Started",
      text:
        "\n\n:smile:  Don't be shy! Introduce yourself in <https://codebuddies.slack.com/archives/C04AQ6GH4|#introduce-yourself> &amp; welcome fellow new members. _The more we know about each other, the better we can connect &amp; collaborate._\n\n\n:point_left::skin-tone-5:  Browse all our public Slack channels by clicking on `CHANNELS` over in the sidebar.\n\n\n:eyeglasses:  Make sure to read our <https://codebuddies.slack.com/files/U0G92F4J0/F8VRAGD0S/CodeBuddies_Slack_Etiquette_for_General_Members|Slack Etiquette for General Members>.\n\n\n:computer:  Log into our <http://codebuddies.org|website> using your new CodeBuddies Slack account &amp; take a look around -- or join a hangout.\n\n\n:calendar: Try scheduling a hangout yourself! (_You don’t need to be an expert to collaborate._) Simply click on the `Schedule a Hangout` button on the website &amp; fill in the information. All hangouts get automatically posted back to <https://codebuddies.slack.com/archives/C04AQ6GH0|#announcements>.\n\n\n:books:  Interested in going deep on topics like * Functional JS* or that special *Ruby* book or *Blockchain*? Start a <codebuddies.org/study-groups|StudyGroup>!  All study groups created on the website also get automatically posted back to <https://codebuddies.slack.com/archives/C04AQ6GH0|#announcements>.  Invite folks here on Slack to join in so that you can motivate each other to master your learning goal.\n\n\n:question:  If you have any questions about the community or the project or want to talk to an admin, feel free to ask about it in <https://codebuddies.slack.com/archives/C04BRN86J|#codebuddies-meta>. It's where discussions related to our community happen.\n\n\n:heavy_plus_sign:  If you'd like to add a new integration to the Slack, please ask in the <https://codebuddies.slack.com/archives/C04BRN86J|#codebuddies-meta> channel as well! Because CodeBuddies is on a free plan, the number of new Slack apps we can integrate is limited, so we would need to choose our integrations wisely.\n\n\n_Happy Learning!_ :wave::skin-tone-5:",
      color: '#74c8ed'
    },
    {
      title: '\n:star:\n\nSome Ground Rules',
      text:
        'Our goal is to maintain a safe, helpful &amp; friendly community for everyone, regardless of experience, gender identity &amp; expression, sexual identity &amp; orientation, disability, personal appearance, body size, race, ethnicity, age, religion, nationality, profession, or any other defining characteristic. \n\n\nPlease take the time to *read through &amp; acknowledge* the complete <https://github.com/codebuddiesdotorg/codebuddies/blob/master/CODE_OF_CONDUCT.md|Code of Conduct> before continuing.',
      callback_id: 'code-of-conduct',
      color: '#3060f0',
      actions: [
        {
          name: 'accept',
          text: 'Accept',
          type: 'button',
          value: 'accept',
          style: 'primary'
        }
      ]
    }
  ])
};

// set the team/user record to true to indicate that they've accepted the ToS
// you might want to store the date/time that the terms were accepted

const accept = (userId, teamId) => db.push(`/${teamId}/${userId}`, true);

module.exports = {
  eventWelcome,
  initialMessage,
  accept
};
