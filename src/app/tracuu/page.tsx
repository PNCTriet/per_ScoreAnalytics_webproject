'use client'
import Head from 'next/head';
import ScoreChecker from '../../../components/ScoreChecker';
import 'bootstrap/dist/css/bootstrap.min.css';


const Home: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <Head>
        <title>Tra cứu điểm</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ScoreChecker />
    </div>
  );
};

export default Home;
