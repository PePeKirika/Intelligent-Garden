'use client'
import { database } from "./components/firebase";
import { ref, set, onValue, child } from "firebase/database";
import { useState, useEffect } from "react";
import { appendData } from "./components/google-sheets.action";
import SpeechToText from "./components/speech-to-text";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import '@fortawesome/fontawesome-svg-core/styles.css'
import { faSave } from "@fortawesome/free-solid-svg-icons";


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
        await appendData(humidity,light,pot.soil_moisture,temperature,pumpState,timestamp,index.toString());
        console.log(index);
      })
      alert("Data written to Google Sheets!");
    } catch (error) {
      console.error("Error writing data:", error);
    }
  }
};

const handleSpeechToText = (text : string) => {
  if (text.toLocaleLowerCase().includes("ight") || text.includes("แสง")) {
    textToSpeech("The light value is " + light + "lux");
    alert("The light value is " + light + " lx");
  } else if(text.toLocaleLowerCase().includes("temperature") || text.includes("อุณหภูมิ")) {
    textToSpeech("The temperature is " + temperature + "degrees Celsius");
    alert("The temperature is " + temperature + "°C");
  } else if(text.toLocaleLowerCase().includes("time") || text.includes("เวลา")) {
    textToSpeech("The timestamp is " + timestamp);
    alert("The timestamp is " + timestamp);
  } else if (text.toLocaleLowerCase().includes("soil") || text.toLocaleLowerCase().includes("moisture") || text.includes("ดิน")) {
    textToSpeech(`The soil moisture value of pot 1 is ${100 - pots[1].soil_moisture} percent`);
    alert(`The soil moisture value of pot 1 is ${100 - pots[1].soil_moisture}%`);
  } else if (text.toLocaleLowerCase().includes("pump") || text.includes("ปั๊ม")) {
    textToSpeech(`The pump state of pot 1 is ${pots[1].pump ? "ON" : "OFF"}`);
    alert(`The pump state of pot 1 is ${pots[1].pump ? "ON" : "OFF"}`);
  } else if(text.toLocaleLowerCase().includes("humidity") || text.includes("ชื้น")) {
    textToSpeech("The humidity is " + humidity + "percent");
    alert("The humidity is " + humidity + "%");
  } else {
    alert("Sorry, I didn't get that. Please try again.");
  }
}

const textToSpeech = (text : string) => {
  const synth = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance(text);
  synth.speak(utterance);
}

  return (
    <main className="font-sans bg-gradient-to-br from-indigo-900 via-red-700 to-yellow-400 text-gray-800 min-h-screen leading-relaxed antialiased overflow-x-hidden">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" />
      <div id="particles-js" className="fixed top-0 left-0 w-full h-full z-10"></div>

      <div className="content relative z-20 p-5 flex flex-col items-center min-h-screen">
        
        
      <SpeechToText handleSpeechToText = {handleSpeechToText}/>
        <div id="main-system" className="w-full text-center">
          <h1 className="mb-8 mt-5 text-white text-6xl font-bold text-shadow-md">
            Intelligent Garden
          </h1>

          <div className="text-white mb-4" id="timestamp">
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
                <span id="humidity">{humidity ?? '--'}%</span>
              </p>
            </div>

            <div className="card flex flex-col justify-center items-center p-5 rounded-full bg-white bg-opacity-90 backdrop-blur-lg shadow-lg transform transition-transform duration-300">
              <h2 className="text-xl text-gray-800 font-bold mb-4 flex items-center gap-2">
                Light <i className="fas fa-lightbulb text-yellow-400"></i>
              </h2>
              <p className="text-2xl text-gray-600 font-semibold">
                <span id="light">{light ?? '--'} lx</span>
              </p>
            </div>

            <div className="card flex flex-col justify-center items-center p-5 rounded-full bg-white bg-opacity-90 backdrop-blur-lg shadow-lg transform transition-transform duration-300">
              <h2 className="text-xl text-gray-800 font-bold mb-4 flex items-center gap-2">
                Temperature <i className="fas fa-thermometer-half text-red-500"></i>
              </h2>
              <p className="text-2xl text-gray-600 font-semibold">
                <span id="temperature">{temperature ?? '--'}°C</span>
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
                    <span id={`soilMoisture_${index}`}>{100 - pot.soil_moisture}%</span>
                  </p>
                </div>

                <div className="card flex flex-col justify-center items-center p-5 rounded-full bg-white bg-opacity-90 backdrop-blur-lg shadow-lg transform transition-transform duration-300 mt-4 mx-20">
                  <h2 className="text-lg font-semibold text-blue-500">
                    Pump State
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
          className="mt-8 p-4 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 focus:outline-none w-fit-content flex items-center gap-2"
          onClick={handleOnSheetDataClick}>
            <p >Save to Google Sheet</p>
            <FontAwesomeIcon icon={faSave}/>
        </button>

      </div>
    </main>


  );
};

export default Home;