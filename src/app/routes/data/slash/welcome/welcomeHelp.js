const help = {
     token: process.env.SLACK_TOKEN,
     as_user: true,
     link_names: true,
     mrkdwn_in: ['text', 'pretext'],
     text: '*How to use /welcome*',
     attachments: JSON.stringify([
       {
         title: 'Greet users with the CB welcome message & Code of Conduct.',
         text: [ '* `/welcome`  Prints this message.',
                 '* /welcome `test`: Sends a test welcome message as a DM to the user who typed it.',
                 '* /welcome `post`: Sends a test welcome message to the #landing_pad channel.',
                 '* /welcome `[command] @<username>`: Sends the result of the command (_test, post, etc._) as a DM to the user specified.',
                 '* /welcome `[command] #channel_name`: Sends the result of the command (_test, post, etc._) to the specified channel.'
               ].join('\n'),
         color: '#74c8ed',
       }]),
   };


module.exports = { help };
