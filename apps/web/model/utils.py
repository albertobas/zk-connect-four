import numpy as np
import pandas as pd
import torch
import torch.nn as nn
from typing import List


def get_actions(policy: nn.Module, observations: list, device: torch.device) -> List:
    """
    Gets the policy `policy` to predict actions on `boards`.

    Args:
        - `policy`: the policy used to predict actions.
        - `observations`: list of board observations.
        - `device`: torch device.

    Returns:
        - List with all the predicted actions.
    """
    actions = []
    for observation in observations:
        valid_actions = []
        for col in np.arange(len(observation[0]), dtype=np.int8):
            for row in range(0, len(observation)):
                if observation[row][col] == 0:
                    valid_actions.append(col)
                    break

        action_pred = _get_action(
            policy=policy,
            observation=observation,
            valid_actions=valid_actions,
            device=device
        )
        actions.append(action_pred)

    return actions


def get_html(policy: nn.Module, observations: np.ndarray, titles: list, device: torch.device) -> str:
    """
    Generates HTML code of the Pandas dataframes of the transitions brought by the `policy`
    considering initial states in `boards`.

    Args:
        - `policy`: the policy used to predict actions.
        - `observations`: list of board observations.
        - `titles`: list of titles of the transitions.
        - `device`: torch device.

    Returns:
        - String with the HTML code.
    """
    html = '<div style="display: flex; flex-direction: row; flex-wrap: wrap; justify-content: center">'
    for observation, title in zip(observations, titles):
        valid_actions = []
        for col in np.arange(len(observation), dtype=np.int8):
            for row in range(0, len(observation)):
                if observation[row][col] == 0:
                    valid_actions.append(col)
                    break

        action_pred = _get_action(
            policy=policy,
            observation=observation,
            valid_actions=valid_actions,
            device=device
        )
        next_board = _update_board(
            observation=observation,
            col_index=action_pred.item()
        )
        html += _get_frames_html(
            dfs=[_frame_board(observation), next_board],
            title=title,
            df_titles=["t", "t+1"]
        )

    html += '</div>'
    return html


def get_two_channels(observation: np.ndarray) -> np.ndarray:
    """
    Applies a transformation on the observation to obtain an array with binary values for each 
    player from an array with values 0, 1 or 2.

    Args:
    - `observation`: observation of the environment.

    Returns:
        - Array with both dimensions stacked.
    """
    p1_batch = observation.copy()
    p2_batch = observation.copy()
    p1_batch[p1_batch == 2] = 0
    p2_batch[p2_batch == 1] = 0
    p2_batch[p2_batch == 2] = 1
    return np.stack(
        arrays=(p1_batch, p2_batch),
        axis=1
    )


def moving_average(x: list | np.ndarray, n: int) -> np.ndarray:
    """
    Calculate moving average of `x` with a window of `n`.

    Args:
        - `x`: list or array with the values.
        - `n`: window of the moving average.

    Returns:
        - Array with the averaged values.
    """
    cumsum = np.cumsum(np.insert(x, 0, 0))
    return (cumsum[n:] - cumsum[:-n]) / float(n)


def _frame_board(observation: np.ndarray) -> pd.DataFrame:
    """
    Generate a Connect Four-like Pandas dataframe from an observation.

    Args:
        - `observation`: observation of the environment.

    Returns:
        - Pandas dataframe of the Connect Four board.
    """
    board = observation.copy()
    rendered_board = board.astype(str)
    rendered_board[board == 0] = ' '
    rendered_board[board == 1] = 'O'
    rendered_board[board == 2] = 'X'
    return pd.DataFrame(rendered_board)


def _get_action(policy: nn.Module, observation: np.ndarray, valid_actions: list, device: torch.device) -> np.intp:
    """
    Predicts an action on `observation` using `policy` end enforce it is valid.

    Args:
        - `policy`: the policy used to predict actions.
        - `observation`: observation of the environment.
        - `valid_actions`: set of valid actions.
        - `device`: torch device.

    Returns:
        - Predicted action.
    """
    with torch.no_grad():
        two_channel_tensor = torch.tensor(
            data=get_two_channels(observation=np.expand_dims(observation, 0)),
            dtype=torch.float,
            device=device
        )
        output = policy(two_channel_tensor).squeeze().cpu().numpy()
        # only outputs in valid actions can be considered
        all_actions = np.arange(len(observation[0]))
        valid_action_mask = [
            action in valid_actions for action in all_actions]
    return np.argmax(output == np.max(output[valid_action_mask]))


def _get_frames_html(dfs: List[pd.DataFrame], title: str, df_titles: list) -> str:
    """
    Generates HTML code of a Pandas dataframe.

    Args:
        - `policy`: the policy used to predict actions.
        - `title`: title of the transition.
        - `df_titles`: list of titles of the dataframes.

    Returns:
        - String with the HTML code.
    """
    html = '<div style="display: flex; flex-direction: column; align-items: center; padding: 0 5px; margin: 0 10px 30px">'
    html += f'<h4 style="font-size:18px; font-weight:600; margin-bottom: 0px">{title}</h4>'
    html += '<div style="display: flex; flex-direction: row; flex-wrap: wrap; width: 100%; justify-content: center">'
    for df, df_title in zip(dfs, df_titles):
        html += '<div style="padding: 0 5px; margin: 0 10px">'
        html += f'<h5 style="text-align: center; font-size: 17px; font-weight: 400; margin:10px 0px">{df_title}</h5>'
        html += str(df.to_html())
        html += '</div>'
    html += '</div>'
    html += '</div>'
    return html


def _update_board(observation: np.ndarray, col_index: int) -> pd.DataFrame:
    """
    Updates the board with the new counter in `col_index` and enerates a Connect 
    Four-like styled Pandas dataframe from it.

    Args:
        - `observation`: observation of the environment.
        - `col_index`: column index, i.e. action to be taken.

    Returns:
        - Pandas dataframe of the updated board.
    """
    board = observation.copy()
    player = 1 if np.sum([observation != 0]) % 2 == 0 else 2
    row_index = np.sum([board[:, col_index] == 0]) - 1
    board[row_index, col_index] = player
    # current version of pandas stubs' Styler does not index attribute map yet
    return _frame_board(board).style.map(  # type: ignore
        lambda x: 'color: royalblue',
        subset=pd.IndexSlice[row_index, col_index]
    )
