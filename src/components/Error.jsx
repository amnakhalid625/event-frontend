import React from 'react';
import { Link } from 'react-router-dom';
import ErrorImg from '../assets/images/error.svg';

const Error = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-center bg-background px-4">
      <img src={ErrorImg} alt="Page Not Found" className="max-w-md w-full mb-6" />
     
      <Link
        to="/"
        className="px-6 py-2 bg-primary text-white rounded-full transition duration-300"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default Error;
