const express = require('express');
const router = express.Router();
const path = require('path');

const resourcesController = require(path.join(__dirname, '..', 'controllers', 'resources'));
const templatesController = require(path.join(__dirname, '..', 'controllers', 'templates'));
const welcomeController = require(path.join(__dirname, '..', 'controllers', 'welcome'));
const eventsController = require(path.join(__dirname, '..', 'controllers', 'events'));
const interactiveController = require(path.join(__dirname, '..', 'controllers', 'interactive'));

// Notes on Slack endpoint commands:
//   - A given `slash` command is fired whenever a user evokes the "slash ---"
//     in a channel.
//   - Each function attempts to confirm a verification token & then executes
//     various commmand scenarios.
//   - Command extentions for each slash command can be added via case
//     statements in the various command files.
//
// Notes on Slack Events API
//   - url_verification: Returns challenge token sent when present.
//   - event_callback: Confirm verification token & handle `team_join` event.


// Assign all methods for /templates route
router.route('/templates')
  // Landing page
  .get(templatesController.getIndex);

// Assign all methods for /templates/resources route
router.route('/templates/resources')
  // Used to display the current resources,
  // as an aid to creating Slack markdown formatting
  .get(templatesController.getAllResources);

// Assign all methods for /templates/resources/:name route
router.route('/templates/resources/:name')
  // Shows the current route fields
  .get(templatesController.getResource)
  // Saves any changes to the resource in development
  .post(templatesController.updateResource);

// Assign all methods for /templates/bodies route
router.route('/templates/bodies')
  // Used to display the current language bodies,
  // as an aid to creating Slack markdown formatting
  .get(templatesController.getAllBodies);

// Assign all methods for /resources route
router.route('/resources')
  // The Slack endpoint command
  .post(resourcesController.postResources);

// Assign all methods for /welcome route
router.route('/welcome')
  // The Slack endpoint command
  .post(welcomeController.postWelcome);

// Assign all methods for /events route
router.route('/events')
  // The Slack endpoint event
  .post(eventsController.postEvent);

// Assign all methods for /interactive-message route
router.route('/interactive-message')
  // The Slack endpoint event
  .post(interactiveController.postResponse);

module.exports = { router };
