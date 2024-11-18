'use client'
import { database } from "../app/lib/firebase";
import { ref, set, onValue, child } from "firebase/database";
import { useState, useEffect } from "react";

const Home = () => {
  const [message, setMessage] = useState("");
  const [firebaseMessage, setFirebaseMessage] = useState<string>('test');

  // Write data to Firebase
  // const writeData = async () => {
  //   try {
  //     await set(ref(database, "message"), {
  //       text: message,
  //     });
  //     alert("Data written to Firebase!");
  //     setMessage("");
  //   } catch (error) {
  //     console.error("Error writing data:", error);
  //   }
  // };

  // Read data from Firebase
  useEffect(() => {
    const messageRef = ref(database, "test/string");
    onValue(messageRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setFirebaseMessage(data);
      }
      console.log(data);
    });
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Firebase with Next.js</h1>

      {/* <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          value={message}
          placeholder="Enter a message"
          onChange={(e) => setMessage(e.target.value)}
          style={{
            padding: "10px",
            fontSize: "16px",
            width: "300px",
            marginRight: "10px",
          }}
        />
        <button
          onClick={writeData}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "#0070f3",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Submit
        </button>
      </div> */}

      <h2>Message from Firebase:</h2>
      <p style={{ fontSize: "18px" }}>{firebaseMessage}</p>
    </div>
  );
};

export default Home;
