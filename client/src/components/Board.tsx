import './Board.css'
import { Chess } from 'chess.js';
import { useState, useEffect } from 'react';
import { Chessboard } from 'react-chessboard';

export default function Board({socket, username, room, team}: any) {
    const [game, setGame] = useState(new Chess());
    const teamChar = team[0]

    const sendMove = async (move: any) => {
        if (game.turn() === teamChar) {
            const gameData = {
                room: room,
                player: username,
                move: move
            };

            await socket.emit("send_move", gameData);
        }
    };

    useEffect(() => {
        socket.on("received_move", (data: any) => {
            makeOpponentMove(data.move)
        });
    }, [socket, game])

    function makeAMove(move: any) {   
        try {
            if (game.turn() === teamChar) {
                const gameCopy = Object.create(game);
                const result = gameCopy.move(move);
                setGame(gameCopy)
                return result;
            } else {
                return false;
            }
        } catch {
            return false;
        }   
             
    }
    
    function makeOpponentMove(move: any) {
        try {
            if (game.turn() !== teamChar) {
                const gameCopy = Object.create(game);
                const result = gameCopy.move(move);
                setGame(gameCopy)
                return result;
            } else {
                return false;
            }
        } catch {
            return false;
        }   
    }

    function onDrop(sourceSquare: any, targetSquare: any) {
        const move = makeAMove({
            from: sourceSquare,
            to: targetSquare
        });

        // Move is invalid
        if (move === null) return false;
        
        // Move is valid
        sendMove(move);
        return true;
    }
    return (
        <div id='board'>
            <Chessboard position={game.fen()} onPieceDrop={onDrop} boardOrientation={team}/>
        </div>
    );
    

    
}