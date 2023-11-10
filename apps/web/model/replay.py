import random
from collections import deque, namedtuple
import numpy as np


Transition = namedtuple('Transition',
                        ('state', 'action', 'next_state', 'reward'))


class ExperienceReplay(object):

    def __init__(self, maxlen: int,  batch_size: int) -> None:
        self.transitions: deque = deque([], maxlen=maxlen)
        self.batch_size = batch_size

    def push(self, *args: np.ndarray | float | int | None) -> None:
        """
        Appends a transition in memory.

        Args:
            - tuple with a state array, action array, next state array and
            reward array.
        """
        self.transitions.append(Transition(*args))

    def recall(self) -> list:
        """
        Samples and returns a random batch of size `batch_size`.
        Args:
            - `batch_size`: the size of the batch to sample.

        Returns:
            - the sampled batch.
        """
        return random.sample(self.transitions, self.batch_size)

    def __len__(self):
        return len(self.transitions)
