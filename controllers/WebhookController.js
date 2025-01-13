const axios = require('axios');
const WhatsAppMessageService = require('../services/WhatsAppMessageService');
require('dotenv').config(); // Ensure dotenv is loaded to access environment variables

class WebhookController {
  constructor(messageService) {
    this.messageService = messageService;
    this.myVerifyToken = process.env.SECRET_TOKEN; // Load the token from environment variables
  }

    // Verify Webhook
    testing(req, res) {
        console.log('testing Webhook called...');
          res.status(200).send("it's working..!");   
      }

  // Verify Webhook
  verifyWebhook(req, res) {
    console.log('Verify Webhook called...');
    const mode = req.query['hub.mode'];
    const challenge = req.query['hub.challenge'];
    const verifyToken = req.query['hub.verify_token'];

    if (mode === 'subscribe' && verifyToken === this.myVerifyToken) {
      res.status(200).send(challenge);
    } else {
      res.status(403).send('Forbidden');
    }
  }

  // Handle incoming messages
  async handleIncomingMessages(req, res) {
    console.log('Handle Incoming Webhook called...');
    const payload = req.body;

    try {
      const entries = payload.entry || [];
      for (const entry of entries) {
        const changes = entry.changes || [];
        for (const change of changes) {
          const value = change.value || {};
          const messages = value.messages || [];

          for (const message of messages) {
            const from = message.from; // Sender's phone number
            console.log(`Value of from = ${from}`);
            // Send a static response
            await this.messageService.sendSimpleTemplateMessage(from, 'auto_reply');
          }
        }
      }
    } catch (error) {
      console.error('Error processing incoming message:', error);
    }

    res.status(200).send('EVENT_RECEIVED');
  }

  // Verify message status webhook
  verifyMessageStatusWebhook(req, res) {
    console.log('Verify Status Webhook called...');
    const mode = req.query['hub.mode'];
    const challenge = req.query['hub.challenge'];
    const verifyToken = req.query['hub.verify_token'];

    if (mode === 'subscribe' && verifyToken === this.myVerifyToken) {
      res.status(200).send(challenge);
    } else {
      res.status(403).send('Invalid token');
    }
  }

  // Handle message status updates
  handleMessageStatus(req, res) {
    console.log('Handle Message Status Update called...');
    const requestBody = req.body;

    try {
      const statuses = requestBody.entry?.[0]?.changes?.[0]?.value?.statuses || [];
      statuses.forEach((status) => {
        const messageId = status.id;
        const recipientId = status.recipient_id;
        const statusType = status.status;
        const timestamp = status.timestamp;

        console.log(
          `Message ID: ${messageId}, Recipient: ${recipientId}, Status: ${statusType}, Timestamp: ${timestamp}`
        );
      });
    } catch (error) {
      console.error('Error processing message status update:', error);
    }

    res.status(200).send('EVENT_RECEIVED');
  }
}

module.exports = WebhookController;
