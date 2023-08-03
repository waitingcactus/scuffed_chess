import { useEffect, useState, useRef } from 'react';
import "./Chat.css"

export default function Chat({socket, username, messageList, setMessageList}: any) {
    const [currentMessage, setCurrentMessage] = useState("");
    const messagesEndRef = useRef<any>(null);

    useEffect(() => {
        socket.on("broadcastMessage", (messageData: any) => {
            console.log("message received");
            updateMessageList(messageData)
        });

        return () => {
            socket.off("broadcastMessage");
        }
    }, [socket])

    useEffect(() => {
        const dummy = messagesEndRef.current;
        if (dummy) {
            dummy.scrollIntoView();
        }
    }, [messageList])

    function sendMessage() {
        if (currentMessage !== "")
        {
            const messageData = {
                sender: username,
                message: currentMessage,
                time:
                    new Date(Date.now()).getHours() +
                    ":" + 
                    new Date(Date.now()).getMinutes(),
            };
            socket.emit("sendMessage", messageData);
            updateMessageList(messageData)
            
            setCurrentMessage("");
                
        }
    }

    function updateMessageList(messageData: any) {
        setMessageList((list: any) => [ ...list, messageData]);   
    }

    return (
        <div className="chat-window">
            <div className="chat-header">
                <p>Chat</p>
            </div>
            <div className="chat-body">
                <div className="message-container">
                    {messageList.map((messageContent: any, index: any) => {
                        return (
                            <div
                                className="message"
                                id={username === messageContent.sender ? "you" : "other"}
                                key={index}
                                ref={(index === (messageList.length-1)) ? messagesEndRef : null}
                            >
                                <div>
                                    <div className="message-content">
                                        <p>{messageContent.message}</p>
                                    </div>
                                    <div className="message-meta">
                                        <p id="time">{messageContent.time}</p>
                                        <p id="author">{messageContent.sender}</p>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

            </div>
            <div className="chat-footer">
                <input id="message-box" type="text" 
                    value={currentMessage}
                    onChange={(event) => {
                        setCurrentMessage(event.target.value);
                    }}
                    onKeyDown={(event) => {
                        event.key === "Enter" && sendMessage();
                    }}
                />
                <button onClick={sendMessage}>&#9658;</button>
            </div>
        </div>
    )
}