import { useGameOver } from '../hooks';
import styles from './board.module.css';
import { Board } from './board';
import TurnIndicator from './turn-indicator';

const player = 'User';

export function UserVsUserBoard(): JSX.Element {
  useGameOver();

  return (
    <div className={styles.container}>
      <TurnIndicator player1={player} player2={player} />
      <Board />
    </div>
  );
}
