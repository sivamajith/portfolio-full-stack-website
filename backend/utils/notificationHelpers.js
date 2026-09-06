function buildContactNotification(contactMessage) {
  const targetPath = '/owner-console-7f3a9c';
  const isMeeting = contactMessage.subject && (contactMessage.subject.includes('📅') || /meeting|schedule|call/i.test(contactMessage.subject));
  const title = isMeeting ? '📅 New Meeting Scheduled!' : 'New portfolio contact message';

  return {
    notification: {
      title,
      body: `${contactMessage.name}: ${contactMessage.subject}`,
       
    },
    data: {
      type: 'contact_message',
      messageId: String(contactMessage._id || ''),
      senderEmail: contactMessage.email || '',
      subject: contactMessage.subject || '',
      target: targetPath,
      click_action: targetPath,
    },
    webpush: {
      headers: {
        TTL: '2419200',
        Urgency: 'high',
      },
      fcmOptions: {
        link: targetPath,
      },
      notification: {
        icon: '/logo.png',
        badge: '/logo.png',
      },
    },
  };
}

module.exports = { buildContactNotification };
