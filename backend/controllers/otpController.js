import crypto from 'crypto';
import User from '../models/UserModel.js';
import { sendWhatsAppTemplateMessage } from '../services/twilioService.js';

export const sendWhatsAppOTP = async (req, res) => {
  const { phoneNumber } = req.body;

  try {
    const user = await User.findOne({ phoneNumber });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    const templateName = 'viken';  // Your actual template name
    const templateParams = [otp];  // Add any additional parameters required by your template

    const { success, message } = await sendWhatsAppTemplateMessage(phoneNumber, templateName, templateParams);
    if (!success) {
      return res.status(500).json({ message });
    }

    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send OTP', error: error.message });
  }
};

export const verifyWhatsAppOTP = async (req, res) => {
  const { phoneNumber, otp } = req.body;

  try {
    const user = await User.findOne({ phoneNumber });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.otp !== otp || user.otpExpiry < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    res.status(200).json({ message: 'OTP verified successfully', userId: user._id });
  } catch (error) {
    res.status(500).json({ message: 'Failed to verify OTP', error: error.message });
  }
};
