importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBs6AtPBpCdFwQWRdJC0gWvuz6nFxHL-I4",
  projectId: "visionpaidsurvey",
  messagingSenderId: "988754056043",
  appId: "1:988754056043:web:91671c3ff865fcdc48b22e",
});

const messaging = firebase.messaging();