// run this file periodically to find users who have not accepted the ToS
const reminders = require('./src/app/routes/interactive/reminder');

reminders.remind();
