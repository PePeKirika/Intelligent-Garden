'use client'
import { database } from "../app/lib/firebase";
import { ref, set, onValue } from "firebase/database";
import { get } from "http";
import { useState, useEffect } from "react";

const FirebaseComponent = () => {
  const [message, setMessage] = useState("");
  const [firebaseMessage, setFirebaseMessage] = useState<string | null>('test');

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
  // useEffect(() => {
  //   const messageRef = ref(database, "test/string");
  //   console.log('messageRef', messageRef);
  //   onValue(messageRef, (snapshot) => {
  //     const data = snapshot.val();
  //     setFirebaseMessage(data ? data.text : "No message found.");
  //     console.log('data', data);
  //   });
  // }, []);
  const dbRef = ref(database);
  get(child(dbRef, `users/${userId}`)).then((snapshot) => {
    if (snapshot.exists()) {
      console.log(snapshot.val());
    } else {
      console.log("No data available");
    };
  }).catch((error) => {
    console.error(error);
  });

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif", color:'White' }}>
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
}

export default FirebaseComponent;