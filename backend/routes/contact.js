const express = require('express');
const ContactMessage = require('../models/ContactMessage');
const DeviceToken = require('../models/DeviceToken');
const { admin, initialized } = require('../config/firebase');
const { buildContactNotification } = require('../utils/notificationHelpers');

const router = express.Router();

async function sendContactNotifications(contactMessage) {
  if (!initialized || !admin?.messaging) {
    console.warn('Contact notification skipped: Firebase Admin is not initialized.');
    return;
  }

  const notification = buildContactNotification(contactMessage);
  const deviceTokens = await DeviceToken.find({ active: true }).lean();

  if (deviceTokens.length > 0) {
    const tokens = deviceTokens.map(({ token }) => token).filter(Boolean);
    const chunks = [];

    for (let index = 0; index < tokens.length; index += 500) {
      chunks.push(tokens.slice(index, index + 500));
    }

    for (const chunk of chunks) {
      try {
        const response = await admin.messaging().sendEachForMulticast({
          tokens: chunk,
          notification: notification.notification,
          data: notification.data,
          webpush: notification.webpush,
        });

        console.log(`Firebase device notifications: ${response.successCount} sent, ${response.failureCount} failed`);

        const invalidTokens = [];
        response.responses.forEach((result, index) => {
          if (!result.success) {
            const errorCode = result.error?.code || '';
            const token = chunk[index];
            const tokenPreview = token ? token.slice(0, 12) : 'unknown';
            console.error(`Firebase token failed (${tokenPreview}...):`, errorCode || result.error?.message || 'Unknown push error');

            if (['messaging/invalid-registration-token', 'messaging/registration-token-not-registered'].includes(errorCode)) {
              invalidTokens.push(token);
            }
          }
        });

        if (invalidTokens.length > 0) {
          await DeviceToken.deleteMany({ token: { $in: invalidTokens } });
          console.log(`Removed ${invalidTokens.length} stale Firebase device tokens from the database.`);
        }
      } catch (sendError) {
        console.error('Firebase per-device notification failed:', sendError.message);
      }
    }
  } else {
    console.warn('Contact notification skipped: no active device tokens are registered.');
  }

  try {
    await admin.messaging().sendToTopic('portfolio_contact_updates', notification);
  } catch (sendError) {
    console.error('Firebase topic notification failed:', sendError.message);
  }
}

router.post('/', async (req, res, next) => {
  try {
    const { name, email, phone = '', subject, message } = req.body || {};
    if (![name, email, subject, message].every((value) => String(value || '').trim())) {
      return res.status(400).json({ success: false, message: 'Name, email, subject and message are required' });
    }
    if (!/^\S+@\S+\.\S+$/.test(String(email).trim())) {
      return res.status(400).json({ success: false, message: 'Enter a valid email address' });
    }

    const contactMessage = await ContactMessage.create({
      name: String(name).trim(),
      email: String(email).trim(),
      phone: String(phone || '').trim(),
      subject: String(subject).trim(),
      message: String(message).trim(),
    });
    
    // Notification delivery is independent from accepting the contact message.
    sendContactNotifications(contactMessage).catch((notificationError) => {
      console.error('Contact notification delivery failed:', notificationError.message);
    });

    res.status(201).json({
      success: true,
      message: 'Your message has been received',
      contactMessage: contactMessage.toObject ? contactMessage.toObject() : contactMessage,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
module.exports.sendContactNotifications = sendContactNotifications;
