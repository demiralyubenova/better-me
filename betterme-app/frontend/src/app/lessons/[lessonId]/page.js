'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import lessons from '@/data/finance_lesson.json';
import Navbar from '../../components/navbar';
import Confetti from 'react-confetti';
import { jwtDecode } from 'jwt-decode';
import Footer from '@/app/components/footer';

export default function LessonDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { lessonId } = params;

  const [lesson, setLesson] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [xpEarned, setXpEarned] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answerSubmitted, setAnswerSubmitted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [userId, setUserId] = useState(null);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const foundLesson = lessons.lessons.find((l) => l.id === lessonId);
    setLesson(foundLesson);
    
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
  }, [lessonId]);

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
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching completed lessons:", error);
      setIsLoading(false);
    }
  };

  const isCurrentLessonCompleted = completedLessons.includes(lessonId);

  const markLessonAsCompleted = async () => {
    if (!userId || isCurrentLessonCompleted) return;

    try {
      const response = await fetch("http://localhost:4000/api/quiz/complete-lesson", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          userId, 
          lessonId,
          xp: lesson.completionXp || 10 
        }),
      });

      const data = await response.json();
      if (data.success) {
        setCompletedLessons([...completedLessons, lessonId]);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }
    } catch (error) {
      console.error("Error marking lesson as completed:", error);
    }
  };

  useEffect(() => {
    setSelectedOption(null);
    setAnswerSubmitted(false);
    setShowConfetti(false);
  }, [currentQuestion]);

  if (isLoading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (!lesson) return <div className="flex justify-center items-center h-screen">Lesson not found</div>;

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
      setTimeout(() => setShowConfetti(false), 3000);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < quiz.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
        if (!userId) {
          console.error("No user ID found");
          return;
        }

        try {
          fetch("http://localhost:4000/api/quiz/finishquiz", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId, xp: xpEarned }),
          })
            .then(response => response.json())
            .then(() => {
              if (!isCurrentLessonCompleted) {
                fetch("http://localhost:4000/api/lessons/complete", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ 
                    userId, 
                    lessonId,
                    xp: 0 
                  }),
                });
                setCompletedLessons([...completedLessons, lessonId]);
              }
              router.push('/lessons');
            })
            .catch(error => console.error("Error saving quiz results:", error));
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

  const lessonIndex = lessons.lessons.findIndex((l) => l.id === lessonId);
  const previousLesson = lessonIndex > 0 ? lessons.lessons[lessonIndex - 1] : null;
  const nextLesson = lessonIndex < lessons.lessons.length - 1 ? lessons.lessons[lessonIndex + 1] : null;

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Navbar />
      <br></br>
      <div className = "flex-grow">
      {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}

      <div className="max-w-3xl mx-auto p-8 bg-white shadow-lg rounded-lg mt-20 mb-8">
        {isCurrentLessonCompleted && (
          <div className="mb-4 bg-green-100 text-green-800 px-3 py-1 rounded-full inline-flex items-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Completed
          </div>
        )}
        
        <h1 className="text-3xl text-green-700 font-bold mb-6">{lesson.title}</h1>
        <p className="text-lg text-gray-700 mb-8">{lesson.content}</p>

        {userId && !isCurrentLessonCompleted && !quiz && (
          <div className="my-8">
            <button 
              onClick={markLessonAsCompleted}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition duration-300"
            >
              Mark as Completed (+{lesson.completionXp || 10} XP)
            </button>
          </div>
        )}

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
      <Footer />
    </div>
  );
}