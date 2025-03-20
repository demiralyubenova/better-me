  'use client';
  import Link from 'next/link';
  import { motion } from 'framer-motion';

  export default function HomePage() {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Navbar */}
        <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-green-600">BetterMe</div>
          <ul className="flex space-x-6 text-gray-700">
            <li><Link href="/">Начало</Link></li>
            
          </ul>
        </nav>

        {/* Animated Hero Section */}
        <div className="max-w-5xl mx-auto px-6 py-24 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl font-extrabold text-gray-800 mb-6"
          >
            Овладей финансите и времето си днес!
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-xl text-gray-600 mb-10"
          >
            Интерактивни уроци, AI съветник и инструменти за продуктивност, специално за теб.
          </motion.p>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1.2, duration: 0.5 }}
          >
            <Link href="/signup/onboarding">
              <button className="bg-green-600 hover:bg-green-700 text-white py-3 px-8 rounded-full text-lg font-semibold shadow-lg">
                Започни сега
              </button>
            </Link>
          </motion.div>
        </div>

        {/* Features Section */}
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl text-gray-800 font-semibold mb-2">📚 Научи за финансите</h3>
            <p className="text-gray-600">Учи чрез практически уроци за бюджетиране, спестяване, инвестиции, как да избегнеш дългове и да управляваш парите си уверено.</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl text-gray-800 font-semibold mb-2">⏰ Управлявай времето си</h3>
            <p className="text-gray-600">Усвои умения за управление на времето чрез календара за задачи, техниката Pomodoro и ефективни стратегии за продуктивност.</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl text-gray-800 font-semibold mb-2">🤖 AI Помощник</h3>
            <p className="text-gray-600">Получавай персонализирани препоръки, съвети за финансова грамотност и продуктивност, и отговори на въпроси от нашия AI съветник.</p>
          </div>
        </div>
      </div>
    );
  }