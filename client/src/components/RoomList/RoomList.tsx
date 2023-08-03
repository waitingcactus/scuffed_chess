import './RoomList.css'
import { useEffect, useState } from 'react'

export default function RoomList({ socket, username }: any) {
    const [rooms, setRooms] = useState([]);
    const [chosenRoom, setChosenRoom] = useState();

    useEffect(() => {
        socket.on("roomsList", (roomsList: any) =>{
          setRooms(roomsList);
        })

        return () => {
            socket.off("roomsList");
        }
      }, [socket])

    function _handleChange(event: any) {
        setChosenRoom(event.target.value);
    }

    function joinRoom() {
        if (chosenRoom) {
            socket.emit('sendJoinRequest', [username, chosenRoom]);
        }
    }

    function leaveRoom() {
        socket.emit('leaveRoom', username)
    }

    return (
        <div className='roomlist-window'>
            <div className='roomlist-header'>
                <p>Rooms</p>
            </div>
            <div className='roomlist-body'>
                <select size={5} onChange={_handleChange}>
                    {rooms.length > 0 &&
                        rooms.map((name: any) => (name !== username) ? <option key={name} value={name} >{name}'s room</option> : null)}
                </select>
            </div>
            <div className='roomlist-buttons'>
                <button id='joinbutton' onClick={joinRoom}>Join</button>
                <button id='leavebutton' onClick={leaveRoom}>Leave</button>
            </div>
            
        </div>
    )
}