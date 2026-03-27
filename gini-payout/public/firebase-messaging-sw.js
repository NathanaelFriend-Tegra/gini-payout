importScripts("https://www.gstatic.com/firebasejs/10.0.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.0.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyCs-W21Ua13FEP0YNpAC8klLTUzY3_TCqY",
  authDomain: "gininotifications.firebaseapp.com",
  projectId: "gininotifications",
  storageBucket: "gininotifications.firebasestorage.app",
  messagingSenderId: "358533367354",
  appId: "1:358533367354:web:307d0bfcb9312eac66d703",
});

const messaging = firebase.messaging();

// Handle background notifications
messaging.onBackgroundMessage((payload) => {
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/icon.png",
  });
});