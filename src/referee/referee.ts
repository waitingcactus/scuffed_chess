import { PieceType, TeamType } from "../components/Chessboard/Chessboard";

export default class Referee {
    isValidMove(px: number, py: number, x: number, y: number, type: PieceType, team: TeamType) {

        if (team === TeamType.WHITE) {
            if (type === PieceType.PAWN) {
                if (py === 1) {
                    if (px === x && (y - py === 1 || y - py === 2)) {
                        console.log("valid move")
                        return true;
                    }
                }
                else if (px === x && y - py === 1) {
                    console.log("valid move")
                    return true;
                }
            }
            else {
                if (py === 6) {
                    if (px === x && (y - py === -1 || y - py === -2)) {
                        return true;
                    }
                }
            }
        }
       

        return false;
    }
}