const qs = require('querystring');
const axios = require('axios');
const JsonDB = require('node-json-db');

const db = new JsonDB('users', true, false);

const postResult = result => console.log(result.data);

// default message - includes Code of Conduct and [Accept] button.
const message = {
  token: process.env.SLACK_TOKEN,
  as_user: true,
  link_names: true,
  mrkdwn_in: ['text', 'pretext'],
  attachments: JSON.stringify([
    {
      pretext: '*Welcome!* _We\'re glad you\'re here._\n\n:question: *What exactly is CodeBuddies?* :question:\n\n\nWe\’re a community of independent code learners sharing knowledge &amp; helping each other learn faster.  We\'re 100% volunteer.  Our website, <https://codebuddies.org/|CodeBuddies.org> is open-sourced &amp; welcomes contributions on <https://www.github.com/codebuddiesdotorg|GitHub>.\n\n\nWe come from all over the world.  We\'re all different ages; we work & study across all sorts of professions.  Everyone is welcome - no previous experience required!  \n\n\nThis community thrives thanks to the generosity of our members, Slack admin moderators, GitHub code contributors, website community mentors, &amp; monetary donations on <https://opencollective.com/codebuddies|Open Collective.>\n\n.',
      title: '\n:large_blue_diamond:\n\nLet\'s Get Started',
      text: '\n\n:smile:  Don\'t be shy! Introduce yourself in <https://codebuddies.slack.com/archives/C04AQ6GH4|#introduce-yourself> &amp; welcome fellow new members. _The more we know about each other, the better we can connect &amp; collaborate._\n\n\n:point_left::skin-tone-5:  Browse all our public Slack channels by clicking on `CHANNELS` over in the sidebar.\n\n\n:eyeglasses:  Make sure to read our <https://codebuddies.slack.com/files/U0G92F4J0/F8VRAGD0S/CodeBuddies_Slack_Etiquette_for_General_Members|Slack Etiquette for General Members>.\n\n\n:computer:  Log into our <http://codebuddies.org|website> using your new CodeBuddies Slack account &amp; take a look around -- or join a hangout.\n\n\n:calendar: Try scheduling a hangout yourself! (_You don\’t need to be an expert to collaborate._) Simply click on the `Schedule a Hangout` button on the website &amp; fill in the information. All hangouts get automatically posted back to <https://codebuddies.slack.com/archives/C04AQ6GH0|#announcements>.\n\n\n:books:  Interested in going deep on topics like * Functional JS* or that special *Ruby* book or *Blockchain*? Start a <codebuddies.org/study-groups|StudyGroup>!  All study groups created on the website also get automatically posted back to <https://codebuddies.slack.com/archives/C04AQ6GH0|#announcements>.  Invite folks here on Slack to join in so that you can motivate each other to master your learning goal.\n\n\n:question:  If you have any questions about the community or the project or want to talk to an admin, feel free to ask about it in <https://codebuddies.slack.com/archives/C04BRN86J|#codebuddies-meta>. It\'s where discussions related to our community happen.\n\n\n_Happy Learning!_ :wave::skin-tone-5:',
      color: '#74c8ed',
    },
    {
      title: '\n:star:\n\nSome Ground Rules',
      text: 'Our goal is to maintain a safe, helpful &amp; friendly community for everyone, regardless of experience, gender identity &amp; expression, sexual identity &amp; orientation, disability, personal appearance, body size, race, ethnicity, age, religion, nationality, profession, or any other defining characteristic. \n\n\nPlease take the time to *read through &amp; acknowledge* the complete <https://github.com/codebuddiesdotorg/codebuddies/blob/master/CODE_OF_CONDUCT.md|Code of Conduct> before continuing.',
      callback_id: 'code-of-conduct',
      color: '#3060f0',
      actions: [{
        name: 'accept',
        text: 'Accept',
        type: 'button',
        value: 'accept',
        style: 'primary',
      }],
    }]),
};

const python = {
  token: process.env.SLACK_TOKEN,
  as_user: true,
  link_names: true,
  mrkdwn_in: ['text', 'pretext'],
  text: '*Getting Started With Python*',
  attachments: JSON.stringify([
    {
      title: '\n_*First Steps*_',
      text: '\n:snake: <https://docs.python.org/3/tutorial/|Python Software Foundation Offical Tutorial>\n:computer:  <https://www.codecademy.com/learn/learn-python|Learn Python @codecademy>\n:computer:  <https://realpython.com/learn/python-first-steps/|Real Python First Steps>\n:books:  <https://automatetheboringstuff.com/|Automate the Boring Stuff With Python>\n:books:  <https://learnpythonthehardway.org/|Learn Python the Hard Way>\n:mortar_board:  <https://www.py4e.com/|Python for Everybody>\n:mortar_board:  <https://training.talkpython.fm/|Talk Python Training>',
      color: '#edc63b',
    },
    {
      title: '\n_*Bigger Bites*_',
      text: '\n:snake:  <https://docs.python.org/3/howto/index.html|Python Software Foundation HowTos>\n:snake:  <https://docs.python.org/3/howto/functional.html|Functional Programming in Python>\n:snake:  <https://www.synopsys.com/blogs/software-security/understanding-python-bytecode/|Understanding Pythons Byte Code>\n:snake:  <http://www.diveintopython3.net/where-to-go-from-here.html|Python3 Where to Go from Here>\n:computer:  <https://www.youtube.com/playlist?list=PLQVvvaa0QuDfju7ADVp5W1GF9jVhjbX-_|sentdex Intermediate Python>\n:books:  <http://python-3-patterns-idioms-test.readthedocs.io/en/latest/index.html|Python3 Patterns, Recipes & Idioms>\n:books:  <https://www.amazon.com/Python-Cookbook-Third-David-Beazley/dp/1449340377|Python Cookbook 3rd Edition, David Beazley>\n:books:  <https://www.amazon.com/Fluent-Python-Concise-Effective-Programming/dp/1491946008/ref=la_B00O6IY1S4_1_1?s=books&ie=UTF8&qid=1517656222&sr=1-1|Fluent Python, Luciano Ramalho>\n:mortar_board:  <https://www.edx.org/course/introduction-computer-science-mitx-6-00-1x-11|MIT Intro to CS & Programming Using Python>\n:mortar_board:  <https://www.edx.org/course/introduction-computational-thinking-data-mitx-6-00-2x-6|MIT Intro to Computational Thinking & Data Science>',
      color: '#3060f0',
    },
    {
      title: '\n_*Projects &amp; Games*_',
      text: '\n:snake:   <https://coolpythoncodes.com/python-turtle/|Cool Python Codes Turtle Tutorial>\n:computer:  <http://newcoder.io/|New Coder - 5 Life Jackets to Throw to the New Coder>\n:computer:  <http://programarcadegames.com/|Program Arcade Games with Python & Pygame>\n:computer:  <https://github.com/norvig/pytudes|Peter Norvigs pytudes>\n:books: <http://inventwithpython.com/|Al Sweigerts Books for Free online>\n:mortar_board:<http://simeonfranklin.com/talk/pyglet/slides.html#title-slide|Simeon Franklin "Basic Games with Python">\n:mortar_board:  <https://www.youtube.com/playlist?list=PLQVvvaa0QuDdLkP8MrOXLe_rKuf6r80KO|sentdex on Game Development in Python>',
      color: '#edc63b',
    },
    {
      title: '\n_*WebDev Focused*_',
      text: '\n:computer:<https://tutorial.djangogirls.org/en/|Django Girls Tutorial>\n:computer:<https://docs.djangoproject.com/en/2.0/intro/tutorial01/|Django Projects Offical Tutorial>\n:computer: <http://flask.pocoo.org/docs/0.12/tutorial/|Flask Projects Offical Tutorial>\n:computer:  <https://www.pythonanywhere.com/|PythonAnywhere: Host Web Applications in the Cloud>\n:computer:  <https://devcenter.heroku.com/categories/python|Heroku: Hosted Python>\n:books:  <https://www.fullstackpython.com/flask.html|Full Stack Python>\n:books:  <http://www.tangowithdjango.com/|Tango with Django>\n:books:  <https://www.twoscoopspress.com/products/two-scoops-of-django-1-11|Two Scoops of Django>\n:mortar_board:  <https://blog.miguelgrinberg.com/post/the-flask-mega-tutorial-part-i-hello-world|Flask Mega Tutorial>',
      color: '#3060f0',
    },
    {
      title: '\n_*Tools &amp; Msc.*_',
      text: '\n:snake:  <https://www.python.org/doc/essays/|Essays &amp; Writing from Pythons Creator>\n:computer:  <http://pythontutor.com/|Python Tutor: Visualize Your Python Code>\n:computer:  <https://teletype.atom.io/#getting-started|Atom Code Editor with Teletype Collaboration>\n:books:  <https://pythonpedia.com/applications/database-access.html|The Python Pedia>\n:books:  <http://docs.python-guide.org/en/latest/intro/learning/|Hitchhikers Guide to Python Learning Compendium>\n:mortar_board:  <https://www.youtube.com/channel/UCbNpPBMvCHr-TeJkkezog7Q|David Beazley>\n:mortar_board:  <https://www.youtube.com/results?sp=CAI%253D&search_query=raymond+hettinger+python|Raymond Hettinger>\n:mortar_board:  <https://www.youtube.com/user/sentdex/featured|sentdex>',
      color: '#edc63b',
    }]),
};

const foo = {
  token: process.env.SLACK_TOKEN,
  as_user: true,
  link_names: true,
  mrkdwn_in: ['text', 'pretext'],
  text: 'THIS IS THE FOO TEST',
  attachments: JSON.stringify([
    {
      title: 'Foo!',
      text: 'Little bunny Foo Foo\nHopping through the forest\nScooping up the field mice\nAnd boppin\' \'em on the head!',
      color: '#74c8ed',
    },
    {
      title: 'Fairy',
      text: 'Down came the good fairy\n And the good fairy said:\n \"Little bunny Foo Foo, I don\'t wanna see you\nScooping up the field mice and boppin\' \'em on the head!\nI\'m gonna give you three chances,\nThen I\'m gonna turn you into a goon!\"',
      color: '#3060f0',
    }]),
};

const initialMessage = (teamId, userId) => {
  let data = false;
  // try fetch team/user pair. This will throw an error if nothing exists in the db
  try { data = db.getData(`/${teamId}/${userId}`); } catch (error) {
    console.error(error);
  }

  // `data` will be false if nothing is found or the user hasn't accepted the ToS
  if (!data) {
    // add or update the team/user record
    db.push(`/${teamId}/${userId}`, false);

    // send the default message as a DM to the user
    message.channel = userId;
    const params = qs.stringify(message);
    const sendMessage = axios.post('https://slack.com/api/chat.postMessage', params);
    sendMessage.then(postResult);
  } else {
    console.log('Already onboarded');
  }
};

// set the team/user record to true to indicate that they've accepted the ToS
// you might want to store the date/time that the terms were accepted

const accept = (userId, teamId) => db.push(`/${teamId}/${userId}`, true);

// find all the users who've been presented the ToS and send them a reminder to accept.
// the same logic can be applied to find users that need to be removed from the team
const remind = () => {
  try {
    const data = db.getData('/');
    Object.keys(data).forEach((team) => {
      Object.keys(data[team]).forEach((user) => {
        if (!data[team][user]) {
          message.channel = user;
          message.text = ':heavy_exclamation_mark: This is a quick reminder.  At CodeBuddies, our goal is to maintain a safe, helpful &amp; friendly community for everyone, regardless of experience, gender identity &amp; expression, sexual identity &amp; orientation, disability, personal appearance, body size, race, ethnicity, age, religion, nationality, profession, or any other defining characteristic. \n\n\nPlease take the time to *read through &amp; acknowledge* the complete <https://github.com/codebuddiesdotorg/codebuddies/blob/master/CODE_OF_CONDUCT.md|Code of Conduct> before continuing in our community.';

          const params = qs.stringify(message);
          const sendMessage = axios.post('https://slack.com/api/chat.postMessage', params);

          sendMessage.then(postResult);
        }
      });
    });
  } catch (error) { console.error(error); }
};

/*
 * Message actions for specific `/welcome` extention commands e.g. `/weclome python` or `/welcome webdev`
 * Corresponding message text is listed in the messages section of this file.
 */
const fooMessage = (teamId, userId, slashWelcome) => {
    // send the foo message as a DM to the user
    foo.channel = userId;
    const params = qs.stringify(foo);
    const sendMessage = axios.post('https://slack.com/api/chat.postMessage', params);
    sendMessage.then(postResult);
  };


const pythonMessage = (teamId, userId, slashWelcome) => {
    // send the foo message as a DM to the user
    python.channel = userId;
    const params = qs.stringify(python);
    const sendMessage = axios.post('https://slack.com/api/chat.postMessage', params);
    sendMessage.then(postResult);
  };


const testMessage = (teamId, userId, slashWelcome) => {
    // send the default message as a test DM to the requestor
    message.channel = userId;
    const params = qs.stringify(message);
    const sendMessage = axios.post('https://slack.com/api/chat.postMessage', params);
    sendMessage.then(postResult);
  };


module.exports = { testMessage, fooMessage, pythonMessage, initialMessage, accept, remind };
