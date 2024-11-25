import { useState, useEffect } from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"; 
import { onValue } from "firebase/database";

export default function SpeechToText({handleSpeechToText} : {handleSpeechToText : Function}) {
  const [isListening, setIsListening] = useState<any>(false);
  const [transcript, setTranscript] = useState<any>("");
  const [error, setError] = useState<any>(null);
  const [lang , setLang] = useState<string>("en-US");

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      setError("Your browser does not support Speech Recognition.");
    }
  }, []);

  const startListening = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      setError("Your browser does not support Speech Recognition.");
      return;
    } else {
      setError(null);
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = lang;
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onerror = (event : any) => setError(event.error);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event : any) => {
      const result = event.results[0][0].transcript;
      setTranscript(result);
      handleSpeechToText(result); // Process the text result
      console.log(result);
    };

    recognition.start();
  };

  // const handleAction = (text : any) => {
  //   if (text.toLowerCase().includes("hello")) {
  //     alert("You said hello!");
  //   }
  //   // Add more actions based on recognized speech
  // };

  return (
    <div className="absolute text-center right-5 bg-white p-2 rounded-lg w-[150px]">
      <div className="">
        <button onClick={startListening} disabled={isListening}>
          <p className="mx-2">{isListening ? "Listening..." : "Voice Input"}</p>
          <i className="fa fa-microphone"></i>
        </button>
        {/* {transcript && <p>{transcript}</p>} */}
        {error && <p style={{ color: "red" }}>Error: {error}</p>}
      </div>
      <select name="" id="" value={lang} onChange={(event: React.ChangeEvent<HTMLSelectElement>) => setLang(event.target.value)} className="border-black">
        <option value="en-US" >English</option>
        <option value="th">Thai</option>
      </select>
    </div>
    
  );
}
