'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import lessons from '@/data/finance_lesson.json';
import Navbar from '../../components/navbar';
import Confetti from 'react-confetti';
import { jwtDecode } from 'jwt-decode';


export default function LessonDetailPage() {
  const params = useParams();
  const { lessonId } = params; // очаква URL да е като /lessons/beg-1

  const [lesson, setLesson] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [xpEarned, setXpEarned] = useState(0);
  // New state variables
  const [selectedOption, setSelectedOption] = useState(null);
  const [answerSubmitted, setAnswerSubmitted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const foundLesson = lessons.lessons.find((l) => l.id === lessonId);
    setLesson(foundLesson);
  }, [lessonId]);

  useEffect(() => {
    // Reset states when moving to next question
    setSelectedOption(null);
    setAnswerSubmitted(false);
    setShowConfetti(false);
  }, [currentQuestion]);

  if (!lesson) return <div>Loading lesson...</div>;

  const quiz = lesson.quiz;
  const question = quiz ? quiz[currentQuestion] : null;

  const handleOptionSelect = (option) => {
    if (!answerSubmitted) {
      setSelectedOption(option);
    }
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null || answerSubmitted) return;

    setAnswerSubmitted(true);
    
    const isCorrect = selectedOption === question.correctAnswer;
    const earnedXp = isCorrect ? question.xp.correct : question.xp.partial;
    
    setUserAnswers([...userAnswers, { correct: isCorrect, xp: earnedXp }]);
    setXpEarned(prev => prev + earnedXp);
    
    if (isCorrect) {
      setShowConfetti(true);
      // Hide confetti after 3 seconds
      setTimeout(() => setShowConfetti(false), 3000);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < quiz.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found");
          return;
        }

        try {
          const decodedToken = jwtDecode(token);
          const userId = decodedToken.sub;

          fetch("http://localhost:4000/api/quiz/finishquiz", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId: userId, xp: xpEarned}),
          })
            .then(response => response.json())
            .catch(error => console.error("Error fetching user data:", error));
          window.location.href = `/lessons`;
        } catch (error) {
          console.error("Error:", error);
        }
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  // Get button style based on answer status
  const getButtonStyle = (option) => {
    if (!answerSubmitted) {
      return option === selectedOption 
        ? "bg-blue-600 text-white" 
        : "bg-green-600 text-white";
    }
    
    if (option === question.correctAnswer) {
      return "bg-green-600 text-white border-2 border-green-800";
    }
    
    if (option === selectedOption && option !== question.correctAnswer) {
      return "bg-red-600 text-white border-2 border-red-800";
    }
    
    return "bg-gray-400 text-gray-700";
  };

  // Намиране на текущия урок в списъка
  const lessonIndex = lessons.lessons.findIndex((l) => l.id === lessonId);
  const previousLesson = lessonIndex > 0 ? lessons.lessons[lessonIndex - 1] : null;
  const nextLesson = lessonIndex < lessons.lessons.length - 1 ? lessons.lessons[lessonIndex + 1] : null;

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <br></br>
      {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}

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
                <p className="text-sm text-gray-500">Question {currentQuestion + 1} of {quiz.length}</p>
                <ul className="space-y-4">
                  {question.options.map((option, index) => (
                    <li key={index}>
                      <button
                        className={`w-full py-3 px-5 rounded-lg shadow-md focus:outline-none transition duration-300 ${getButtonStyle(option)}`}
                        onClick={() => handleOptionSelect(option)}
                        disabled={answerSubmitted}
                      >
                        {option}
                      </button>
                    </li>
                  ))}
                </ul>
                
                <div className="flex justify-between mt-6">
                  <button
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700 disabled:opacity-50"
                    onClick={handlePreviousQuestion}
                    disabled={currentQuestion === 0}
                  >
                    Previous Question
                  </button>
                  
                  {!answerSubmitted ? (
                    <button
                      className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                      onClick={handleSubmitAnswer}
                      disabled={selectedOption === null}
                    >
                      Check Answer
                    </button>
                  ) : (
                    <button
                      className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-700"
                      onClick={handleNextQuestion}
                    >
                      {currentQuestion < quiz.length - 1 ? 'Next Question' : 'Finish Quiz'}
                    </button>
                  )}
                </div>
                
                {answerSubmitted && (
                  <div className={`mt-4 p-4 rounded-lg ${selectedOption === question.correctAnswer ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {selectedOption === question.correctAnswer ? (
                      <p>Correct! You earned {question.xp.correct} XP.</p>
                    ) : (
                      <p>Incorrect. The correct answer is: {question.correctAnswer}. You earned {question.xp.partial} XP.</p>
                    )}
                  </div>
                )}
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
              <button className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-700">
                Previous Lesson
              </button>
            </Link>
          )}

          {nextLesson ? (
            <Link href={`/lessons/${nextLesson.id}`}>
              <button className="bg-green-700 text-white px-4 py-2 rounded hover:bg-blue-700">
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