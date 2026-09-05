import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage, deleteToken } from 'firebase/messaging';

const cleanEnvValue = (value) => (value || '').trim().replace(/,\s*$/, '');

const firebaseConfig = {
  apiKey: cleanEnvValue(process.env.REACT_APP_FIREBASE_API_KEY),
  authDomain: cleanEnvValue(process.env.REACT_APP_FIREBASE_AUTH_DOMAIN),
  projectId: cleanEnvValue(process.env.REACT_APP_FIREBASE_PROJECT_ID),
  storageBucket: cleanEnvValue(process.env.REACT_APP_FIREBASE_STORAGE_BUCKET),
  messagingSenderId: cleanEnvValue(process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID),
  appId: cleanEnvValue(process.env.REACT_APP_FIREBASE_APP_ID),
  vapidKey: cleanEnvValue(process.env.REACT_APP_FIREBASE_VAPID_KEY),
};

const app = firebaseConfig.apiKey ? initializeApp(firebaseConfig) : null;
const messaging = app ? getMessaging(app) : null;

export const firebaseReady = Boolean(
  app &&
  firebaseConfig.apiKey &&
  firebaseConfig.authDomain &&
  firebaseConfig.projectId &&
  firebaseConfig.messagingSenderId &&
  firebaseConfig.appId &&
  firebaseConfig.vapidKey
);

export async function registerDeviceToken(serviceWorkerRegistration) {
  if (!firebaseReady || !('Notification' in window) || !messaging || !firebaseConfig.vapidKey) return null;

  if (!serviceWorkerRegistration) {
    console.error('FCM device registration requires a Firebase service worker.');
    return null;
  }

  const permission = Notification.permission === 'default'
    ? await Notification.requestPermission()
    : Notification.permission;
  if (permission !== 'granted') return null;

  try {
    const token = await getToken(messaging, {
      vapidKey: firebaseConfig.vapidKey,
      serviceWorkerRegistration,
    });
    return token || null;
  } catch (error) {
    console.error('Failed to register FCM token:', error);
    return null;
  }
}

export async function revokeDeviceToken() {
  if (!firebaseReady || !messaging) return false;

  try {
    const currentToken = await getToken(messaging, { vapidKey: firebaseConfig.vapidKey });
    if (currentToken) {
      await deleteToken(messaging);
    }
    return true;
  } catch (error) {
    console.error('Failed to revoke FCM token:', error);
    return false;
  }
}

export function listenForForegroundMessages(callback) {
  if (!firebaseReady || !messaging) return undefined;

  return onMessage(messaging, (payload) => {
    callback?.(payload);
  });
}

export default app;
