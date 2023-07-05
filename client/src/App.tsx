import React, { useEffect, useState } from "react";
import './App.css';
import { io } from "socket.io-client";
import Board from "./components/Board/Board";
import RoomList from "./components/RoomList/RoomList";
import { send } from "process";
const socket = io("http://localhost:9000");

function App() {
  const [username, setUsername] = useState("")
  const [showGame, setShowGame] = useState(false);
  const [myRoom, setMyRoom] = useState();
  const [team, setTeam] = useState('white');
  
  

  const sendName = () => {
    if (username !== "") {
      socket.emit("sendName", username)
    }
  };

  useEffect(() => {
    socket.on("roomId", (room) => {
      setShowGame(true);
      setMyRoom(room);
    });
  
    socket.on("sendJoinRequest", (sendingUser) => {
      var confirm = window.confirm(`Join request from ${sendingUser}, would you like to accept?`)
      if(confirm) {
        socket.emit("joinRequestAnswer", true, sendingUser);
        setTeam('white');
      }
      else {
        socket.emit("joinRequestAnswer", false, sendingUser);
      }
    })

    socket.on("joinRoom", (room, host) => {
      window.alert(`Joined ${host}'s room`);
      setMyRoom(room);
      socket.emit("joinRoom", room);
      setTeam('black');
    })
  }, [socket])
  



  return (
    <div id='app'>
      {!showGame ? (
        <div>
          <h1>Enter display name</h1>
          <input
            type="text"
            placeholder="Name..."
            onChange={(event) => {
              setUsername(event.target.value);
            }}
          />

          <button onClick={sendName}>Confirm</button>
        </div>
      ) : (
      <div>
        <RoomList socket = {socket} username = {username}/>
        <Board socket = {socket} username = {username} room = {myRoom} team = {team}/>
      </div>
      )}
    </div>
  );
}

export default App;
