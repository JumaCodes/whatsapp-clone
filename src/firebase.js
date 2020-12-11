// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import firebase from "firebase";
const firebaseConfig = {
    apiKey: "AIzaSyCU5nNRfFuU0BrMEv1Z2umCNxFWAA0Pb1c",
    authDomain: "whatsapp-clone-b5f29.firebaseapp.com",
    databaseURL: "https://whatsapp-clone-b5f29.firebaseio.com",
    projectId: "whatsapp-clone-b5f29",
    storageBucket: "whatsapp-clone-b5f29.appspot.com",
    messagingSenderId: "689860042156",
    appId: "1:689860042156:web:540571695077c78bd9ee09",
    measurementId: "G-VW9S3WJ8YK"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { auth, provider };
export default db;