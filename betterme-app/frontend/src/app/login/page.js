'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    
    try {
      const response = await fetch('http://localhost:4000/api/auth/login', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });  

      const data = await response.json();
      localStorage.removeItem('token');
      localStorage.setItem("token", data.data.session.access_token)

      if (!response.ok) throw new Error(data.error);
    } catch (err) {
      setError(err.message);
    }
    router.push('/dashboard');
  };

  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 shadow-xl rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-green-600 text-center mb-6">Log in BetterMe</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-4">
          <input 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 text-gray-600 border rounded-md" 
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 text-gray-600 border rounded-md" 
          />
          <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-md font-semibold">
            Log in
          </button>
        </form>
        <p className="mt-4 text-center text-gray-600">
          Don't have an account? <Link href="/signup/onboarding" className="text-black-600 hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
