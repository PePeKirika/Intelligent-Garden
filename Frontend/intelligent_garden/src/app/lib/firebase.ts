import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyDwtWZoYqI0IP-pYbD6tQh00kAw3bjxP3E",
    authDomain: "embeded-7133f.firebaseapp.com",
    databaseURL: "https://embeded-7133f-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "embeded-7133f",
    storageBucket: "embeded-7133f.firebasestorage.app",
    messagingSenderId: "745177536234",
    appId: "1:745177536234:web:d262da8f34f0239a12a993",
    measurementId: "G-BQDV23KK7B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };