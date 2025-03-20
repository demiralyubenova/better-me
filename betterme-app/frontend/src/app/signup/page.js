'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SignUp() {
  const router = useRouter();

  const handleSignup = (e) => {
    e.preventDefault();
    // Логика за регистрация (напр. извикване на API)
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 shadow-xl rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-green-600 text-center mb-6">Регистрация в BetterMe</h2>
        <form className="space-y-4" onSubmit={handleSignup}>
          <input type="text" placeholder="Име" className="w-full p-3 text-gray-600 border rounded-md" required />
          <input type="email" placeholder="Имейл" className="w-full p-3  text-gray-600 border rounded-md" required />
          <input type="password" placeholder="Парола" className="w-full p-3 text-gray-600 border rounded-md" required />
          <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-md font-semibold">
            Регистрирай се
          </button>
        </form>
        <p className="mt-4 text-center text-gray-600">
          Имаш акаунт? <Link href="/login" className="text-black-600 hover:underline hover:bold">Влез тук</Link>
        </p>
      </div>
    </div>
  );
}