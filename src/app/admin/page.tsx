'use client'
import { useRouter } from "next/navigation"

const VotenowAdmin = () => {
    const router = useRouter()

    const handleBtn = () => {
        router.push("/")
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <h1 className="text-3xl font-bold text-blue-500 mb-4">Votenow Admin</h1>
            <button 
                onClick={handleBtn} 
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
                Back to Home
            </button>
        </div>
    )
}

export default VotenowAdmin;
