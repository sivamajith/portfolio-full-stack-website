const test = require('node:test');
const assert = require('node:assert/strict');

const { buildContactNotification } = require('./utils/notificationHelpers');

test('buildContactNotification returns a push payload for admin devices', () => {
  const payload = buildContactNotification({
    _id: '64b7a49d8f1d7d2f2c123456',
    name: 'Naveen',
    email: 'naveen@example.com',
    subject: 'Project quote',
  });

  assert.equal(payload.notification.title, 'New portfolio contact message');
  assert.match(payload.notification.body, /Naveen/);
  assert.equal(payload.notification.icon, undefined);
  assert.equal(payload.notification.click_action, undefined);
  assert.equal(payload.data.type, 'contact_message');
  assert.equal(payload.data.messageId, '64b7a49d8f1d7d2f2c123456');
  assert.equal(payload.data.target, '/owner-console-7f3a9c');
  assert.equal(payload.webpush.headers.TTL, '2419200');
  assert.equal(payload.webpush.headers.Urgency, 'high');
  assert.equal(payload.webpush.fcmOptions.link, '/owner-console-7f3a9c');
});
