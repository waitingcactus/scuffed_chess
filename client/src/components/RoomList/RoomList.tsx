import { useEffect, useState } from 'react'

export default function RoomList({ socket, username }: any) {
    const [rooms, setRooms] = useState([]);
    const [chosenRoom, setChosenRoom] = useState();

    useEffect(() => {
        socket.on("roomsList", (roomsList: any) =>{
          setRooms(roomsList);
        })
      }, [socket])

    function _handleChange(event: any) {
        setChosenRoom(event.target.value);
    }

    function joinRoom() {
        if (chosenRoom) {
            socket.emit('sendJoinRequest', [username, chosenRoom]);
        }
    }

    return (
        <div id='roomlist'>
            <select name="rooms" size={5} onChange={_handleChange}>
                {rooms.length > 0 &&
                    rooms.map((name: any) => (name !== username) ? <option key={name} value={name} >{name}'s room</option> : null)}
            </select>
            <button onClick={joinRoom}>Join</button>
        </div>
    )
}