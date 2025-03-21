"use client";

import React, { useState, useEffect } from 'react';
import Navbar from '../components/navbar';

const App = () => {
  const userData = {
    name: "Стефан Стефанов",
    email: "svsst@gmail.com",
    bio: "Програмист с опит в React и Node.js. Обичам да решавам сложни проблеми и да се обучавам постоянно.",
    profilePicture: "https://via.placeholder.com/150"
  };

  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(userData);
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen bg-white">
        <Navbar />
      <div className="bg-white p-8 rounded-3xl shadow-2xl w-96 border-4 border-green-500">
        {user ? (
          <div className="flex flex-col items-center">
            <img
              src={user.profilePicture}
              alt="Profile"
              className="rounded-full w-32 h-32 object-cover mb-6 border-4 border-green-600"
            />
            <div className="text-center">
              <h1 className="text-3xl font-bold text-green-700 mb-2">{user.name}</h1>
              <p className="text-gray-600 text-lg">{user.email}</p>
              <p className="text-gray-800 text-sm mt-4 px-4">{user.bio}</p>
            </div>
            <div className="mt-6 text-center">
              <button className="px-6 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition duration-200">
                Редактирай профила
              </button>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-600">Зареждаме данни...</p>
        )}
      </div>
    </div>
  );
};

export default App;
