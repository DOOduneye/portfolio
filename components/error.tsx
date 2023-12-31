export const Error = ({ message }: { message: string }) => {
    return (
        <div className='flex flex-col items-center'>
            <h1 className='text-4xl font-bold'>Error</h1>
            <p className='text-lg'>{message}</p>
        </div>
    );
}