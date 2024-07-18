"use client";
import { useRouter } from "next/navigation";
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const VotenowAdmin = () => {
  const router = useRouter();

  const handleBtn = () => {
    router.push("/");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-blue-500 mb-4">Votenow Admin</h1>
      <button
        onClick={handleBtn}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
      >
        Back to Home
      </button>
      <Button variant='primary'>
        Back to Home
      </Button>
    </div>
  );
};

export default VotenowAdmin;
