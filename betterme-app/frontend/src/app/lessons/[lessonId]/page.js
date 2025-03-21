'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import lessons from '@/data/finance_lesson.json';
import Navbar from '../../components/navbar';

export default function LessonDetailPage() {
  // Get the lessonId from URL parameters
  const params = useParams();
  const { lessonId } = params; // expects URL to be like /lessons/beg-1

  const [lesson, setLesson] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [xpEarned, setXpEarned] = useState(0);

  useEffect(() => {
    const foundLesson = lessons.lessons.find((l) => l.id === lessonId);
    setLesson(foundLesson);
  }, [lessonId]);

  if (!lesson) return <div>Loading lesson...</div>;

  const quiz = lesson.quiz;
  const question = quiz[currentQuestion];

  const handleAnswer = (selectedOption) => {
    // Check answer and update XP
    if (selectedOption === question.correctAnswer) {
      setXpEarned(xpEarned + question.xp.correct);
      setUserAnswers([...userAnswers, { correct: true, xp: question.xp.correct }]);
    } else {
      setXpEarned(xpEarned + question.xp.partial);
      setUserAnswers([...userAnswers, { correct: false, xp: question.xp.partial }]);
    }
    // Move to next question if available
    if (currentQuestion < quiz.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Quiz completed; you can show results or update user progress
      alert(`Quiz completed! Total XP earned: ${xpEarned}`);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      <div className="max-w-3xl mx-auto p-8 bg-white shadow-lg rounded-lg mt-20 mb-8">
        <h1 className="text-3xl text-green-700 font-bold mb-6">{lesson.title}</h1>
        <p className="text-lg text-gray-700 mb-8">{lesson.content}</p>

        <hr className="my-8" />

        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Quiz</h2>
        
        {currentQuestion < quiz.length ? (
          <div className="space-y-6">
            <p className="text-xl text-gray-800">{question.question}</p>
            <ul className="space-y-4">
              {question.options.map((option, index) => (
                <li key={index}>
                  <button
                    className="w-full py-3 px-5 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 focus:outline-none transition duration-300"
                    onClick={() => handleAnswer(option)}
                  >
                    {option}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="text-xl font-semibold text-gray-800">
            You have completed the quiz! Total XP earned: {xpEarned}
          </div>
        )}
      </div>
    </div>
  );
}
