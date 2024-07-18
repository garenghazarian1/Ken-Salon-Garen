import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

export const sendWhatsAppTemplateMessage = async (to, templateName, templateParams) => {
  try {
    const message = await client.messages.create({
      to: `whatsapp:${to}`,
      from: process.env.TWILIO_WHATSAPP_NUMBER,
      messagingServiceSid: process.env.TWILIO_MESSAGING_SERVICE_SID,
      contentSid: process.env.TWILIO_CONTENT_SID, // If you have a Content SID
      template: {
        name: templateName,
        language: {
          code: 'en', // Use 'en' for English
        },
        components: [{
          type: 'body', // Component type should match what's required in the template
          parameters: templateParams.map(param => ({ type: 'text', text: param })) // Ensure the parameters match the template requirements
        }]
      }
    });
    return { success: true, message: 'Message sent successfully', sid: message.sid };
  } catch (error) {
    console.error("Failed to send message: ", error);
    return { success: false, message: error.message };
  }
};
