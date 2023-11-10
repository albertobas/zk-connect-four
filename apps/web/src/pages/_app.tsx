import type { AppProps } from 'next/app';
import { Providers, ThemedToastContainer } from '../components';
import '../styles/index.css';

export default function App({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <Providers>
      <Component {...pageProps} />
      <ThemedToastContainer />
    </Providers>
  );
}
