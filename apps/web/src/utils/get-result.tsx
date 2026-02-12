import {
  type ConnectFourMode,
  type ConnectFourStatus,
  type ConnectFourWinner
} from '../types/connect-four';

/**
 * Gets a JSX paragraph with the result of the game.
 * @param status - A ConnectFourStatus object.
 * @param winner - A ConnectFourWinner object or null.
 * @param mode - A ConnectFourMode object or null.
 * @returns A JSX paragraph with the result of the game.
 */
export function getResult(
  status: ConnectFourStatus,
  winner: ConnectFourWinner | null,
  mode: ConnectFourMode | null
): JSX.Element {
  if (status === 'GAME_OVER') {
    if (winner !== null) {
      const { player } = winner;
      if (mode === 'userVsAI') {
        return (
          <p>
            The game is over, <b>{player === '1' ? 'User' : 'AI'}</b> has won.
          </p>
        );
      } else if (mode === 'aIVsUser') {
        return (
          <p>
            The game is over, <b>{player === '1' ? 'AI' : 'User'}</b> has won.
          </p>
        );
      }
      return (
        <p>
          The game is over, <b>{player === '1' ? 'User 1' : 'User 2'}</b> has
          won.
        </p>
      );
    }
    return <p>There has been a tie.</p>;
  }
  return <p>The game is still in play.</p>;
}
