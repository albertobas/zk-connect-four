import { useAppSelector } from '../hooks';
import { connectFourSelector } from '../state';
import type {
  ColorType,
  ConnectFourCoordinates,
  ConnectFourRow
} from '../types/connect-four';
import styles from './row.module.css';
import { Cell } from './cell';

export function Row({
  row,
  rowIndex
}: {
  row: ConnectFourRow;
  rowIndex: number;
}): JSX.Element {
  const { winner } = useAppSelector(connectFourSelector);

  function checkWinnerCell(
    rowIndex_: number,
    colIndex_: number,
    coordinates: ConnectFourCoordinates[]
  ): boolean {
    for (const coords of coordinates) {
      if (rowIndex_ === coords.row && colIndex_ === coords.col) {
        return true;
      }
    }
    return false;
  }

  if (winner !== null) {
    const { coordinates } = winner;

    return (
      <div className={styles.container}>
        {row.map((value, colIndex) => {
          const isWinner = checkWinnerCell(rowIndex, colIndex, coordinates);
          let color: ColorType;
          if (value === '1') {
            color = 'player1';
          } else if (value === '2') {
            color = 'player2';
          } else {
            color = 'empty';
          }

          return (
            <Cell
              colIndex={colIndex}
              color={color}
              isWinner={isWinner}
              key={colIndex}
              rowIndex={rowIndex}
            />
          );
        })}
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {row.map((value, colIndex) => {
        let color: ColorType;
        if (value === '1') {
          color = 'player1';
        } else if (value === '2') {
          color = 'player2';
        } else {
          color = 'empty';
        }

        return (
          <Cell
            colIndex={colIndex}
            color={color}
            key={colIndex}
            rowIndex={rowIndex}
          />
        );
      })}
    </div>
  );
}
