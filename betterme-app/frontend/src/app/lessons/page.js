'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import lessonsData from '@/data/finance_lesson.json';
import Navbar from '../components/navbar';

export default function LessonsPage() {
  const [activeCategory, setActiveCategory] = useState('beginner');
  
  // Load saved category preference
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCategory = localStorage.getItem('activeLessonCategory');
      if (savedCategory) {
        setActiveCategory(savedCategory);
      }
    }
  }, []);

  // Save category preference
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('activeLessonCategory', activeCategory);
    }
  }, [activeCategory]);

  // Get lessons data
  const lessons = Array.isArray(lessonsData) ? lessonsData : (lessonsData.lessons || []);

  // Group lessons by difficulty
  const categories = {
    beginner: lessons.filter(lesson => lesson.difficulty?.toLowerCase().includes('beginner')),
    intermediate: lessons.filter(lesson => lesson.difficulty?.toLowerCase().includes('intermediate')),
    advanced: lessons.filter(lesson => lesson.difficulty?.toLowerCase().includes('advanced'))
  };
  
  const getCategoryTitle = (category) => {
    switch(category) {
      case 'beginner': return 'Beginner';
      case 'intermediate': return 'Intermediate';
      case 'advanced': return 'Advanced';
      default: return category.charAt(0).toUpperCase() + category.slice(1);
    }
  };
  
  const categoryColors = {
    beginner: { bg: 'bg-blue-500', text: 'text-blue-600', border: 'border-blue-300', hover: 'hover:bg-blue-100' },
    intermediate: { bg: 'bg-purple-500', text: 'text-purple-600', border: 'border-purple-300', hover: 'hover:bg-purple-100' },
    advanced: { bg: 'bg-red-500', text: 'text-red-600', border: 'border-red-300', hover: 'hover:bg-red-100' }
  };

  return (
    <div className="w-full bg-gray-50 min-h-screen">
      <Navbar />
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-black mb-2">Financial Literacy Lessons</h1>
        <p className="text-black max-w-2xl mx-auto">Select a difficulty level to explore lessons designed to improve your financial knowledge</p>
      </div>
      
      {/* Category selection tabs */}
      <div className="flex justify-center mb-8">
        {Object.keys(categories).map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-8 py-4 mx-2 text-lg font-semibold rounded-t-lg transition duration-300 
              ${activeCategory === category 
                ? `${categoryColors[category].bg} text-white` 
                : `bg-white ${categoryColors[category].text}`}`}
          >
            {getCategoryTitle(category)}
            <span className="ml-2 bg-white text-black rounded-full px-2 py-0.5 text-sm">
              {categories[category].length}
            </span>
          </button>
        ))}
      </div>
      
      {/* Active category content */}
      <div className={`bg-white rounded-lg shadow-lg p-6 mb-10 border-t-4 
        ${categoryColors[activeCategory].border}`}>
        
        <h2 className="text-2xl font-bold mb-6 flex items-center text-black">
          <span className={`w-3 h-3 rounded-full ${categoryColors[activeCategory].bg} mr-3`}></span>
          {getCategoryTitle(activeCategory)} Level Lessons
        </h2>
        
        {categories[activeCategory].length === 0 ? (
          <div className="text-center py-12 text-black">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <p className="text-xl">No lessons available in this category yet.</p>
            <p className="mt-2">Please check back later or explore another difficulty level.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categories[activeCategory].map((lesson) => (
              <Link 
                href={`/lessons/${lesson.id}`} 
                key={lesson.id} 
                className={`block border rounded-lg p-5 transition duration-300 ${categoryColors[activeCategory].hover}`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-black">{lesson.title}</h3>
                    {lesson.description && (
                      <p className="text-black text-sm mb-3 line-clamp-2">{lesson.description}</p>
                    )}
                    <div className="flex items-center text-sm text-black">
                      <span>Time: {lesson.duration || '20 mins'}</span>
                      {lesson.topics && (
                        <span className="ml-4">
                          Topics: {lesson.topics.slice(0, 2).join(', ')}
                          {lesson.topics.length > 2 && '...'}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className={`p-2 rounded-full ${categoryColors[activeCategory].bg} text-white`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      
      {/* Quick navigation */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4 text-black">Quick Navigation</h3>
        <div className="flex flex-wrap gap-3">
          {Object.keys(categories).map(category => (
            <div key={category} className="flex-1 min-w-[150px]">
              <h4 className={`font-medium mb-2 ${categoryColors[category].text} text-black`}>
                {getCategoryTitle(category)}
              </h4>
              <ul className="text-sm space-y-1">
                {categories[category].slice(0, 3).map(lesson => (
                  <li key={lesson.id}>
                    <Link href={`/lessons/${lesson.id}`} className="text-black hover:underline">
                      {lesson.title}
                    </Link>
                  </li>
                ))}
                {categories[category].length > 3 && (
                  <li className="text-black text-xs">
                    + {categories[category].length - 3} more lessons
                  </li>
                )}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
