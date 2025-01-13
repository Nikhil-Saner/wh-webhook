// services/WhatsAppMessageService.js

const axios = require('axios');  // We're using axios for HTTP requests

require('dotenv').config();  // Load environment variables from .env file

class WhatsAppMessageService {

  constructor() {
    this.apiUrl = process.env.WHATSAPP_API_URL;  // Fetching from environment variables
    this.apiToken = process.env.WHATSAPP_API_TOKEN;  // API Token for authentication
  }

  // Send a simple text message
  sendMessage(recipient, message) {

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiToken}`,
    };

    const body = {
      messaging_product: 'whatsapp',
      to: recipient,
      type: 'text',
      text: { body: message }
    };

    return axios.post(this.apiUrl, body, { headers })
      .then(response => response.data)
      .catch(error => {
        // Improved error handling with detailed logging
        console.error("Error details:", JSON.stringify(error.response?.data || error.message, null, 2));
        throw new Error(`Error sending message: ${JSON.stringify(error.response?.data || error.message, null, 2)}`);
      });
  }

  // Send a template message with dynamic variables
  sendTemplateMessage(recipient, templateName, variables) {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiToken}`,
    };

    // Build the template parameters
    const parameters = variables.map(variable => ({
      type: 'text',
      text: variable
    }));

    const body = {
      messaging_product: 'whatsapp',
      to: recipient,
      type: 'template',
      template: {
        name: templateName,
        language: { code: 'en_US' },
        components: [{
          type: 'body',
          parameters: parameters
        }]
      }
    };

    return axios.post(this.apiUrl, body, { headers })
      .then(response => response.data)
      .catch(error => {
        console.error("Error details:", JSON.stringify(error.response?.data || error.message, null, 2));
        throw new Error(`Error sending template message: ${JSON.stringify(error.response?.data || error.message, null, 2)}`);
      });
  }

  // Send a simple template message without variables
  sendSimpleTemplateMessage(recipient, templateName) {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiToken}`,
    };

    const body = {
      messaging_product: 'whatsapp',
      to: recipient,
      type: 'template',
      template: {
        name: templateName,
        language: { code: 'en_US' }
      }
    };

    return axios.post(this.apiUrl, body, { headers })
      .then(response => response.data)
      .catch(error => {
        console.error("Error details:", JSON.stringify(error.response?.data || error.message, null, 2));
        throw new Error(`Error sending simple template message: ${JSON.stringify(error.response?.data || error.message, null, 2)}`);
      });
  }
}

module.exports = WhatsAppMessageService;
