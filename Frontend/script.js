import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js';
import { getDatabase, ref, onValue } from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDwtWZoYqI0IP-pYbD6tQh00kAw3bjxP3E",
    authDomain: "embeded-7133f.firebaseapp.com",
    databaseURL: "https://embeded-7133f-default-rtdb.asia-southeast1.firebasedatabase.app/",
    projectId: "embeded-7133f",
    storageBucket: "embeded-7133f.firebasestorage.app",
    messagingSenderId: "745177536234",
    appId: "1:745177536234:web:d262da8f34f0239a12a993",
    measurementId: "G-BQDV23KK7B"
  };
  

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Utility function to safely update DOM elements
function updateElementById(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = value;
    } else {
        console.warn(`Element with ID "${id}" not found.`);
    }
}


// Function to convert timestamp to readable date and time
function formatTimestamp(timestamp) {
    const date = new Date(parseInt(timestamp));
    console.log(timestamp);
    return date.toLocaleString();
}


// Reference to plant1 data and listen for changes
const plant1Ref = ref(db, 'garden_database');
onValue(plant1Ref, (snapshot) => {
    try {
        const data = snapshot.val();
        if (!data) {
            console.error("No data available for 'plant1'");
            return;
        }

        console.log("Fetched data:", data); // Debugging: log the data

        // Update the data on the page
        updateElementById('humidity', `${data.humidity}%`);
        updateElementById('light', `${data.light} lx`);
        updateElementById('temperature', `${data.temperature}°C`);
        updateElementById('soilMoisture', `${100 - data.soil_moisture}%`);
        updateElementById('pump', data.pump ? 'ON' : 'OFF');
        updateElementById('timestamp', formatTimestamp(data.timestamp));
    } catch (error) {
        console.error("Error updating data:", error); // Debugging: log errors
    }
});


