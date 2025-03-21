'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [friends, setFriends] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  

  useEffect(() => {
    const shouldReload = localStorage.getItem("shouldReload");
  
    if (shouldReload === "true") {
      localStorage.removeItem("shouldReload");
      window.location.reload();
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

  const handleAddFriend = async (email) => {
    // First, update the state locally
    setFriends([...friends, email]);
    setIsMenuOpen(false); // Close the menu after adding
    setEmail(''); // Clear the search input
  
    // Now, send a POST request to the backend to add the friend
    try {
      const response = await fetch('http://localhost:4000/friend/add-friend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }), // Sending the friend's email as part of the request
      });
  
      if (!response.ok) {
        throw new Error('Failed to add friend');
      }
  
      const data = await response.json();
      console.log('Friend added:', data);
      // You can handle the success case here (e.g., show a success message)
    } catch (error) {
      console.error('Error adding friend:', error);
      // Optionally, handle the error case here (e.g., show an error message)
    }
  };
  

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center relative">
        <div className="text-2xl font-bold text-green-600">BetterMe</div>
        <ul className="flex space-x-6 text-gray-700">
          <li><Link href="/">Beginning</Link></li>
          <li><Link href="/lessons">Lessons and Quizes</Link></li>
          <li className="relative">
            <button
              className="flex space-x-6 text-gray-700"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              Add Friend
            </button>
            
            {isMenuOpen && (
              <div className="absolute left-1/2 transform -translate-x-1/2 mt-3 w-72 bg-white shadow-lg rounded-lg p-4 z-10 text-center">
                <input
                  type="text"
                  value={email}
                  onChange={handleSearch}
                  placeholder="Търси имейл"
                  className="w-full p-2 border rounded-lg mb-3 text-center"
                />
                {searchResults.length > 0 ? (
                  <ul className="border rounded-lg overflow-hidden">
                    {searchResults.map((user) => (
                      <li
                        key={user.id}
                        className="cursor-pointer p-2 hover:bg-gray-100 border-b"
                        onClick={() => handleAddFriend(user.email)}
                      >
                        {user.email}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">Няма намерени потребители</p>
                )}
                <div className="mt-4">
                  <button
                    onClick={() => handleAddFriend(email)}
                    className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-lg mt-2 w-full"
                  >
                    Добави приятел
                  </button>
                </div>
              </div>
            )}
          </li>
          <li><Link href="/todo-list">To-Do List</Link></li>
          <li><Link href="/profile">Profile 👤</Link></li>
        </ul>
      </nav>

      {/* Animated Hero Section */}
      <div className="max-w-5xl mx-auto px-6 py-24 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl font-extrabold text-gray-800 mb-6"
        >
          Овладей финансите и времето си днес!
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="text-xl text-gray-600 mb-10"
        >
          Интерактивни уроци, AI съветник и инструменти за продуктивност, специално за теб.
        </motion.p>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
        >
          <Link href="/signup/onboarding">
            <button className="bg-green-600 hover:bg-green-700 text-white py-3 px-8 rounded-full text-lg font-semibold shadow-lg">
              Започни сега
            </button>
          </Link>
        </motion.div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl text-gray-800 font-semibold mb-2">📚 Научи за финансите</h3>
          <p className="text-gray-600">Учи чрез практически уроци за бюджетиране, спестяване, инвестиции, как да избегнеш дългове и да управляваш парите си уверено.</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl text-gray-800 font-semibold mb-2">⏰ Управлявай времето си</h3>
          <p className="text-gray-600">Усвои умения за управление на времето чрез календара за задачи, техниката Pomodoro и ефективни стратегии за продуктивност.</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl text-gray-800 font-semibold mb-2">🤖 AI Помощник</h3>
          <p className="text-gray-600">Получавай персонализирани препоръки, съвети за финансова грамотност и продуктивност, и отговори на въпроси от нашия AI съветник.</p>
        </div>
      </div>
    </div>
  );
}
