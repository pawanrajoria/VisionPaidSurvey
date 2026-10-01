// Registered before Firebase's own handler so a tapped notification opens the page the
// admin linked ("url" in the message data). Without a url Firebase's default applies.
self.addEventListener('notificationclick', (event) => {
  const data = (event.notification && event.notification.data && event.notification.data.FCM_MSG
    && event.notification.data.FCM_MSG.data) || {};
  if (!data.url) return;

  event.stopImmediatePropagation();
  event.notification.close();

  const target = new URL(data.url, self.location.origin).href;
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      for (const client of list) {
        // An open tab knows the visitor's language and navigates itself.
        if ('focus' in client) {
          client.postMessage({ type: 'notification-click', url: data.url });
          return client.focus();
        }
      }
      return self.clients.openWindow(target);
    })
  );
});

importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBs6AtPBpCdFwQWRdJC0gWvuz6nFxHL-I4",
  projectId: "visionpaidsurvey",
  messagingSenderId: "988754056043",
  appId: "1:988754056043:web:91671c3ff865fcdc48b22e",
});

const messaging = firebase.messaging();
