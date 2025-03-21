'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignUp() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [onboardingData, setOnboardingData] = useState(null);


  useEffect(() => {
    const storedData = localStorage.getItem('userData');

    if (storedData) {
      setOnboardingData(JSON.parse(storedData)); 
    }
  }, []);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null); // Reset errors

    try {
      const response = await fetch('http://localhost:4000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, ...onboardingData }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error);
      localStorage.setItem("token", data.data.session.access_token)

      localStorage.removeItem('token');
      localStorage.setItem("token", data.data.session.access_token)
      router.push('/dashboard'); // Redirect on success
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 shadow-xl rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-green-600 text-center mb-6">Регистрация в BetterMe</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form className="space-y-4" onSubmit={handleSignup}>
          <input
            type="email"
            placeholder="Имейл"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 text-gray-600 border rounded-md"
            required
          />
          <input
            type="password"
            placeholder="Парола"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 text-gray-600 border rounded-md"
            required
          />
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-md font-semibold"
          >
            Регистрирай се
          </button>
        </form>
        <p className="mt-4 text-center text-gray-600">
          Имаш акаунт? <Link href="/login" className="text-black-600 hover:underline hover:font-bold">Влез тук</Link>
        </p>
      </div>
    </div>
  );
}