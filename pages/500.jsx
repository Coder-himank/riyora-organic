
import { useEffect } from 'react';

export default function GlobalError({ error, reset }) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <html>
            <body className="flex h-screen items-center justify-center bg-gray-100 text-center">
                <div>
                    <h2 className="text-2xl font-bold mb-4">Something went wrong 😢</h2>
                    <button
                        onClick={() => reset()}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md"
                    >
                        Try again
                    </button>
                </div>
            </body>
        </html>
    );
}
