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

// Function to convert timestamp to readable date and time
function formatTimestamp(timestamp) {
    const date = new Date(parseInt(timestamp));
    return date.toLocaleString();
}

// Reference to plant1 data and listen for changes
const plant1Ref = ref(db, 'plant1');
onValue(plant1Ref, (snapshot) => {
    const data = snapshot.val();
    if (data) {
        // Update humidity
        const humidityElement = document.getElementById('airHumidityValue');
        if (humidityElement) {
            humidityElement.textContent = formatValue(data.humidity);
        }

        // Update light
        const lightElement = document.getElementById('lightValue');
        if (lightElement) {
            lightElement.textContent = formatValue(data.light);
        }

        // Update soil moisture
        const soilMoistureElement = document.getElementById('soilMoistureValue');
        if (soilMoistureElement) {
            soilMoistureElement.textContent = formatValue(data.soil_moisture);
        }

        // Update temperature
        const temperatureElement = document.getElementById('temperatureValue');
        if (temperatureElement) {
            temperatureElement.textContent = formatValue(data.temperature);
        }

        // Update motor/pump state
        const motorStateElement = document.getElementById('motorState');
        if (motorStateElement) {
            motorStateElement.textContent = data.pump ? 'ON' : 'OFF';
            motorStateElement.style.color = data.pump ? '#4CAF50' : '#ff4444';
        }
    }
});