const help = {
     token: process.env.SLACK_TOKEN,
     as_user: true,
     link_names: true,
     mrkdwn_in: ['text', 'pretext'],
     text: '*How to use /resources*',
     attachments: JSON.stringify([
       {
         title: '/resources is a command fetch recommended CodeBuddies resources on various topics.',
         text: [ '* /resources : Prints this message.',
                 '* /resources `list`: Prints a list of all available resources.',
                 '* /resources `list`[resource name]: Prints a list of available topics for requested resource name.',
                 '* /resources `[resource name]`: Sends _"getting started in [resource x]"_ message as a DM to the user who typed it.',
                 '* /resources `[resource name] [level]`:  Sends _[resource x] [level y]_ message as a DM to the user who typed it.',
                 '* /resources `[resource name] [level] @username`: Sends the result of the command (resource name, etc._) as a DM to the @user specified.',
                 '* /resources `post`[resource name] [level] [#channel_name]: Sends a given resource message to the specified channel.',
                 '* /resources `post`[resource name] [level] [#channel_name] @user: Sends a given resource message to a specified channel AND as a DM to the @user.'
               ].join('\n'),
         color: '#74c8ed',
       }]),
   };

   
module.exports = { help };
