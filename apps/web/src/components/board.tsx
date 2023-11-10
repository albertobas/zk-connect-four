import { useAppSelector } from '../hooks';
import { connectFourSelector } from '../state';
import styles from './board.module.css';
import { Row } from './row';

export function Board(): JSX.Element {
  const { board } = useAppSelector(connectFourSelector);

  return (
    <div className={styles.boardContainer}>
      <div className={styles.board}>
        {board.map((row, index) => (
          <Row key={index} row={row} rowIndex={index} />
        ))}
      </div>
    </div>
  );
}
