'use client'
import { useRouter } from "next/navigation"
import x from '@/style/app.module.css';
import y from '@/style/appuser.module.css';
import AppTable from '../../../components/app.table';
import Button from 'react-bootstrap/Button'
const VotenowUser = () => {
    const router = useRouter()

    const handleBtn = () => {
        router.push("/")
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black-100 p-4">
            <h1 className={x['red']}>Votenow User</h1>
            <Button 
                onClick={handleBtn} 
                variant="primary"
            >
                Back to Home
            </Button>

        
        </div>
    ) 
}

export default VotenowUser;
