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
      from: process.env.TWILIO_WHATSAPP_NUMBER, // Optional if using Messaging Service SID
      messagingServiceSid: 'MG2fa8df6abe118aa8c74b7043f6877b67', // Correct Messaging Service SID
       body: 'text',
       messagingServiceSid: 'MG2fa8df6abe118aa8c74b7043f6877b67', 
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
