const message = {
      token: process.env.SLACK_TOKEN,
      as_user: true,
      link_names: true,
      mrkdwn_in: ['text', 'pretext'],
      attachments: JSON.stringify([
        {
          pretext: '${language-icon}  ${language-desc}\n\n\n'
          title: '\n${level} ${language}\n\n',
          text:  '${video-link}  ${video-desc}\n\n${tutorial-link}  ${tutorial-desc}\n\n${book-link}  ${book-desc}\n\n${class-link}  ${class-desc}\n\n${help_link}\n\n${more-questions}\n\n\n${maintainer}',
          color: '${sidebar-color}',
        }]),
    };


module.exports = { message };
