import { useAppDispatch, useAppSelector } from '../hooks';
import { connectFourSelector, setMode, setStatus } from '../state';
import { dictMode } from '../constants';
import { useChainChange } from '../hooks/use-chain-change';
import styles from './application.module.css';
import connectStyles from './connect-disconnect.module.css';
import { ConnectDisconnect } from './connect-disconnect';
import { ConnectFour } from './connect-four';
import { Footer } from './footer';

export function Application(): React.JSX.Element {
  useChainChange();
  const dispatch = useAppDispatch();
  const { status, mode } = useAppSelector(connectFourSelector);

  function handlePlayButton(): void {
    dispatch(setStatus('playing'));
  }

  function handleSelect(e: React.ChangeEvent<HTMLSelectElement>): void {
    e.preventDefault();
    if (e.target.value === 'userVsAI') {
      dispatch(setMode('userVsAI'));
    } else if (e.target.value === 'aIVsUser') {
      dispatch(setMode('aIVsUser'));
    } else if (e.target.value === 'userVsUser') {
      dispatch(setMode('userVsUser'));
    } else {
      dispatch(setMode(null));
    }
  }

  return (
    <main>
      <div className={styles.main}>
        <ConnectDisconnect className={connectStyles.container} />
        <h1>zk Connect Four</h1>
        {status !== 'start' && mode !== null ? (
          <ConnectFour mode={mode} />
        ) : (
          <>
            <div className={styles.container}>
              <select onChange={handleSelect}>
                <option value="">Choose a mode</option>
                <option value="userVsAI">{dictMode.userVsAI}</option>
                <option value="aIVsUser">{dictMode.aIVsUser}</option>
                <option value="userVsUser">{dictMode.userVsUser}</option>
              </select>
            </div>
            <button
              disabled={mode === null}
              onClick={handlePlayButton}
              type="button"
            >
              Play
            </button>
          </>
        )}
        <Footer />
      </div>
    </main>
  );
}
