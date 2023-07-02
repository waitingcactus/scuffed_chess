import React, { useEffect, useState } from "react";
import './App.css';
import { io } from "socket.io-client";
import Board from "./components/Board";
//const socket = io("http://localhost:9000");

function App() {
  const [username, setUsername] = useState("")
  const [room, setRoom] = useState("")

  const joinRoom = () => {
    if (username !== "" && room !== "") {
      //socket.emit("join_room", room);
    };
  };


  return (
    <div id='app'>
      <Board/>
    </div>
  );
}

export default App;
