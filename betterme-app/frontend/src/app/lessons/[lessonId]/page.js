'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import lessons from '@/data/finance_lesson.json';
import Navbar from '../../components/navbar';

export default function LessonDetailPage() {
  const params = useParams();
  const { lessonId } = params; // очаква URL да е като /lessons/beg-1

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
  const question = quiz ? quiz[currentQuestion] : null;

  const handleAnswer = (selectedOption) => {
    if (selectedOption === question.correctAnswer) {
      setXpEarned(xpEarned + question.xp.correct);
      setUserAnswers([...userAnswers, { correct: true, xp: question.xp.correct }]);
    } else {
      setXpEarned(xpEarned + question.xp.partial);
      setUserAnswers([...userAnswers, { correct: false, xp: question.xp.partial }]);
    }
    
    if (currentQuestion < quiz.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      alert(`Quiz completed! Total XP earned: ${xpEarned}`);
    }
  };

  // Намиране на текущия урок в списъка
  const lessonIndex = lessons.lessons.findIndex((l) => l.id === lessonId);
  const previousLesson = lessonIndex > 0 ? lessons.lessons[lessonIndex - 1] : null;
  const nextLesson = lessonIndex < lessons.lessons.length - 1 ? lessons.lessons[lessonIndex + 1] : null;


  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      <div className="max-w-3xl mx-auto p-8 bg-white shadow-lg rounded-lg mt-20 mb-8">
        <h1 className="text-3xl text-green-700 font-bold mb-6">{lesson.title}</h1>
        <p className="text-lg text-gray-700 mb-8">{lesson.content}</p>

        <hr className="my-8" />
        {quiz && (
          <>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Quiz</h2>

            {currentQuestion < quiz?.length ? (
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
          </>
        )}

        {/* Навигационни бутони */}
        <div className="mt-8 flex justify-between">
          {previousLesson && (
            <Link href={`/lessons/${previousLesson.id}`}>
              <button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700">
                Previous Lesson
              </button>
            </Link>
          )}

          {nextLesson ? (
            <Link href={`/lessons/${nextLesson.id}`}>
              <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
                Next Lesson
              </button>
            </Link>
          ) : (
            <Link href={`/quizzes/${lesson.difficulty.toLowerCase()}`}>
              <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700">
                Take Quiz
              </button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
