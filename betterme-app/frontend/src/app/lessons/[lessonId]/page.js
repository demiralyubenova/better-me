'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import lessons from '@/data/finance_lesson.json';

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
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl text-green-700 font-bold mb-4">{lesson.title}</h1>
      <p className="mb-8">{lesson.content}</p>

      <hr className="my-8" />

      <h2 className="text-2xl font-semibold mb-4">Quiz</h2>
      {currentQuestion < quiz.length ? (
        <div className="mb-6">
          <p className="mb-4 text-lg">{question.question}</p>
          <ul className="space-y-2">
            {question.options.map((option, index) => (
              <li key={index}>
                <button
                  className="w-full border p-3 rounded hover:bg-green-600 transition"
                  onClick={() => handleAnswer(option)}
                >
                  {option}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="text-xl font-semibold">
          You have completed the quiz! Total XP earned: {xpEarned}
        </div>
      )}
    </div>
  );
}