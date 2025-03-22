"use client";

import React, { useState, useEffect } from "react";
import Navbar from "../components/navbar";
import { jwtDecode } from "jwt-decode";

const App = () => {
  const [userId, setUserId] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");

      if (token) {
        const user = jwtDecode(token).sub;
        setUserId(user);
      }
    }
  }, []);

  const getProfile = async () => {
    console.log(userId)
    try {
      const response = await fetch("http://localhost:4000/api/auth/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }

      const data = await response.json();
      console.log(data)
      setUser(data.data[0]); 
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  useEffect(() => {
    if (userId) {
      getProfile();
    }
  }, [userId]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-white">
      <Navbar />
      <div className="bg-white p-8 rounded-3xl shadow-2xl w-[480px] border-4 border-green-500">
        {user ? (
          <div className="flex flex-col items-center">
            <img
              src={user.profilePicture || "https://cdn2.iconfinder.com/data/icons/random-outline-3/48/random_14-512.png"}
              alt="Profile"
              className="rounded-full w-32 h-32 object-cover mb-6 border-4 border-green-600"
            />
            
            {/* Basic Info */}
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold text-green-700 mb-2">{user.name}</h1>
              <p className="text-gray-600 text-lg">{user.email}</p>
              <p className="text-gray-500 text-md">{user.age} years old</p>
              <p className="text-gray-800 text-sm mt-4 px-4">{user.bio}</p>
            </div>

            {/* Financial Stats */}
            <div className="w-full grid grid-cols-2 gap-4 mb-6">
              <div className="bg-green-50 p-4 rounded-xl text-center">
                <p className="text-gray-600 text-sm">Monthly Income</p>
                <p className="text-green-600 text-xl font-bold">
                  ${user.income?.toLocaleString() || '0'}
                </p>
              </div>
              <div className="bg-red-50 p-4 rounded-xl text-center">
                <p className="text-gray-600 text-sm">Monthly Expenses</p>
                <p className="text-red-600 text-xl font-bold">
                  ${user.expenses?.toLocaleString() || '0'}
                </p>
              </div>
            </div>

            {/* Balance Card */}
            <div className="w-full bg-gray-50 p-4 rounded-xl text-center mb-6">
              <p className="text-gray-600 text-sm">Net Balance</p>
              <p className={`text-xl font-bold ${(user.income - user.expenses) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${((user.income || 0) - (user.expenses || 0)).toLocaleString()}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-600">Loading profile data...</p>
        )}
      </div>
    </div>
  );
};

export default App;
