
'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function OnboardingForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    age: '',
    location: '',
    income: '',
    expenses: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('userData', JSON.stringify(formData));
    router.push('/signup');
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form className="bg-white p-8 shadow-xl rounded-lg w-full max-w-md" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold text-green-600 mb-6 text-center">
          Tell us more about you!
        </h2>
        <input
          type="number"
          name="age"
          min="0"
          placeholder="Age"
          className="w-full p-3 text-gray-900 border rounded-md mb-4"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="location"
          placeholder="Place of living"
          className="w-full p-3 text-gray-900 border rounded-md mb-4"
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="income"
          min="0"
          placeholder="Monthly income (USD)"
          className="w-full p-3 text-gray-900 border rounded-md mb-4"
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="expenses"
          min="0"
          placeholder="Monthly expenses (USD)"
          className="w-full p-3 text-gray-900  border rounded-md mb-4"
          onChange={handleChange}
          required
        />
        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-md font-semibold"
        >
          Continue
        </button>
      </form>
    </div>
  );
}