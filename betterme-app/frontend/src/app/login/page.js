'use client';
import Link from 'next/link';

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 shadow-xl rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-green-600 text-center mb-6">Вход в BetterMe</h2>
        <form className="space-y-4">
          <input type="email" placeholder="Имейл" className="w-full p-3 text-gray-600 border rounded-md" />
          <input type="password" placeholder="Парола" className="w-full p-3 text-gray-600 border rounded-md" />
          <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-md font-semibold">
            Влез
          </button>
        </form>
        <p className="mt-4 text-center text-gray-600">
          Нямаш акаунт? <Link href="/signup" className="text-black-600 hover:underline">Регистрирай се</Link>
        </p>
      </div>
    </div>
  );
}