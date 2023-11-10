import Head from 'next/head';
import Modal from 'react-modal';
import { Application, Providers } from '../components';
import 'react-toastify/dist/ReactToastify.min.css';

Modal.setAppElement('#main');

export default function Home(): JSX.Element {
  return (
    <Providers>
      <Head>
        <title>zk Connect Four</title>
        <meta
          content="Application capable of generating and validating zero-knowledge proofs in the context of the Connect Four game in order to demonstrate to a verifier that a prover has information about the game without having to reveal it."
          name="description"
        />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <meta content="zk Connect Four" name="og:title" />
        <meta
          content="Application capable of generating and validating zero-knowledge proofs in the context of the Connect Four game in order to demonstrate to a verifier that a prover has information about the game without having to reveal it."
          name="og:description"
        />
        <meta content="website" name="og:type" />
        <meta content="en" name="og:locale" />
        <meta content="https://zk-connect-four.vercel.app" name="og:url" />
        <link href="https://zk-connect-four.vercel.app" rel="canonical" />
      </Head>
      <main id="main">
        <Application />
      </main>
    </Providers>
  );
}
