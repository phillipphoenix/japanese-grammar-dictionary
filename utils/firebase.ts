import firebase from "firebase/app";

// If you enabled Analytics in your project, add the Firebase SDK for Analytics
import "firebase/analytics";

// Add the Firebase products that you want to use
import "firebase/firestore";

/*
Copy/paste your *client-side* Firebase credentials below. 
To get these, go to the Firebase Console > open your project > Gear Icon >
Project Settings > General > Your apps. If you haven't created a web app
already, click the "</>" icon, name your app, and copy/paste the snippet.
Otherwise, go to Firebase SDK Snippet > click the "Config" radio button >
copy/paste.
*/
const firebaseConfig = {
  apiKey: "AIzaSyDTZkKIYD5An1IqNRplx-gKUDhBT8eUsNc",
  authDomain: "japanese-grammar-dictionary.firebaseapp.com",
  projectId: "japanese-grammar-dictionary",
  storageBucket: "japanese-grammar-dictionary.appspot.com",
  messagingSenderId: "495510927999",
  appId: "1:495510927999:web:eb398cd25be50f63c3dd4a",
  measurementId: "G-GVBVS2V9J0",
};

try {
  firebase.initializeApp(firebaseConfig);
} catch (err) {
  if (!/already exists/.test(err.message)) {
    console.error("Firebase initialization error", err.stack);
  }
}

const analytics = firebase.analytics;
export { firebase, analytics };
