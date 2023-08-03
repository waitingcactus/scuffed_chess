import React, { useEffect, useState } from "react";
import startSound from './assets/start.wav';
import './App.css';
import { io } from "socket.io-client";
import { Chess } from "chess.js";
import Board from "./components/Board/Board";
import RoomList from "./components/RoomList/RoomList";
import Chat from "./components/Chat/Chat";
const socket = io("http://localhost:9000");

function App() {
  const [username, setUsername] = useState("")
  const [showGame, setShowGame] = useState(false);
  const [myRoom, setMyRoom] = useState("");
  const [team, setTeam] = useState('white');
  const [game, setGame] = useState(new Chess());
  const [messageList, setMessageList] = useState<any>([]);

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

    return () => {
      socket.off("roomId");
    }
  }, [socket])

  useEffect(() => {
    socket.on("leftRoom", (room) => {
      window.alert("You left the room")
      setMessageList([]);
      setMyRoom(room);
      setTeam('white');
      setGame(new Chess());
    });

    return () => {
      socket.off("leftRoom");
    }
  }, [socket])

  useEffect(() => {
    socket.on("otherPlayerLeft", () => {
      window.alert("Opponent left the room")
      setMessageList([]);
      setGame(new Chess());
    });

    return () => {
      socket.off("otherPlayerLeft");
    }
  }, [socket])

  useEffect(() => {
    socket.on("sendJoinRequest", (sendingUser) => {
      var confirm = window.confirm(`Join request from ${sendingUser}, would you like to accept?`)
      if(confirm) {
        socket.emit("joinRequestAnswer", true, sendingUser);
        setTeam('white');
        setGame(new Chess());
      }
      else {
        socket.emit("joinRequestAnswer", false, sendingUser);
      }
    })

    return () => {
      socket.off("sendJoinRequest");
    }
  }, [socket])

  useEffect(() => {
    socket.on("joinRoom", (room, host) => {
      window.alert(`Joined ${host}'s room`);
      setMyRoom(room);
      socket.emit("joinRoom", room);
      setTeam('black');
      setGame(new Chess());
      console.log("joined game")
      playSound(startSound);
    })
    
    return () => {
      socket.off("joinRoom");
    }
  }, [socket])

  useEffect(() => {
    socket.on("nameError", (message) => {
      window.alert(message);
    })
    
    return () => {
      socket.off("nameError");
    }
  }, [socket])

  function playSound(sound: any) {
    new Audio(sound).play();
  }


  return (
    <div id='app'>
      {!showGame ? (
        <div id='namebox'>
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
      <div className="row">
        <RoomList socket = {socket} username = {username}/>
        <Board socket = {socket} username = {username} room = {myRoom} team = {team} game = {game} setGame = {setGame}/>
        <Chat socket = {socket} username = {username} messageList = {messageList} setMessageList = {setMessageList}/>
      </div>
      )}
    </div>
  );
}

export default App;
