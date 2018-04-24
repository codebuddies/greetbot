const help = {
     token: process.env.SLACK_TOKEN,
     as_user: true,
     link_names: true,
     mrkdwn_in: ['text', 'pretext'],
     text: '*How to use /resources*',
     attachments: JSON.stringify([
       {
         title: '/resources is a command fetch recommended CodeBuddies resources on various topics.',
         text: [ '* /resources : Prints this message as a DM.',
                 '* /resources `list`: Prints a list of all available resources, separated by language.',
                 '* /resources `post [resource language]`: Sends _"getting started in [resource x]"_ message as a DM to the user who typed it.',
                 '* /resources `post [resource language] [level]`:  Sends _[resource x] [level y]_ message as a DM to the user who typed it.',
                 '* /resources `post [resource language] [level] @username`: Sends the result of the command (resource language, etc._) as a DM to the @user specified.',
                 '* /resources `post [resource language] [level] [#channel_name]`: Sends a given resource message to the specified channel.',
                 '* /resources `post [resource language] [level] [#channel_name] @user`: Sends a given resource message to a specified channel AND as a DM to the @user.',
                 '* NOTE: * multiple filters, channels, and users can be used per request.'
               ].join('\n'),
         color: '#74c8ed',
       }]),
   };

module.exports = { help };
