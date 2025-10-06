import React from 'react';
import { useRouteError, Link } from 'react-router-dom';

// A simple SVG icon for visual feedback
const AlertCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
    </svg>
);

const ErrorPage = () => {
    // useRouteError provides the error object from react-router-dom
    const error = useRouteError();

    let title = "An unexpected error occurred!";
    let message = "We're sorry, something went wrong. Please try again later.";

    // Handle specific HTTP status codes
    if (error.status === 404) {
        title = "404 - Page Not Found";
        message = "Sorry, we couldn't find the page you were looking for.";
    } else if (error.status === 500) {
        title = "500 - Server Error";
        // Safely parse the message from the backend response if it exists
        try {
            const errorData = JSON.parse(error.data);
            if (errorData.message) {
                message = errorData.message;
            }
        } catch (e) {
            // Fallback if error.data is not a valid JSON string
            message = e || "There was a problem with our server. Please try again soon.";
        }
    } else if (error.statusText || error.message) {
        // Handle other potential errors
        message = error.statusText || error.message;
    }

    return (
        <main className="bg-gray-100 min-h-screen flex items-center justify-center">
            <div className="bg-white p-10 rounded-xl shadow-lg text-center max-w-lg mx-auto">
                <div className="flex justify-center mb-4">
                    <AlertCircleIcon />
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{title}</h1>
                <p className="text-gray-600 mb-6">{message}</p>
                <Link
                    to="/"
                    className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-300"
                >
                    Go to Homepage
                </Link>
            </div>
        </main>
    );
};

export default ErrorPage;
