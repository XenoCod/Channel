import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyAvse1er2_x6OBMNBsdmiV8cqa_0S3m2p0",
  authDomain: "whatsapp-x-1411f.firebaseapp.com",
  projectId: "whatsapp-x-1411f",
  storageBucket: "whatsapp-x-1411f.appspot.com",
  messagingSenderId: "122642217881",
  appId: "1:122642217881:web:b669c76e0328200f3cf108",
};

const app = !firebase.apps.length
  ? firebase.initializeApp(firebaseConfig)
  : firebase.app();

const db = app.firestore(); //Initiliaze the database of firestore
const auth = app.auth(); //Initiliaze the authication
const provider = new firebase.auth.GoogleAuthProvider(); //Intiliaze the provider for authentincation

export { db, auth, provider };
