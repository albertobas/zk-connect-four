import { useAI, useGameOver } from '../hooks';
import styles from './board.module.css';
import { Board } from './board';
import TurnIndicator from './turn-indicator';

export function UserVsAIBoard({
  isAIFirst = false
}: {
  isAIFirst?: boolean;
}): JSX.Element {
  const { isSlow, setIsSlow } = useAI();
  useGameOver();

  const player1 = isAIFirst ? 'AI' : 'User';
  const player2 = !isAIFirst ? 'AI' : 'User';

  return (
    <div className={styles.container}>
      <TurnIndicator
        isSlow={isSlow}
        player1={player1}
        player2={player2}
        setIsSlow={setIsSlow}
      />
      <Board />
    </div>
  );
}
