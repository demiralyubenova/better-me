"use client";
import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as BarTooltip, Legend } from "recharts";
import { jwtDecode } from "jwt-decode";
import Navbar from "../components/navbar";


export default function Dashboard() {
  const [userData, setUserData] = useState({
    income: 0,
    expenses: 0,
  });
  const COLORS = ['#4CAF50', '#f44336', '#2196F3', '#FFC107'];

  const [transactions, setTransactions] = useState([]);
  const [newTransaction, setNewTransaction] = useState({
    category: "",
    type: "Income",
    amount: "",
  });

  // New state for lesson progress
  const [lessonProgress, setLessonProgress] = useState({
    lessonsCompleted: 0,
    totalLessons: 10, // You can change this number to reflect total lessons
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.sub;

      fetch("http://localhost:4000/api/dashboard/getDashboard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: userId }),
      })
        .then(response => response.json())
        .then(data => {
          if (data.data.length > 0) {
            setUserData({
              income: data.data[0].income,
              expenses: data.data[0].expenses,
            });
          }
        })
        .catch(error => console.error("Error fetching user data:", error));

      fetch("http://localhost:4000/api/dashboard/getTransactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: userId }),
      })
        .then(response => response.json())
        .then(data => {
          setTransactions(data.data);
        })
        .catch(error => console.error("Error fetching transactions:", error));
    } catch (error) {
      console.error("Invalid token", error);
    }
  }, []);

  useEffect(() => {
    if (!transactions.length) return;

    const totalIncome = transactions
      .filter(tx => tx.type === "Income")
      .reduce((acc, tx) => acc + tx.amount, 0);

    const totalExpenses = transactions
      .filter(tx => tx.type === "Expense")
      .reduce((acc, tx) => acc + tx.amount, 0);

    setUserData(prevData => {
      const newIncome = prevData.income + totalIncome;
      const newExpenses = prevData.expenses + totalExpenses;
      return {
        income: newIncome,
        expenses: newExpenses,
      };
    });
  }, [transactions]);

  const balance = userData.income - userData.expenses;

  const getRemainingDays = () => {
    const today = new Date();
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const remainingDays = (lastDayOfMonth - today) / (1000 * 60 * 60 * 24);
    return remainingDays;
  };

  const remainingBudget = userData.income - userData.expenses;
  const remainingDays = getRemainingDays();
  const dailySpendingLimit = Math.floor(remainingBudget / remainingDays);


  const chartData = [
    {
      name: "Income",
      value: userData.income,
    },
    {
      name: "Spent So Far",
      value: userData.expenses,
    },
    {
      name: "Remaining Budget",
      value: remainingBudget,
    },
    {
      name: "Daily Limit",
      value: dailySpendingLimit,
    },
  ];

  const addTransaction = async () => {
    if (!newTransaction.category || !newTransaction.amount) return;

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.sub;
      const amount = parseFloat(newTransaction.amount);

      const response = await fetch("http://localhost:4000/api/dashboard/addTransaction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          category: newTransaction.category,
          type: newTransaction.type,
          amount: amount,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setTransactions(prev => [
          ...prev,
          { category: newTransaction.category, type: newTransaction.type, amount },
        ]);
        setNewTransaction({ category: "", type: "Income", amount: "" });
      } else {
        console.error("Error adding transaction:", data.error);
      }
    } catch (error) {
      console.error("Error adding transaction:", error);
    }
  };

  // Lesson progress chart data
  const lessonChartData = [
    {
      name: "Completed Lessons",
      value: lessonProgress.lessonsCompleted,
    },
    {
      name: "Remaining Lessons",
      value: lessonProgress.totalLessons - lessonProgress.lessonsCompleted,
    },
  ];

  const rankingData = [
    {
      name: "You",
      score: ((userData.income - userData.expenses) / userData.income * 100).toFixed(1),
      color: "#4CAF50"
    },
    { name: "Shishi", score: 75.5, color: "#2196F3" },
    { name: "Maria", score: 68.2, color: "#9C27B0" },
    { name: "Joji sosa", score: 62.8, color: "#FF9800" },
    { name: "DA", score: 58.4, color: "#E91E63" }
  ].sort((a, b) => b.score - a.score);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Navbar />
      <h1 className="text-3xl font-bold text-black text-center mb-6">Финансово Табло</h1>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className={`p-4 text-white rounded-lg shadow ${balance >= 0 ? "bg-green-500" : "bg-red-500"}`}>
          <h2 className="text-lg font-semibold">Баланс</h2>
          <p className="text-2xl font-bold">${balance}</p>
        </div>
        <div className="p-4 bg-green-100 text-green-700 rounded-lg shadow">
          <h2 className="text-lg font-semibold">Приходи</h2>
          <p className="text-2xl font-bold">${userData.income}</p>
        </div>
        <div className="p-4 bg-red-100 text-red-700 rounded-lg shadow">
          <h2 className="text-lg font-semibold">Разходи</h2>
          <p className="text-2xl font-bold">${userData.expenses}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Financial Overview Chart */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-gray-900 font-semibold mb-3">Месечен Преглед</h2>
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={120}
                innerRadius={60}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `$${value}`} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Lesson Progress Chart */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-gray-900 font-semibold mb-3">Прогрес с Уроците</h2>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={lessonChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Bar dataKey="value" fill="#4CAF50" />
              <BarTooltip />
              <Legend />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="text-gray-900 font-semibold mb-3">Financial Management Ranking</h2>
        <div className="text-sm text-gray-600 mb-4">
          Score is calculated based on savings ratio (% of income saved)
        </div>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart
            data={rankingData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" domain={[0, 100]} unit="%" />
            <YAxis dataKey="name" type="category" />
            <Tooltip 
              formatter={(value) => `${value}%`}
              labelStyle={{ color: 'black' }}
            />
            <Bar 
              dataKey="score" 
              radius={[0, 4, 4, 0]}
            >
              {rankingData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-4 text-sm text-gray-600">
          {rankingData[0].name === "You" ? 
            "🏆 Great job! You're leading the rankings!" :
            `💪 Keep going! You're ${rankingData.findIndex(item => item.name === "You") + 1}th in rankings`
          }
        </div>
      </div>

      {/* Add Transaction Form */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="text-black font-semibold mb-3">Добави Транзакция</h2>
        <input
          type="text"
          placeholder="Категория"
          value={newTransaction.category}
          onChange={(e) => setNewTransaction({ ...newTransaction, category: e.target.value })}
          className="border p-2 rounded mr-2 text-black"
        />
        <select
          value={newTransaction.type}
          onChange={(e) => setNewTransaction({ ...newTransaction, type: e.target.value })}
          className="border p-2 rounded mr-2 text-black"
        >
          <option value="Income">Приход</option>
          <option value="Expense">Разход</option>
        </select>
        <input
          type="number"
          placeholder="Сума"
          value={newTransaction.amount}
          onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
          className="border p-2 rounded mr-2 text-black"
        />
        <button onClick={addTransaction} className="bg-black text-white p-2 rounded">Добави</button>
      </div>

      {/* Transaction History */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-black font-semibold mb-3">Последни Транзакции</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 text-black">Категория</th>
              <th className="p-2 text-black">Тип</th>
              <th className="p-2 text-black">Сума</th>
              <th className="p-2 text-black">Дата</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx, index) => (
              <tr key={index} className="border-t">
                <td className="p-2 text-black">{tx.category}</td>
                <td className={`p-2 ${tx.type === "Income" ? "text-green-500" : "text-red-500"}`}>{tx.type}</td>
                <td className="p-2 text-black">${tx.amount}</td>
                <td className="p-2 text-black">{new Date(tx.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
