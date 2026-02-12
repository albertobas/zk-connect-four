import { Checkbox } from 'ui';
import type { Dispatch, SetStateAction } from 'react';
import checkboxStyles from '../styles/modules/checkbox.module.css';
import { useAppSelector } from '../hooks';
import { connectFourSelector } from '../state';
import styles from './turn-indicator.module.css';

type Player = 'User' | 'AI';

interface TurnIndicatorProps {
  player1: Player;
  player2: Player;
  isSlow?: boolean;
  setIsSlow?: Dispatch<SetStateAction<boolean>>;
}

function TurnIndicator({
  player1,
  player2,
  isSlow,
  setIsSlow
}: TurnIndicatorProps): JSX.Element {
  const { status, turn } = useAppSelector(connectFourSelector);

  const isPlayer1Turn = status === 'PLAYING' && turn === '1';
  const isPlayer2Turn = status === 'PLAYING' && turn === '2';
  const showCheckbox =
    typeof isSlow !== 'undefined' && typeof setIsSlow !== 'undefined';

  return (
    <div className={styles.turnFlex}>
      <div
        className={
          isPlayer1Turn ? `${styles.isTurn} ${styles.player}` : styles.player
        }
      >
        {player1}
      </div>
      {showCheckbox ? (
        <Checkbox
          className={checkboxStyles.container}
          isChecked={isSlow}
          label="Slow down AI"
          setIsChecked={setIsSlow}
        />
      ) : null}
      <div
        className={
          isPlayer2Turn ? `${styles.isTurn} ${styles.player}` : styles.player
        }
      >
        {player2}
      </div>
    </div>
  );
}

export default TurnIndicator;
