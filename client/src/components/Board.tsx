import './Board.css'
import { Chess } from 'chess.js';
import { useState, useEffect } from 'react';
import { Chessboard } from 'react-chessboard';

export default function Board() {
    const [game, setGame] = useState(new Chess());

    useEffect(() => {
        if (game.turn() === 'b') {
            makeRandomMove()
        }
    }, [game]);

    function makeAMove(move: any) {
        const gameCopy = Object.create(game);
        const result = gameCopy.move(move);
        setGame(gameCopy)
        
        return result;       
    }
    
    function makeRandomMove() {
        const possibleMoves = game.moves();
        if (game.isGameOver() || game.isDraw() || possibleMoves.length === 0)
            return; // exit if the game is over
        const randomIndex = Math.floor(Math.random() * possibleMoves.length);
        makeAMove(possibleMoves[randomIndex]);
    }

    function onDrop(sourceSquare: any, targetSquare: any) {
        const move = makeAMove({
            from: sourceSquare,
            to: targetSquare,
            promotion: "q",
        });

        
        if (move === null) return false;
        return true;
    }
    return (
        <div id='board'>
            <Chessboard position={game.fen()} onPieceDrop={onDrop}/>
        </div>
    );
    

    
}