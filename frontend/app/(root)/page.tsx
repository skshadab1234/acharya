import React from 'react';
import { Button } from 'antd';

const LandingPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-500 p-4">
      <div className="bg-white p-10 rounded-lg shadow-2xl text-center max-w-lg w-full">
        <img src={'/logo.jpeg'} alt="Company Logo" className="mx-auto mb-8 w-32 h-32 object-contain" />
        <h1 className="text-5xl font-extrabold mb-6 text-gray-800">Welcome Admin</h1>
        <p className="text-xl mb-8 text-gray-600">Choose an option below to proceed:</p>
        
        <div className="flex flex-col">
          <Button
            type="primary"
            href='/admin-login'
            size="large"
            className="flex justify-center items-center mb-4 rounded-full py-3 px-6 bg-blue-600 text-white font-semibold shadow-lg hover:bg-blue-700 transition duration-300"
          >
            Login
          </Button>
          <Button
            type="default"
            size="large"
            className="flex justify-center items-center rounded-full py-3 px-6 bg-gray-200 text-gray-800 font-semibold shadow-lg hover:bg-gray-300 transition duration-300"
          >
            Visit Website
          </Button>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
