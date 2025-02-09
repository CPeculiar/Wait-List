import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center p-4">
      <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-600 mb-6">
        Page Not Found
      </h2>
      <p className="text-gray-500 mb-8">
        The page you are looking for does not exist.
      </p>
      <Link to={`/`}>
        <button className="px-6 py-3 bg-yellow-500  text-white rounded-lg shadow-lg hover:bg-blue-700 transition duration-300">
          Click here to go back to Home
        </button>
      </Link>
    </div>
  );
};

export default NotFound;
