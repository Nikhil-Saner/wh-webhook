// routes/WebhookRoutes.js

const express = require('express');

module.exports = function(webhookController) {
  const router = express.Router();

  // Define routes and associate with controller methods
  router.get('/abc/test', (req, res) => webhookController.testing(req, res));
  router.get('/', (req, res) => webhookController.verifyWebhook(req, res));
  router.post('/incoming', (req, res) => webhookController.handleIncomingMessages(req, res));
  router.get('/message-status/verify', (req, res) => webhookController.verifyMessageStatusWebhook(req, res));
  router.post('/message-status', (req, res) => webhookController.handleMessageStatus(req, res));

  return router;
};

