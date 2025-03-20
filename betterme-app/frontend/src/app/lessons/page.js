'use client';
import Link from 'next/link';
import lessons from '@/data/finance_lesson.json';

export default function LessonsPage() {
  // Group lessons by difficulty
  const groupedLessons = lessons.lessons.reduce((acc, lesson) => {
    const key = lesson.difficulty; // e.g., "Beginner"
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(lesson);
    return acc;
  }, {});

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-bold text-center text-green-600 mb-8">Financial Literacy Lessons</h1>
      {['Beginner', 'Intermediate', 'Advanced'].map((level) => (
        <div key={level} className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">{level} Lessons</h2>
          <ul className="space-y-2">
            {groupedLessons[level] ? (
              groupedLessons[level].map((lesson) => (
                <li key={lesson.id} className="border p-4 hover:bg-green-600 rounded-md transition">
                  <Link href={`/lessons/${lesson.id}`}>
                    <span className="text-xl font-medium">{lesson.title}</span>
                  </Link>
                </li>
              ))
            ) : (
              <li>No lessons available at this level.</li>
            )}
          </ul>
        </div>
      ))}
    </div>
  );
} 