import numpy as np
import torch
from custom_types import ParamsEnv
from typing import List


class ConnectFourEnv:
    def __init__(self, params: ParamsEnv, device: torch.device):
        self.device = device
        self.params = params
        self.board: np.ndarray = np.zeros(
            shape=[params['observation_space'], params['action_space']],
            dtype=np.int8
        )
        self.is_done = False
        self.turn: int = 1
        self.winner: None | int = None

    def get_valid_actions(self) -> List[int]:
        """
        Returns a list with all the valid actions for the current board
        """
        valid_actions = []
        for col in range(self.params['action_space']):
            for row in range(0, len(self.board)):
                if self.board[row][col] == 0:
                    valid_actions.append(col)
                    break
        return valid_actions

    def reset(self) -> np.ndarray:
        """
        Calls self._reset() and returns a copy of the current state
        """
        self._reset()
        return self.board.copy()

    def step(self, action: int) -> tuple[np.ndarray, float, float]:
        """
        Edits the state (it adds a new counter to the board), checks for a winner and for a draw and 
        returns the state and the reward.

        Args:
            - `action`: a valid column index

        Returns:
            - A tuple of numpy arrays with the new state and the reward
        """
        row_index = np.sum([self.board[:, action] == 0]) - 1
        self.board[row_index, action] = self.turn
        self._check_winner()._check_draw()
        reward = self._get_reward()
        return self.board.copy(), reward, float(self.is_done)

    def switch_turn(self) -> None:
        """
        Switches the turn.
        """
        if (self.turn == 1):
            self.turn = 2
        else:
            self.turn = 1

    def _get_reward(self) -> float:
        """
        Returns the obtained reward. It only penalizes rolongations after eight total moves.

        Returns:
            - The reward.
        """
        if (self.is_done):
            if (self.winner is None):  # if draw
                return self.params['rewards']['draw']
            else:  # if win
                return self.params['rewards']['win']
        else:  # do not penalize if players have not played at least 4 times
            return self.params['rewards']['prolongation'] if np.sum([self.board != 0]) > 8 else 0.

    def _check_draw(self) -> None:
        """
        Checks if the board is full, i.e., if the state does not contain any zero.
        If it is, it sets `is_done` to True.
        """
        if (self.winner is None) & (np.sum([self.board == 0]) == 0):
            self.is_done = True

    def _check_winner(self):
        """
        Checks for a combination of four counters aligned either horizontally, vertically diagonally
        or anti-diagonally. If there is one, sets `is_done` to True and `winner` to either 1 or 2 depending
        on whose player the counters are.
        """
        numRows = len(self.board)
        numCols = len(self.board[0])
        # horizontal
        for row in range(0, numRows):
            for col in range(0, numCols - 3):
                self.board[row][col] = self.board[row][col]
                if (self.board[row][col] != 0) & (self.board[row][col] == self.board[row][col + 1]) & \
                        (self.board[row][col + 1] == self.board[row][col + 2]) & (self.board[row][col + 2] == self.board[row][col + 3]):
                    self.is_done = True
                    self.winner = self.turn
        # vertical
        for col in range(0, numCols):
            for row in range(0, numRows - 3):
                self.board[row][col] = self.board[row][col]
                if (self.board[row][col] != 0) & (self.board[row][col] == self.board[row + 1][col]) & \
                        (self.board[row + 1][col] == self.board[row + 2][col]) & (self.board[row + 2][col] == self.board[row + 3][col]):
                    self.is_done = True
                    self.winner = self.turn
        # diagonal
        for row in range(3, numRows):
            for col in range(0, numCols - 3):
                self.board[row][col] = self.board[row][col]
                if (self.board[row][col] != 0) & (self.board[row][col] == self.board[row - 1][col + 1]) & \
                        (self.board[row - 1][col + 1] == self.board[row - 2][col + 2]) & (self.board[row - 2][col + 2] == self.board[row - 3][col + 3]):
                    self.is_done = True
                    self.winner = self.turn
        # anti-diagonal
        for row in range(0, numRows-3):
            for col in range(0, numCols - 3):
                self.board[row][col] = self.board[row][col]
                if (self.board[row][col] != 0) & (self.board[row][col] == self.board[row + 1][col + 1]) & \
                        (self.board[row + 1][col + 1] == self.board[row + 2][col + 2]) & (self.board[row + 2][col + 2] == self.board[row + 3][col + 3]):
                    self.is_done = True
                    self.winner = self.turn
        return self

    def _reset(self) -> None:
        """
        Sets board, is_done flag, turn and winner to their initial state
        """
        self.board = np.zeros(
            shape=[self.params['observation_space'],
                   self.params['action_space']],
            dtype=np.int8
        )
        self.is_done = False
        self.turn = 1
        self.winner = None
