import './Board.css'
import moveSound from '../../assets/move.wav';
import { Chess } from 'chess.js';
import { useState, useEffect } from 'react';
import { Chessboard } from 'react-chessboard';

function Board({socket, username, room, team, game, setGame}: any) {
    const [lastMove, setLastMove] = useState();
    const teamChar = team[0]

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

    }, [lastMove])

    useEffect(() => {
        socket.on("broadcastMove", (data: any) => {
            makeMove(data.move)
            playSound(moveSound);
            console.log("move received!!!")
        });

        return () => {
            socket.off("broadcastMove");
        }
    }, [socket, game])

    function playSound(sound: any) {
        new Audio(sound).play();
    }

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
        <div id='board' className='board'>
            <Chessboard 
                position={game.fen()}   
                onPieceDrop={onDrop} 
                boardOrientation={team} 
                isDraggablePiece={({ piece }) => piece[0] === teamChar}/>
        </div>
    );
   
}

export default Board;