import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

export const sendWhatsAppTemplateMessage = async (to, templateName, templateParams) => {
  try {
    const message = await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_NUMBER,
      to: `whatsapp:${to}`,
      body: '',
      template: {
        namespace: 'HX3f0b44a6a536dc2bb32c597deb411631', // Replace with your actual template namespace
        name: templateName,
        language: {
          code: 'en', // Replace with the appropriate language code
          policy: 'deterministic'
        },
        components: [
          {
            type: 'body',
            parameters: templateParams.map(param => ({ type: 'text', text: param }))
          }
        ]
      }
    });
    return { success: true, message: 'Message sent successfully', sid: message.sid };
  } catch (error) {
    return { success: false, message: error.message };
  }
};
