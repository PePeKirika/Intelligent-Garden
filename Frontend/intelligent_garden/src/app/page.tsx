'use client'
import { database } from "../app/lib/firebase";
import { ref, set, onValue, child } from "firebase/database";
import { useState, useEffect } from "react";
import { appendData } from "../app/lib/google-sheets.action";


const Home = () => {
  const [humidity, setHumidity] = useState<number|null>(null);
  const [light, setLight] = useState<number|null>(null);
  const [temperature, setTemperature] = useState<number|null>(null);
  const [timestamp, setTimestamp] = useState<string>("--");
  const [pots, setPots] = useState<Array<any>>([]);


  // Read data from Firebase
  useEffect(() => {
    const messageRef = ref(database, "garden_database");
    onValue(messageRef, (snapshot) => {
      const data = snapshot.val();
      if (data && data.timestamp !== timestamp) {
        setHumidity(data.humidity);
        setLight(data.light);
        setTemperature(data.temperature);
        setTimestamp(new Date(data.timestamp).toLocaleString());
        setPots(data.pots);
      }
    });
  }, []);

const handleOnSheetDataClick = async () => {
  if (humidity && light && temperature && timestamp && pots) {
    try {
      pots.map(async (pot: any, index: any) => {
        const pumpState = pot.pump ? "ON" : "OFF";
        await appendData(humidity,light,pot.soil_moisture,temperature,pumpState,timestamp,index);
        console.log(index);
      })
      alert("Data written to Google Sheets!");
    } catch (error) {
      console.error("Error writing data:", error);
    }
  }
};

  return (
    <main className="font-sans bg-gradient-to-br from-indigo-900 via-red-700 to-yellow-400 text-gray-800 min-h-screen leading-relaxed antialiased overflow-x-hidden">
      <div id="particles-js" className="fixed top-0 left-0 w-full h-full z-10"></div>

      <div className="content relative z-20 p-5 flex flex-col items-center min-h-screen">
        <div id="main-system" className="w-full text-center">
          <h1 className="mb-8 text-white text-4xl font-bold text-shadow-md">
            Intelligent Garden
          </h1>

          <div className="text-white" id="timestamp">
            <h2 className="text-xl">
              Timestamp <i className="fas fa-clock"></i>
            </h2>
            <p><span id="timestamp-value">{timestamp ?? '--'}</span></p>
          </div>

          <div id="sensor-data" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-4xl mx-auto">
            <div className="card flex flex-col justify-center items-center p-5 rounded-full bg-white bg-opacity-90 backdrop-blur-lg shadow-lg transform transition-transform duration-300">
              <h2 className="text-xl text-gray-800 font-bold mb-4 flex items-center gap-2">
                Air Humidity <i className="fas fa-wind text-blue-500"></i>
              </h2>
              <p className="text-2xl text-gray-600 font-semibold">
                <span id="humidity">{humidity ?? '--'}</span>
              </p>
            </div>

            <div className="card flex flex-col justify-center items-center p-5 rounded-full bg-white bg-opacity-90 backdrop-blur-lg shadow-lg transform transition-transform duration-300">
              <h2 className="text-xl text-gray-800 font-bold mb-4 flex items-center gap-2">
                Light <i className="fas fa-lightbulb text-yellow-400"></i>
              </h2>
              <p className="text-2xl text-gray-600 font-semibold">
                <span id="light">{light ?? '--'}</span>
              </p>
            </div>

            <div className="card flex flex-col justify-center items-center p-5 rounded-full bg-white bg-opacity-90 backdrop-blur-lg shadow-lg transform transition-transform duration-300">
              <h2 className="text-xl text-gray-800 font-bold mb-4 flex items-center gap-2">
                Temperature <i className="fas fa-thermometer-half text-red-500"></i>
              </h2>
              <p className="text-2xl text-gray-600 font-semibold">
                <span id="temperature">{temperature ?? '--'}</span>
              </p>
            </div>
          </div>
        </div>

        <div id="pots-section" className="mt-12 w-[50%] flex flex-col items-center">
          {pots.map((pot, index) => (
            <div className="pot w-full mb-6 " key={`pot-${index}`}>
              <div className="bg-white bg-opacity-90 rounded-[48px] shadow-lg p-5 text-center">
                <h2 className="text-2xl font-bold mb-4">Pot {index}</h2>

                <div className="card flex flex-col justify-center items-center p-5 rounded-full bg-white bg-opacity-90 backdrop-blur-lg shadow-lg transform transition-transform duration-300 mx-20">
                  <h2 className="text-lg font-semibold text-green-500">
                    Soil Moisture <i className="fas fa-seedling"></i>
                  </h2>
                  <p className="text-xl text-gray-600 font-semibold">
                    <span id={`soilMoisture_${index}`}>{pot.soil_moisture}</span>
                  </p>
                </div>

                <div className="card flex flex-col justify-center items-center p-5 rounded-full bg-white bg-opacity-90 backdrop-blur-lg shadow-lg transform transition-transform duration-300 mt-4 mx-20">
                  <h2 className="text-lg font-semibold text-blue-500">
                    Pump State <i className="fas fa-pump"></i>
                  </h2>
                  <p className="text-xl text-gray-600 font-semibold">
                    <span id={`pump_${index}`}>{pot.pump ? "ON" : "OFF"}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          className="mt-8 p-4 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 focus:outline-none"
          onClick={handleOnSheetDataClick}
        >
          Save to Google Sheet
        </button>
      </div>
    </main>


  );
};

export default Home;