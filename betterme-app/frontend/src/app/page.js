'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import Navbar from './components/navbar';

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [friends, setFriends] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  

  useEffect(() => {
    if (localStorage.getItem("shouldReload") === "true") {
      localStorage.removeItem("shouldReload");
    }
  
    const setReloadFlag = () => localStorage.setItem("shouldReload", "true");
  
    window.addEventListener("beforeunload", setReloadFlag);
  
    return () => {
      window.removeEventListener("beforeunload", setReloadFlag);
    };
  }, []);
  

  const handleSearch = (e) => {
    setEmail(e.target.value);
    setSearchResults(
      allUsers.filter(user => user.email.toLowerCase().includes(e.target.value.toLowerCase()))
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar />
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>

      {/* Animated Hero Section */}
      <div className="max-w-5xl mx-auto px-6 py-24 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl font-extrabold text-gray-800 mb-6"
        >
          Master your finances and time today!
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="text-xl text-gray-600 mb-10"
        >
          Interactive lessons, an AI advisor, and productivity tools tailored just for you.
        </motion.p>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
        >
          <Link href="/signup/onboarding">
            <button className="bg-green-600 hover:bg-green-700 text-white py-3 px-8 rounded-full text-lg font-semibold shadow-lg">
              Start now
            </button>
          </Link>
        </motion.div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl text-gray-800 font-semibold mb-2">📚 Learn About Finances</h3>
          <p className="text-gray-600">Study through practical lessons on budgeting, saving, investing, avoiding debt, and managing your money with confidence.</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl text-gray-800 font-semibold mb-2">⏰ Manage Your Time </h3>
          <p className="text-gray-600">Master time management skills with a task calendar, the Pomodoro technique, and effective productivity strategies.</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl text-gray-800 font-semibold mb-2">🤖 AI Assistant</h3>
          <p className="text-gray-600">Get personalized recommendations, financial literacy tips, productivity advice, and answers to your questions from our AI advisor.</p>
        </div>
      </div>
    </div>
  );
}
