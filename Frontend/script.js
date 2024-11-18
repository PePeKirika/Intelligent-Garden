import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js';
import { getDatabase, ref, onValue } from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAm0lVR4SRAn2Roj2cixoVWpt3jjmBiLRY",
    authDomain: "awesomeplantwateringdb.firebaseapp.com",
    databaseURL: "https://awesomeplantwateringdb-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "awesomeplantwateringdb",
    storageBucket: "awesomeplantwateringdb.firebasestorage.app",
    messagingSenderId: "846024263616",
    appId: "1:846024263616:web:21bcd9b9a9b88a38c9aa25",
    measurementId: "G-6Y3X3HPEQD"
  };
  

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Function to format sensor values
function formatValue(value, decimals = 2) {   
    return Number(value).toFixed(decimals);
}

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

// // Reference to plant1 data and listen for changes
// const plant1Ref = ref(db, 'plant1');
// onValue(plant1Ref, (snapshot) => {
//     const data = snapshot.val();
//     if (data) {
//       // Update the data on the page
//       document.getElementById('humidity').textContent = data.humidity + '%';
//       document.getElementById('light').textContent = data.light + ' lx';
//       document.getElementById('temperature').textContent = data.temperature + '°C';
//       document.getElementById('soilMoisture').textContent = data.soil_moisture + '%';
//       document.getElementById('pump').textContent = data.pump ? 'ON' : 'OFF';
//       document.getElementById('timestamp').textContent = formatTimestamp(data.timestamp);
//     }
// })

// Reference to plant1 data and listen for changes
const plant1Ref = ref(db, 'plant1');
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
        updateElementById('soilMoisture', `${100-data.soil_moisture}%`);
        updateElementById('pump', data.pump ? 'ON' : 'OFF');
        updateElementById('timestamp', formatTimestamp(data.timestamp));
    } catch (error) {
        console.error("Error updating data:", error); // Debugging: log errors
    }
});


