pragma circom 2.1.6;

include "./node_modules/circomlib/circuits/comparators.circom";

template AssertIsZeroOneOrTwo(){
    signal input in;
    signal isCounterZeroOrOne;
    isCounterZeroOrOne <== (in - 0) * (in - 1);
    isCounterZeroOrOne * (in - 2) === 0;
}

template ConnectFour() {
    // private input signal representing the board
    signal input board[6][7];
    // winner of the game, either 1 or 2.
    signal input winner;
    // array of arrays with the indexes of the four consecutive counters
    signal input coordinates[4][2];
    // intermediate signal for the number of winners
    signal numWinners;
    // intermediate signal for the winner after checking the board
    signal checkedWinner;
    // intermediate signal for the indexes of the four consecutive counters after 
    // checking the board
    signal checkedWinningCoordinates[4][2];
    // assert all counters are either 0, 1 or 2
    for (var row = 0; row < 6; row++) {
		for (var col = 0; col < 7; col++) {
            AssertIsZeroOneOrTwo()(board[row][col]);
        }
    }
    // variable with the indexes of the four consecutive counters
    var checkedWinningCoordinatesVar[4][2];
    // array to hold isEqual components to compare counter values horizontally
    component isHorizEqual[6][4][4];
    // variable that will track the amount of winner combinations in horizontal orientation
    var horizontalWinner = 0;
    for (var row = 0; row < 6; row++) {
		for (var col = 0; col < 4; col++) {
            // check if in row col and col + 1 are equal
            isHorizEqual[row][col][0] = IsEqual();
            isHorizEqual[row][col][0].in[0] <== board[row][col];
            isHorizEqual[row][col][0].in[1] <== board[row][col + 1];
            // check if in row col + 1 and col + 2 are equal
            isHorizEqual[row][col][1] = IsEqual();
            isHorizEqual[row][col][1].in[0] <== board[row][col + 1];
            isHorizEqual[row][col][1].in[1] <== board[row][col + 2];
            // check if in row col + 2 and col + 3 are equal
            isHorizEqual[row][col][2] = IsEqual();
            isHorizEqual[row][col][2].in[0] <== board[row][col + 2];
            isHorizEqual[row][col][2].in[1] <== board[row][col + 3];
            // check if board[row][col + 3] is 0
            isHorizEqual[row][col][3] = IsEqual();
            isHorizEqual[row][col][3].in[0] <== board[row][col + 3];
            isHorizEqual[row][col][3].in[1] <== 0;
            // add 1 to horizontalWinner if there is a winner
            if ((isHorizEqual[row][col][0].out + isHorizEqual[row][col][1].out + isHorizEqual[row][col][2].out) == 3 && isHorizEqual[row][col][3].out == 0) {
                // we cannot assert inside an if statement since constraints would depend on 
                // the value of a condition and it can be unknown during the constraint 
                // generation phase, nor assign since signals are fixed so they can only be
                // assigned once.
                horizontalWinner += 1;
                checkedWinningCoordinatesVar[0] = [row, col];
                checkedWinningCoordinatesVar[1] = [row, col + 1];
                checkedWinningCoordinatesVar[2] = [row, col + 2];
                checkedWinningCoordinatesVar[3] = [row, col + 3];
            }
        }
    }
    // array to hold isEqual components to compare counter values vertically
    component isVerticalEqual[3][7][4];
    // variable that will track the amount of winner combinations in vertical orientation
    var verticalWinner = 0;
    for (var col = 0; col < 7; col++) {
		for (var row = 0; row < 3; row++) {
            // check if in col row and row + 1 are equal
            isVerticalEqual[row][col][0] = IsEqual();
            isVerticalEqual[row][col][0].in[0] <== board[row][col];
            isVerticalEqual[row][col][0].in[1] <== board[row + 1][col];
            // check if in col row + 1 and row + 2 are equal
            isVerticalEqual[row][col][1] = IsEqual();
            isVerticalEqual[row][col][1].in[0] <== board[row + 1][col];
            isVerticalEqual[row][col][1].in[1] <== board[row + 2][col];
            // check if in col row + 2 and row + 3 are equal
            isVerticalEqual[row][col][2] = IsEqual();
            isVerticalEqual[row][col][2].in[0] <== board[row + 2][col];
            isVerticalEqual[row][col][2].in[1] <== board[row + 3][col];
            // check if board[row + 3][col] is 0
            isVerticalEqual[row][col][3] = IsEqual();
            isVerticalEqual[row][col][3].in[0] <== board[row + 3][col];
            isVerticalEqual[row][col][3].in[1] <== 0;
            // add 1 to verticalWinner if there is a winner
            if ((isVerticalEqual[row][col][0].out + isVerticalEqual[row][col][1].out + isVerticalEqual[row][col][2].out) == 3 && isVerticalEqual[row][col][3].out == 0) {
                verticalWinner += 1;
                checkedWinningCoordinatesVar[0] = [row, col];
                checkedWinningCoordinatesVar[1] = [row + 1, col];
                checkedWinningCoordinatesVar[2] = [row + 2, col];
                checkedWinningCoordinatesVar[3] = [row + 3, col];
            }
        }
    }
    // array to hold isEqual components to compare counter values diagonally
    component isDiagonalEqual[3][4][4];
    // variable that will track the amount of winner combinations in diagonal orientation
    var diagonalWinner = 0;
	for (var row = 3; row < 6; row++) {
        for (var col = 0; col < 4; col++) {
            // check if in col row and row + 1 are equal
            isDiagonalEqual[row - 3][col][0] = IsEqual();
            isDiagonalEqual[row - 3][col][0].in[0] <== board[row][col];
            isDiagonalEqual[row - 3][col][0].in[1] <== board[row - 1][col + 1];
            // check if in col row + 1 and row + 2 are equal
            isDiagonalEqual[row - 3][col][1] = IsEqual();
            isDiagonalEqual[row - 3][col][1].in[0] <== board[row - 1][col + 1];
            isDiagonalEqual[row - 3][col][1].in[1] <== board[row - 2][col + 2];
            // check if in col row + 2 and row + 3 are equal
            isDiagonalEqual[row - 3][col][2] = IsEqual();
            isDiagonalEqual[row - 3][col][2].in[0] <== board[row - 2][col + 2];
            isDiagonalEqual[row - 3][col][2].in[1] <== board[row - 3][col + 3];
            // check if board[row + 3][col] is 0
            isDiagonalEqual[row - 3][col][3] = IsEqual();
            isDiagonalEqual[row - 3][col][3].in[0] <== board[row - 3][col + 3];
            isDiagonalEqual[row - 3][col][3].in[1] <== 0;
            // add 1 to diagonalWinner if there is a winner
            if ((isDiagonalEqual[row - 3][col][0].out + isDiagonalEqual[row - 3][col][1].out + isDiagonalEqual[row - 3][col][2].out) == 3 && isDiagonalEqual[row - 3][col][3].out == 0) {
                diagonalWinner += 1;
                checkedWinningCoordinatesVar[0] = [row, col];
                checkedWinningCoordinatesVar[1] = [row - 1, col + 1];
                checkedWinningCoordinatesVar[2] = [row - 2, col + 2];
                checkedWinningCoordinatesVar[3] = [row - 3, col + 3];
            }
        }
    }
    // array to hold isEqual components to compare counter values anti-diagonally
    component isAntiDiagonalEqual[3][4][4];
    // variable that will track the amount of winner combinations in anti-diagonal orientation
    var antiDiagonalWinner = 0;
	for (var row = 0; row < 3; row++) {
        for (var col = 0; col < 4; col++) {
            // check if in col row and row + 1 are equal
            isAntiDiagonalEqual[row][col][0] = IsEqual();
            isAntiDiagonalEqual[row][col][0].in[0] <== board[row][col];
            isAntiDiagonalEqual[row][col][0].in[1] <== board[row + 1][col + 1];
            // check if in col row + 1 and row + 2 are equal
            isAntiDiagonalEqual[row][col][1] = IsEqual();
            isAntiDiagonalEqual[row][col][1].in[0] <== board[row + 1][col + 1];
            isAntiDiagonalEqual[row][col][1].in[1] <== board[row + 2][col + 2];
            // check if in col row + 2 and row + 3 are equal
            isAntiDiagonalEqual[row][col][2] = IsEqual();
            isAntiDiagonalEqual[row][col][2].in[0] <== board[row + 2][col + 2];
            isAntiDiagonalEqual[row][col][2].in[1] <== board[row + 3][col + 3];
            // check if board[row + 3][col] is 0
            isAntiDiagonalEqual[row][col][3] = IsEqual();
            isAntiDiagonalEqual[row][col][3].in[0] <== board[row + 3][col + 3];
            isAntiDiagonalEqual[row][col][3].in[1] <== 0;
            // add 1 to antiDiagonalWinner if there is a winner
            if ((isAntiDiagonalEqual[row][col][0].out + isAntiDiagonalEqual[row][col][1].out + isAntiDiagonalEqual[row][col][2].out) == 3 && isAntiDiagonalEqual[row][col][3].out == 0) {
                antiDiagonalWinner += 1;
                checkedWinningCoordinatesVar[0] = [row, col];
                checkedWinningCoordinatesVar[1] = [row + 1, col + 1];
                checkedWinningCoordinatesVar[2] = [row + 2, col + 2];
                checkedWinningCoordinatesVar[3] = [row + 3, col + 3];
            }
        }
    }
    // assert there is only one winner
    component isThereOnlyOneWinner = IsEqual();
    numWinners <-- horizontalWinner + verticalWinner + diagonalWinner + antiDiagonalWinner;
    isThereOnlyOneWinner.in[0] <== numWinners;
    isThereOnlyOneWinner.in[1] <== 1;
    isThereOnlyOneWinner.out === 1;
    // assert the winner matches the given winner
    component isCheckedWinnerEqualToWinner = IsEqual();
    // since we have already constrained all values of the board at any index of 
    // checkedWinningCoordinatesVar to be the same, we can assign any of the values of board 
    // at a given index of the four consecutive counters to checkedWinner
    checkedWinner <-- board[checkedWinningCoordinatesVar[0][0]][checkedWinningCoordinatesVar[0][1]];
    isCheckedWinnerEqualToWinner.in[0] <== checkedWinner;
    isCheckedWinnerEqualToWinner.in[1] <== winner;
    isCheckedWinnerEqualToWinner.out === 1;
    // assert the indexes of the four consecutive counters match the given indexes in the input
    component areCoordinatesEqual[4][2];
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 2; j++) {
            areCoordinatesEqual[i][j] = IsEqual();
            checkedWinningCoordinates[i][j] <-- checkedWinningCoordinatesVar[i][j];
            areCoordinatesEqual[i][j].in[0] <== coordinates[i][j];
            areCoordinatesEqual[i][j].in[1] <== checkedWinningCoordinates[i][j];
            areCoordinatesEqual[i][j].out === 1;
        }
    }
}

component main = ConnectFour();
