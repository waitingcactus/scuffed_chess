import React, { useEffect, useState } from "react";
import './App.css';
import { io } from "socket.io-client";
import Board from "./components/Board";
const socket = io("http://localhost:9000");

function App() {
  const [username, setUsername] = useState("")
  const [room, setRoom] = useState("")
  // TEMP TEAM VARIABLE
  const [team, setTeam] = useState("")

  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", room);
    };
  };


  return (
    <div id='app'>
      <h1>Join a game</h1>
      <input
        type="text"
        placeholder="Name..."
        onChange={(event) => {
          setUsername(event.target.value);
        }}
      />
      <input
        type="text"
        placeholder="Room ID..."
        onChange={(event) => {
          setRoom(event.target.value);
        }}
      />
      <input
        type="text"
        placeholder="Team..."
        onChange={(event) => {
          setTeam(event.target.value);
        }}
      />

      <button onClick={joinRoom}>Join a room</button>

      <Board socket={socket} username={username} room={room} team={team}/>
    </div>
  );
}

export default App;
