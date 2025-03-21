import { useState } from "react";
import Link from "next/link";
import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";
import lessons from '@/data/finance_lesson.json';


const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [friends, setFriends] = useState([]);
  const [userId, setUserId] = useState(null);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");

      if (token) {
        const user = jwtDecode(token).sub;
        setUserId(user);
      }
    }
  }, []);

  useEffect(() => {
    if (!userId) return; 
    const fetchFriends = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/friends/get-friends', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId }), // Sending the friend's email as part of the request
        });
        if (response.ok) {
          const data = await response.json();
          setFriends(data);
        }
      } catch (error) {
        console.error('Error fetching friends:', error);
      }
    };

    fetchFriends();
  }, [userId]);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    // Filter lessons by title
    if (query.length > 0) {
      const filteredLessons = lessons.lessons.filter((lesson) =>
        lesson.title.toLowerCase().includes(query)
      );
      setSearchResults(filteredLessons);
    } else {
      setSearchResults([]);
    }
  };

  const handleAddFriend = async (email) => {
    setIsMenuOpen(false);
    setEmail('');
    
    try {
      const response = await fetch('http://localhost:4000/api/friends/add-friend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, email }), // Sending the friend's email as part of the request
      });
  
      if (!response.ok) {
        throw new Error('Failed to add friend');
      }
  
      const data = await response.json();
      console.log('Friend added:', data);
    } catch (error) {
      console.error('Error adding friend:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <nav className="bg-white shadow-md w-full px-6 py-4 flex justify-between items-center fixed top-0 left-0 right-0 z-10">
      <div className="text-2xl font-bold text-green-600"><Link href="/">BetterMe</Link></div>
      
 {/* Search Bar */}
 <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search lessons..."
          className="p-2 border border-black text-black rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-gray-600 placeholder-black"
        />
        {searchQuery && searchResults.length > 0 && (
          <div className="absolute top-full left-0 mt-1 w-full bg-white shadow-md rounded-lg p-2 border border-black">
            {searchResults.map((lesson) => (
              <Link key={lesson.id} href={`/lessons/${lesson.id}`} className="block p-2 hover:bg-gray-100">
                {lesson.title}
              </Link>
            ))}
          </div>
        )}
      </div>
        {userId ? (
      <ul className="flex space-x-6 text-gray-700">
        <li><Link href="/dashboard">Dashboard</Link></li>
        <li><Link href="/lessons">Lessons and Quizzes</Link></li>
        <li className="relative">
          <button className="flex space-x-6 text-gray-700" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            Friends
          </button>
          {isMenuOpen && (
            <div className="absolute left-1/2 transform -translate-x-1/2 mt-3 w-72 bg-white shadow-lg rounded-lg p-4 z-10 text-center border border-black">
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Search email"
                className="w-full p-2 border border-black rounded-lg mb-3 text-center placeholder-black"
              />
              {friends.length > 0 ? (
                <ul className="border rounded-lg overflow-hidden">
                  {friends.map((user) => (
                    <li
                      key={user.id}
                      className="p-2 hover:bg-gray-100 border-b"
                    >
                      {user.email}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No users found</p>
              )}
              <div className="mt-4">
                <button
                  onClick={() => handleAddFriend(email)}
                  className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-lg mt-2 w-full"
                >
                  Add Friend
                </button>
              </div>
            </div>
          )}
        </li>
        <li><Link href="/todo-list">To-Do List</Link></li>
        <li><Link href="/profile">Profile 👤</Link></li>
        <li>
          <button onClick={handleLogout} className="text-gray-700">
            Log Out
          </button>
        </li>
      </ul>
      ) : 
      (
        <ul className="flex space-x-6 text-gray-700">
          <li><Link href="/login">Login</Link></li>
          <li><Link href="/signup">Sign Up</Link></li>
        </ul>
      )
      }

    </nav>
  );
};

export default Navbar;
