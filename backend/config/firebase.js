const { cert, getApps, initializeApp } = require("firebase-admin/app");
const { getMessaging } = require("firebase-admin/messaging");
const path = require("path");
const fs = require("fs");

let serviceAccount = null;
const jsonFilePath = path.join(__dirname, "firebase-service-account.json");

if (fs.existsSync(jsonFilePath)) {
  try {
    serviceAccount = require(jsonFilePath);
  } catch (err) {
    console.error("Failed to load firebase-service-account.json:", err.message);
  }
} else if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
  try {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
  } catch (err) {
    console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT_JSON:", err.message);
  }
} else if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
  serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  };
}

let messaging = null;
let initialized = false;

try {
  if (serviceAccount) {
    const app = getApps().length
      ? getApps()[0]
      : initializeApp({
          credential: cert(serviceAccount),
        });
    messaging = getMessaging(app);
    initialized = true;
    console.log("Firebase Admin initialized successfully for push notifications.");
  } else {
    console.warn("Firebase Admin credentials not found. Device push notifications disabled.");
  }
} catch (initError) {
  console.error("Firebase Admin initialization error:", initError.message);
}

const admin = {
  messaging: () => ({
    sendEachForMulticast: (message) => messaging ? messaging.sendEachForMulticast(message) : Promise.resolve({ successCount: 0, failureCount: 0, responses: [] }),
    sendToTopic: (topic, message) => messaging ? messaging.send({ ...message, topic }) : Promise.resolve(),
  }),
};

module.exports = {
  admin,
  messaging,
  initialized,
};