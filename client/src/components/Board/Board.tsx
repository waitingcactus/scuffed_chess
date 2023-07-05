import './Board.css'
import { Chess } from 'chess.js';
import { useState, useEffect } from 'react';
import { Chessboard } from 'react-chessboard';

export default function Board({socket, username, room, team}: any) {
    const [game, setGame] = useState(new Chess());
    const [lastMove, setLastMove] = useState();
    const teamChar = team[0]

    // Make this function send the game info as well.
    // The server should know what state the game is in.
    // Maybe all the chess rules should in fact be handled by the server
    // This would ensure that moves are only carried out once and that there's only one copy of the game

    useEffect(() => {
        const sendMove = async (move: any) => { 
            if (game.turn() !== teamChar) {
                const gameData = {
                    room: room,
                    player: username,
                    move: move,
                };
    
                await socket.emit("move", gameData);
            }
        };

        sendMove(lastMove);

    }, [game, lastMove])

    useEffect(() => {
        socket.on("broadcastMove", (data: any) => {
            makeMove(data.move)
        });
    }, [socket, game])

    function makeMove(move: any) {   
        try {
            const gameCopy = Object.create(game);
            const result = gameCopy.move(move);
            setGame(gameCopy)
            return result;

        } catch {
            return false;
        }   
             
    }

    function onDrop(sourceSquare: any, targetSquare: any) {
        const move = makeMove({
            from: sourceSquare,
            to: targetSquare
        });

        // Move is invalid
        if (move === null) return false;
        
        // Move is valid
        setLastMove(move);
        return true;
    }
    return (
        <div id='board'>
            <Chessboard 
                position={game.fen()}   
                onPieceDrop={onDrop} 
                boardOrientation={team} 
                isDraggablePiece={({ piece }) => piece[0] === teamChar}/>
        </div>
    );
    

    
}