'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import lessonsData from '@/data/finance_lesson.json';
import Navbar from '../components/navbar';
import { jwtDecode } from 'jwt-decode';

export default function LessonsPage() {
  const [activeCategory, setActiveCategory] = useState('beginner');
  const [userId, setUserId] = useState(null);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState({
    beginner: { completed: 0, total: 0 },
    intermediate: { completed: 0, total: 0 },
    advanced: { completed: 0, total: 0 }
  });
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserId(decodedToken.sub);
        fetchCompletedLessons(decodedToken.sub);
      } catch (error) {
        console.error("Error decoding token:", error);
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, []);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCategory = localStorage.getItem('activeLessonCategory');
      if (savedCategory) {
        setActiveCategory(savedCategory);
      }
    }
  }, []);

  const fetchCompletedLessons = async (userId) => {
    try {
      const response = await fetch(`http://localhost:4000/api/quiz/get-lessons?userId=${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
      });
      
      const data = await response.json();
      if (data.data) {
        const completedLessonIds = data.data.map(lesson => lesson.lesson_id);
        setCompletedLessons(completedLessonIds);
        calculateProgress(completedLessonIds);
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching completed lessons:", error);
      setIsLoading(false);
    }
  };
  
  const calculateProgress = (completedIds) => {
    const lessons = Array.isArray(lessonsData) ? lessonsData : (lessonsData.lessons || []);
    
    const newProgress = {
      beginner: { 
        completed: lessons.filter(l => l.difficulty?.toLowerCase().includes('beginner') && completedIds.includes(l.id)).length,
        total: lessons.filter(l => l.difficulty?.toLowerCase().includes('beginner')).length
      },
      intermediate: { 
        completed: lessons.filter(l => l.difficulty?.toLowerCase().includes('intermediate') && completedIds.includes(l.id)).length,
        total: lessons.filter(l => l.difficulty?.toLowerCase().includes('intermediate')).length
      },
      advanced: { 
        completed: lessons.filter(l => l.difficulty?.toLowerCase().includes('advanced') && completedIds.includes(l.id)).length,
        total: lessons.filter(l => l.difficulty?.toLowerCase().includes('advanced')).length
      }
    };
    
    setProgress(newProgress);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('activeLessonCategory', activeCategory);
    }
  }, [activeCategory]);

  const lessons = Array.isArray(lessonsData) ? lessonsData : (lessonsData.lessons || []);

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
    beginner: { bg: 'bg-blue-500', text: 'text-blue-600', border: 'border-blue-300', hover: 'hover:bg-blue-100', completed: 'bg-blue-200' },
    intermediate: { bg: 'bg-purple-500', text: 'text-purple-600', border: 'border-purple-300', hover: 'hover:bg-purple-100', completed: 'bg-purple-200' },
    advanced: { bg: 'bg-red-500', text: 'text-red-600', border: 'border-red-300', hover: 'hover:bg-red-100', completed: 'bg-red-200' }
  };

  const isLessonCompleted = (lessonId) => {
    return completedLessons.includes(lessonId);
  };

  return (
    <div className="w-full bg-gray-50 min-h-screen">
      <Navbar />
      <div className="pt-20">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-black mb-2">Financial Literacy Lessons</h1>
          <p className="text-black max-w-2xl mx-auto">Select a difficulty level to explore lessons designed to improve your financial knowledge</p>
          
          {userId && (
            <div className="mt-4 flex flex-col items-center">
              <div className="text-sm font-medium text-gray-600 mb-1">
                Your overall progress: {completedLessons.length} of {lessons.length} lessons completed
              </div>
              <div className="w-64 h-3 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 rounded-full transition-all duration-500"
                  style={{ width: `${(completedLessons.length / lessons.length) * 100}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex justify-center mb-8">
          {Object.keys(categories).map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-8 py-4 mx-2 text-lg font-semibold rounded-t-lg transition duration-300 relative
                ${activeCategory === category 
                  ? `${categoryColors[category].bg} text-white` 
                  : `bg-white ${categoryColors[category].text}`}`}
            >
              {getCategoryTitle(category)}
              <span className="ml-2 bg-white text-black rounded-full px-2 py-0.5 text-sm">
                {categories[category].length}
              </span>
              
              {userId && progress[category].total > 0 && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
                  <div 
                    className="h-full bg-green-400"
                    style={{ width: `${(progress[category].completed / progress[category].total) * 100}%` }}
                  ></div>
                </div>
              )}
            </button>
          ))}
        </div>
        
        <div className={`max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-6 mb-10 border-t-4 
          ${categoryColors[activeCategory].border}`}>
          
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold flex items-center text-black">
              <span className={`w-3 h-3 rounded-full ${categoryColors[activeCategory].bg} mr-3`}></span>
              {getCategoryTitle(activeCategory)} Level Lessons
            </h2>
            
            {userId && progress[activeCategory].total > 0 && (
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-600 mr-3">
                  {progress[activeCategory].completed}/{progress[activeCategory].total} completed
                </span>
                <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500"
                    style={{ width: `${(progress[activeCategory].completed / progress[activeCategory].total) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
          
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading your progress...</p>
            </div>
          ) : categories[activeCategory].length === 0 ? (
            <div className="text-center py-12 text-black">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <p className="text-xl">No lessons available in this category yet.</p>
              <p className="mt-2">Please check back later or explore another difficulty level.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {categories[activeCategory].map((lesson) => {
                const completed = isLessonCompleted(lesson.id);
                
                return (
                  <Link 
                    href={`/lessons/${lesson.id}`} 
                    key={lesson.id} 
                    className={`block border rounded-lg p-5 transition duration-300 ${
                      completed 
                        ? categoryColors[activeCategory].completed 
                        : categoryColors[activeCategory].hover
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <h3 className="text-xl font-semibold text-black">{lesson.title}</h3>
                          
                          {completed && (
                            <span className="ml-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full flex items-center">
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                              </svg>
                              Completed
                            </span>
                          )}
                        </div>
                        
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
                );
              })}
            </div>
          )}
        </div>
        
        {/* Quick navigation */}
        <div className="max-w-6xl mx-auto bg-white rounded-lg shadow p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4 text-black">Quick Navigation</h3>
          <div className="flex flex-wrap gap-3">
            {Object.keys(categories).map(category => (
              <div key={category} className="flex-1 min-w-[150px]">
                <h4 className={`font-medium mb-2 ${categoryColors[category].text} text-black`}>
                  {getCategoryTitle(category)} 
                  {userId && (
                    <span className="ml-2 text-sm text-gray-600">
                      ({progress[category].completed}/{progress[category].total})
                    </span>
                  )}
                </h4>
                <ul className="text-sm space-y-1">
                  {categories[category].slice(0, 3).map(lesson => (
                    <li key={lesson.id} className="flex items-center">
                      {isLessonCompleted(lesson.id) ? (
                        <svg className="w-4 h-4 text-green-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 text-gray-300 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
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
    </div>
  );
}