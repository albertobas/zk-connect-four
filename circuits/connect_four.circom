pragma circom 2.1.6;

include "./node_modules/circomlib/circuits/comparators.circom";

template IsZeroOneOrTwo(){
    signal input in;
    signal isZeroOrOne;
    isZeroOrOne <== (in - 0) * (in - 1);
    isZeroOrOne * (in - 2 ) === 0;
}

template CheckLineAndPreExistingWin(r0, c0, r1, c1, r2, c2, r3, c3) {
    signal input cells[4];
    signal input winner;
    signal input lastMove[2];
    signal output isPreExistingWin;

    component isEqual[4];
    signal isWin;
    
    // check all cell values match the winner
    for (var i = 0; i < 3; i++) {
        isEqual[i] = IsEqual();
        isEqual[i].in[0] <== cells[i];
        isEqual[i].in[1] <== cells[i + 1];
    }
    isEqual[3] = IsEqual();
    isEqual[3].in[0] <== cells[0];
    isEqual[3].in[1] <== winner;

    signal inter1 <== isEqual[0].out * isEqual[1].out;
    signal inter2 <== inter1 * isEqual[2].out;
    isWin <== inter2 * isEqual[3].out;

    // check if this specific line contains the lastMove coordinate
    var rows[4] = [r0, r1, r2, r3];
    var cols[4] = [c0, c1, c2, c3];
    
    component isRowMatch[4];
    component isColMatch[4];
    signal cellMatches[4];
    for (var i = 0; i < 4; i++) {
        isRowMatch[i] = IsEqual();
        isRowMatch[i].in[0] <== rows[i];
        isRowMatch[i].in[1] <== lastMove[0];

        isColMatch[i] = IsEqual();
        isColMatch[i].in[0] <== cols[i];
        isColMatch[i].in[1] <== lastMove[1];

        cellMatches[i] <== isRowMatch[i].out * isColMatch[i].out;
    }

    // lineIncludesLastMove is 1 if any cell matches lastMove
    signal lineIncludesLastMove <== cellMatches[0] + cellMatches[1] + cellMatches[2] + cellMatches[3];

    // isPreExistingWin = (isWin) AND (NOT lineIncludesLastMove)
    isPreExistingWin <== isWin * (1 - lineIncludesLastMove);
}

template ConnectFour() {
    // private input signal representing the board
    signal input board[6][7];
    // winner of the game, either 1 or 2
    signal input winner;
    // array of arrays with the indexes of the four consecutive counters
    signal input coordinates[4][2];
    // array with the indexes of the last move
    signal input lastMove[2];

    // 1 - cell value integrity
    component isZeroOneOrTwoCVI[6][7];
    for (var row = 0; row < 6; row++) {
	    for (var col = 0; col < 7; col++) {
            isZeroOneOrTwoCVI[row][col] = IsZeroOneOrTwo();
            isZeroOneOrTwoCVI[row][col].in <== board[row][col];
        }
    }

    // 2 - winner validation
    component isZeroOneOrTwoWV = IsZeroOneOrTwo();
    isZeroOneOrTwoWV.in <== winner;

    // 3 - pre-existing win prevention
    component checkLine[69];
    signal preWinAcc[70];
    preWinAcc[0] <== 0;
    var idx = 0;

    // horizontal check
    for (var row = 0; row < 6; row++) {
        for (var col = 0; col < 4; col++) {
            // pass the line's coordinates to the template so it knows its own position
            checkLine[idx] = CheckLineAndPreExistingWin(row, col, row, col + 1, row, col + 2, row, col + 3);
            checkLine[idx].winner <== winner;
            checkLine[idx].lastMove <== lastMove;

            for(var i = 0; i < 4; i++) {
                checkLine[idx].cells[i] <== board[row][col + i];
            }

            preWinAcc[idx + 1] <== preWinAcc[idx] + checkLine[idx].isPreExistingWin;
            idx++;
        }
    }

    // vertical check
    for (var row = 0; row < 3; row++) {
        for (var col = 0; col < 7; col++) {
            checkLine[idx] = CheckLineAndPreExistingWin(row, col, row + 1, col, row + 2, col, row + 3, col);
            checkLine[idx].winner <== winner;
            checkLine[idx].lastMove <== lastMove;
            for(var i=0; i<4; i++) {
                checkLine[idx].cells[i] <== board[row + i][col];
            }
            
            preWinAcc[idx + 1] <== preWinAcc[idx] + checkLine[idx].isPreExistingWin;
            idx++;
            
        }
    }

    // diagonal check
    for (var row = 3; row < 6; row++) {
        for (var col = 0; col < 4; col++) {
            checkLine[idx] = CheckLineAndPreExistingWin(row, col, row - 1, col + 1, row - 2, col + 2, row - 3, col + 3);
            checkLine[idx].winner <== winner;
            checkLine[idx].lastMove <== lastMove;
            for(var i=0; i<4; i++) {
                checkLine[idx].cells[i] <== board[row - i][col + i];
            }
            
            preWinAcc[idx + 1] <== preWinAcc[idx] + checkLine[idx].isPreExistingWin;
            idx++;
        }
    }

    // check diagonal combinations
    component isAntiDiagonalWinLine[3][4];
    for (var row = 0; row < 3; row++) {
        for (var col = 0; col < 4; col++) {
            checkLine[idx] = CheckLineAndPreExistingWin(row, col, row + 1, col + 1, row + 2, col + 2, row + 3, col + 3);
            checkLine[idx].winner <== winner;
            checkLine[idx].lastMove <== lastMove;
            for(var i=0; i<4; i++) {
                checkLine[idx].cells[i] <== board[row + i][col + i];
            }
            preWinAcc[idx + 1] <== preWinAcc[idx] + checkLine[idx].isPreExistingWin;
            idx++;
        }
    }
    // if there were no winning lines before the last piece was placed preWinAcc[idx] will be 0
    preWinAcc[idx] === 0;

    // 4 - valid piece count (turn order)
    component isP1[6][7];
    component isP2[6][7];
    signal p1Acc[43];
    signal p2Acc[43];
    p1Acc[0] <== 0;
    p2Acc[0] <== 0;
    for (var row = 0; row < 6; row++) {
        for (var col = 0; col < 7; col++) {
            var idx = row * 7 + col;

            // check if cell is 1
            isP1[row][col] = IsEqual();
            isP1[row][col].in[0] <== board[row][col]; 
            isP1[row][col].in[1] <== 1;
            p1Acc[idx + 1] <== p1Acc[idx] + isP1[row][col].out;

            // check if cell is 2
            isP2[row][col] = IsEqual();
            isP2[row][col].in[0] <== board[row][col];
            isP2[row][col].in[1] <== 2; 
            p2Acc[idx + 1] <== p2Acc[idx] + isP2[row][col].out;
        }
    }
    // (p1 - p2) must be 0 or 1
    signal countDiff <== p1Acc[42] - p2Acc[42];
    countDiff * (countDiff - 1) === 0;

    // if draw, board must be full.
    component isDraw = IsZero();
    isDraw.in <== winner;
    signal isWinner <== 1 - isDraw.out;
    isDraw.out * (p1Acc[42] + p2Acc[42] - 42) === 0;

    // 5 - winning coordinates verification
    component isRow[4][6][7];
    component isCol[4][6][7];
    signal doCoordMatch[4][6][7];
    signal legalCoordAcc[4][43];
    signal interWCV[4][6][7];
    for (var i = 0; i < 4; i++) {
        legalCoordAcc[i][0] <== 0;
        for (var row = 0; row < 6; row++) {
            for (var col = 0; col < 7; col++) {
                var idx = row * 7 + col;
                isRow[i][row][col] = IsEqual();
                isRow[i][row][col].in[0] <== row;
                isRow[i][row][col].in[1] <== coordinates[i][0];

                isCol[i][row][col] = IsEqual();
                isCol[i][row][col].in[0] <== col;
                isCol[i][row][col].in[1] <== coordinates[i][1];

                doCoordMatch[i][row][col] <== isRow[i][row][col].out * isCol[i][row][col].out;
                interWCV[i][row][col] <== isWinner * (board[row][col] - winner);
                interWCV[i][row][col] * doCoordMatch[i][row][col] === 0;

                legalCoordAcc[i][idx + 1] <== legalCoordAcc[i][idx] + doCoordMatch[i][row][col];
            }
        }
        // if coordinate is out of bounds the accumulator will be 0
        legalCoordAcc[i][42] === 1;
    }

    // 6 - straight line continuity
    signal deltaRow[3];
    signal deltaCol[3];
    for (var i = 0; i < 3; i++) {
        deltaRow[i] <== coordinates[i + 1][0] - coordinates[i][0];
        deltaCol[i] <== coordinates[i + 1][1] - coordinates[i][1];
    }

    // ensure direction is consistent if there is a winner
    isWinner * (deltaRow[0] - deltaRow[1]) === 0;
    isWinner * (deltaRow[1] - deltaRow[2]) === 0;
    isWinner * (deltaCol[0] - deltaCol[1]) === 0;
    isWinner * (deltaCol[1] - deltaCol[2]) === 0;

    // ensure the step (deltaRow, deltaCol) is a valid direction {-1, 0, 1} if there is a winner
    signal isRowZeroOrOneSLC <== (deltaRow[0] + 1) * (deltaRow[0]);
    signal isRowZeroOneOrMOneSLC <== isRowZeroOrOneSLC * (deltaRow[0] - 1);
    isWinner * isRowZeroOneOrMOneSLC === 0;
    signal isColZeroOrOneSLC <== (deltaCol[0] + 1) * (deltaCol[0]);
    signal isColZeroOneOrMOneSLC <== isColZeroOrOneSLC * (deltaCol[0] - 1);
    isWinner * isRowZeroOneOrMOneSLC === 0;

    // ensure it's not a (0,0) step if there's a winner
    signal deltaRow2 <== deltaRow[0] * deltaRow[0];
    signal deltaCol2 <== deltaCol[0] * deltaCol[0];
    signal stepSize <== deltaRow2 + deltaCol2;
    // ensure deltaRow^2 + deltaCol^2 is 1 (straight) or 2 (diagonal)
    signal stepSizeInter <== (stepSize - 1) * (stepSize - 2);
    isWinner * stepSizeInter === 0;

    // 7 - gravity check (no flying pieces)
    component isEmpty[5][7];
    component isBelowEmpty[5][7];
    for (var row = 0; row < 5; row++) {
        for (var col = 0; col < 7; col++) {
            isEmpty[row][col] = IsZero();
            isEmpty[row][col].in <== board[row][col];
            isBelowEmpty[row][col] = IsZero();
            isBelowEmpty[row][col].in <== board[row + 1][col];
            // if the cell has a value, its cell below must not be empty
            (1 - isEmpty[row][col].out) * isBelowEmpty[row][col].out === 0;
        }
    }

    // 8 - last move validation
    component isLastMoveRow[6][7];
    component isLastMoveCol[6][7];
    signal doesLastMoveMatch[6][7];
    signal inter1LMV[6][7];
    signal inter2LMV[6][7];
    signal nonOOBLastMoveAcc[43];
    nonOOBLastMoveAcc[0] <== 0;

    component isWinnerP1 = IsEqual();
    isWinnerP1.in[0] <== winner;
    isWinnerP1.in[1] <== 1;

    component isWinnerP2 = IsEqual();
    isWinnerP2.in[0] <== winner;
    isWinnerP2.in[1] <== 2;

    for (var row = 0; row < 6; row++) {
        for (var col = 0; col < 7; col++) {
            var idx = row * 7 + col;
            isLastMoveRow[row][col] = IsEqual();
            isLastMoveRow[row][col].in[0] <== row;
            isLastMoveRow[row][col].in[1] <== lastMove[0];

            isLastMoveCol[row][col] = IsEqual();
            isLastMoveCol[row][col].in[0] <== col;
            isLastMoveCol[row][col].in[1] <== lastMove[1];

            // check piece belongs to expected player if last move coordinates match indexes
            doesLastMoveMatch[row][col] <== isLastMoveRow[row][col].out * isLastMoveCol[row][col].out;
            // if p1 won board[row][col] must be 1
            inter1LMV[row][col] <== isWinnerP1.out * doesLastMoveMatch[row][col];
            inter1LMV[row][col] * (board[row][col] - 1) === 0;
            // if p2 won or there was a draw, board[row][col] must be 2
            inter2LMV[row][col] <== (isDraw.out + isWinnerP2.out) * doesLastMoveMatch[row][col];
            inter2LMV[row][col] * (board[row][col] - 2) === 0;

            nonOOBLastMoveAcc[idx + 1] <== nonOOBLastMoveAcc[idx] + doesLastMoveMatch[row][col];
        }
    }
    // if coordinate is out of bounds nonOOBLastMoveAcc[i][42] will be 0
    nonOOBLastMoveAcc[42] === 1;

    // 9 - final piece placement integrity
    component isLastMoveEmpty[5][7];
    component isAboveLastMoveEmpty[5][7];
    component isLastMoveRow2[5][7];
    component isLastMoveCol2[5][7];
    signal doesLastMoveMatch2[5][7];
    signal interLastMove[5][7];
    for (var row = 1; row < 6; row++) {
        for (var col = 0; col < 7; col++) {
            isLastMoveEmpty[row -1][col] = IsZero();
            isLastMoveEmpty[row -1][col].in <== board[row -1][col];
            isAboveLastMoveEmpty[row -1][col] = IsZero();
            isAboveLastMoveEmpty[row -1][col].in <== board[row - 1][col];

            isLastMoveRow2[row -1][col] = IsEqual();
            isLastMoveRow2[row -1][col].in[0] <== row;
            isLastMoveRow2[row -1][col].in[1] <== lastMove[0];

            isLastMoveCol2[row -1][col] = IsEqual();
            isLastMoveCol2[row -1][col].in[0] <== col;
            isLastMoveCol2[row -1][col].in[1] <== lastMove[1];

            doesLastMoveMatch2[row -1][col] <== isLastMoveRow2[row -1][col].out * isLastMoveCol2[row -1][col].out;

            // if the last move cell has a value, its cell above must be empty
            interLastMove[row -1][col] <== (1 - isLastMoveEmpty[row -1][col].out) * (isAboveLastMoveEmpty[row -1][col].out - 1);
            interLastMove[row -1][col] * (doesLastMoveMatch2[row -1][col]) === 0;
        }
    }
}

component main = ConnectFour();
