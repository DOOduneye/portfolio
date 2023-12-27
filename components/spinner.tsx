import { Loader } from 'lucide-react';

const Spinner = () => {
    return (
        <div className='flex flex-col justify-center items-center h-screen'>
            <div className='w-8 h-8 flex items-center justify-center animate-spin'>
                <Loader />
            </div>
        </div>
    );
}

export default Spinner;