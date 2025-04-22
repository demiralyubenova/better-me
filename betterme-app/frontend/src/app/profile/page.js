"use client";

import React, { useState, useEffect } from "react";
import Navbar from "../components/navbar";
import { jwtDecode } from "jwt-decode";

const App = () => {
  const [userId, setUserId] = useState(null);
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [city, setCity] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");

      if (token) {
        const decodedToken = jwtDecode(token);
        setUserId(decodedToken.sub);
        setEmail(decodedToken.email);
      }
    }
  }, []);

  const getProfile = async () => {
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
      setUser(data.data[0]);
      setDescription(data.data[0]?.description || "");
      setCity(data.data[0]?.location || "");
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const updateDescription = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/auth/update-description", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, description, loccation: city }),
      });

      if (!response.ok) {
        throw new Error("Failed to update description");
      }

      setUser(prevUser => ({
        ...prevUser,
        description,
        location: city,
      }));

    } catch (error) {
      console.error("Error updating description:", error);
    }
    setIsEditing(false);
  };

  useEffect(() => {
    if (userId) {
      getProfile();
    }
  }, [userId]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-white pt-16">
      <Navbar />
      <div className="bg-white p-6 rounded-3xl shadow-2xl w-[480px] h-[750px] border-4 border-green-500 flex flex-col items-cente">
        {user ? (
          <div className="flex flex-col items-center">
            <img
              src={user.profilePicture || "https://cdn2.iconfinder.com/data/icons/random-outline-3/48/random_14-512.png"}
              alt="Profile"
              className="rounded-full w-29 h-29 object-cover mb-6 border-4 border-green-600"
            />
            
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold text-green-700 mb-2">{user.name}</h1>
              <p className="text-gray-600 text-lg font-semibold">{email}</p>
              <p className="text-gray-500 text-md">{user.age} years old</p>
            </div>

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

            <div className="w-full bg-gray-50 p-4 rounded-xl text-center mb-6">
              <p className="text-gray-600 text-sm">Net Balance</p>
              <p className={`text-xl font-bold ${(user.income - user.expenses) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${((user.income || 0) - (user.expenses || 0)).toLocaleString()}
              </p>
            </div>

            <div className="w-full bg-gray-50 p-4 rounded-xl text-center mt-4">
              <p className="text-gray-600 text-sm">City</p>
              {isEditing ? (
                <input
                  className="w-full p-2 border rounded-md text-black"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              ) : (
                <p className="text-black text-md mt-2">{city || "No city provided."}</p>
              )}
              </div>

            <div className="w-full bg-gray-50 p-4 rounded-xl text-center mt-4">
              <p className="text-gray-600 text-sm">Description</p>
              {isEditing ? (
                <textarea
                  className="w-full p-2 border rounded-md text-black"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              ) : (
                <p className="text-black text-md mt-2">{description || "No description provided."}</p>
              )}
              <button
                className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg"
                onClick={() => (isEditing ? updateDescription() : setIsEditing(true))}
              >
                {isEditing ? "Save" : "Edit"}
              </button>
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
