import { useState } from "react";
import Link from "next/link";
import { jwtDecode } from "jwt-decode";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [friends, setFriends] = useState([]);


  const handleSearch = (e) => {
    setEmail(e.target.value);
    // Add logic for searching friends here
  };

  const handleAddFriend = async (email) => {
    // First, update the state locally
    setFriends([...friends, email]);
    setIsMenuOpen(false); // Close the menu after adding
    setEmail(''); // Clear the search input
    
    const token = localStorage.getItem('token');
    const userId = jwtDecode(token);
    console.log(userId)
    // Now, send a POST request to the backend to add the friend
    try {
      const response = await fetch('http://localhost:4000/api/friends/add-friend', {
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

  const handleLogout = () => {
    // Handle logout logic here (clear user session, token, etc.)
    console.log("User logged out");
  };

  return (
    <nav className="bg-white shadow-md w-full px-6 py-4 flex justify-between items-center fixed top-0 left-0 right-0 z-10">
      <div className="text-2xl font-bold text-green-600">BetterMe</div>
      <ul className="flex space-x-6 text-gray-700">
        <li><Link href="/">Beginning</Link></li>
        <li><Link href="/lessons">Lessons and Quizzes</Link></li>
        <li className="relative">
          <button className="flex space-x-6 text-gray-700" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            Add Friend
          </button>
          {isMenuOpen && (
            <div className="absolute left-1/2 transform -translate-x-1/2 mt-3 w-72 bg-white shadow-lg rounded-lg p-4 z-10 text-center">
              <input
                type="text"
                value={email}
                onChange={handleSearch}
                placeholder="Search email"
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
        {/* Log Out Button */}
        <li>
          <button
            onClick={handleLogout}
            className="flex space-x-6 text-gray-700"
          >
            Log Out
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
