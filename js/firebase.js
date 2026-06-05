import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
  getFirestore
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

import {
  getAuth
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyClsiPTt8xaAr4S3LsFviyX7LG0O7kUAJE",
  authDomain: "four-nations-news.firebaseapp.com",
  projectId: "four-nations-news",
  storageBucket: "four-nations-news.firebasestorage.app",
  messagingSenderId: "33675560882",
  appId: "1:33675560882:web:a9f8e1824bdbe9465006ab"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
