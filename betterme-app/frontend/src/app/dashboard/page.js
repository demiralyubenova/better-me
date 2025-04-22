"use client";
import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as BarTooltip, Legend } from "recharts";
import { jwtDecode } from "jwt-decode";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

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

  const [userId, setUserId] = useState(null);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [friends, setFriends] = useState([]);
  const [rankingData, setRankingData] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const currentUserId = decodedToken.sub;
        setUserId(currentUserId);
        
        Promise.all([
          fetchCompletedLessons(currentUserId),
          fetchUserFinancialData(currentUserId),
          fetchTransactions(currentUserId),
          fetchFriendsData(currentUserId)
        ])
        .then(() => {
          setIsLoading(false);
        })
        .catch(error => {
          console.error("Error fetching dashboard data:", error);
          setIsLoading(false);
        });
      } catch (error) {
        console.error("Error decoding token:", error);
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
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
        setLessonProgress(prevProgress => ({
          ...prevProgress,
          lessonsCompleted: completedLessonIds.length,
        }));
      }
    } catch (error) {
      console.error("Error fetching completed lessons:", error);
    }
  };

  const fetchUserFinancialData = async (userId) => {
    try {
      const response = await fetch("http://localhost:4000/api/dashboard/getDashboard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: userId }),
      });
      
      const data = await response.json();
      if (data.data.length > 0) {
        setUserData({
          income: data.data[0].income,
          expenses: data.data[0].expenses,
        });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchTransactions = async (userId) => {
    try {
      const response = await fetch("http://localhost:4000/api/dashboard/getTransactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: userId }),
      });
      
      const data = await response.json();
      setTransactions(data.data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };


  const fetchFriendsData = async (userId) => {
    try {
      const response = await fetch("http://localhost:4000/api/dashboard/getFriendsAnalytics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: userId }),
      });
      
      const data = await response.json();
      if (data.friends) {
        setFriends(data.friends);
        
        updateRankingData(data.friends, userId);
      }
    } catch (error) {
      console.error("Error fetching friends data:", error);
    }
  };

  const updateRankingData = (friendsData, currentUserId) => {
    const userIncome = userData.income;
    const userExpenses = userData.expenses;
    const userSavingsRatio = userIncome > 0 ? ((userIncome - userExpenses) / userIncome * 100) : 0;
    
    const rankings = [
      {
        name: "You",
        score: parseFloat(userSavingsRatio.toFixed(1)),
        color: "#4CAF50",
        isCurrentUser: true
      }
    ];
    
    friendsData.forEach((friend, index) => {
      const friendIncome = friend.income || 0;
      const friendExpenses = friend.expenses || 0;
      const savingsRatio = friendIncome > 0 ? ((friendIncome - friendExpenses) / friendIncome * 100) : 0;
      
      rankings.push({
        name: friend.username || `Friend ${index + 1}`,
        score: parseFloat(savingsRatio.toFixed(1)),
        color: COLORS[(index + 1) % COLORS.length],
        isCurrentUser: false
      });
    });
    
    const sortedRankings = rankings.sort((a, b) => b.score - a.score);
    setRankingData(sortedRankings);
  };
  
  const [lessonProgress, setLessonProgress] = useState({
    lessonsCompleted: completedLessons.length,
    totalLessons: 29, 
  });

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

  useEffect(() => {
    if (friends.length > 0 && userId) {
      updateRankingData(friends, userId);
    }
  }, [userData, friends, userId]);

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
          { category: newTransaction.category, type: newTransaction.type, amount, created_at: new Date() },
        ]);
        setNewTransaction({ category: "", type: "Income", amount: "" });
        
        const newIncome = newTransaction.type === "Income" ? userData.income + amount : userData.income;
        const newExpenses = newTransaction.type === "Expense" ? userData.expenses + amount : userData.expenses;
        setUserData({ income: newIncome, expenses: newExpenses });
      } else {
        console.error("Error adding transaction:", data.error);
      }
    } catch (error) {
      console.error("Error adding transaction:", error);
    }
  };


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

  const getUserRankMessage = () => {
    const userRankIndex = rankingData.findIndex(item => item.isCurrentUser);
    
    if (userRankIndex === 0) {
      return "🏆 Great job! You're leading the rankings!";
    } else if (userRankIndex === 1) {
      return "🥈 Almost there! You're in 2nd place!";
    } else if (userRankIndex === 2) {
      return "🥉 Not bad! You're in 3rd place!";
    } else {
      return `💪 Keep going! You're ${userRankIndex + 1}${getRankSuffix(userRankIndex + 1)} in the rankings`;
    }
  };
  
  const getRankSuffix = (rank) => {
    if (rank % 10 === 1 && rank !== 11) return "st";
    if (rank % 10 === 2 && rank !== 12) return "nd";
    if (rank % 10 === 3 && rank !== 13) return "rd";
    return "th";
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <br></br>      
      <br></br>
      <div className="flex-grow pt-16 px-6">
        <h1 className="text-3xl font-bold text-black text-center mb-6">Financial Dashboard</h1>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className={`p-4 text-white rounded-lg shadow ${balance >= 0 ? "bg-green-500" : "bg-red-500"}`}>
                <h2 className="text-lg font-semibold">Balance</h2>
                <p className="text-2xl font-bold">${balance.toFixed(2)}</p>
              </div>
              <div className="p-4 bg-green-100 text-green-700 rounded-lg shadow">
                <h2 className="text-lg font-semibold">Income</h2>
                <p className="text-2xl font-bold">${userData.income.toFixed(2)}</p>
              </div>
              <div className="p-4 bg-red-100 text-red-700 rounded-lg shadow">
                <h2 className="text-lg font-semibold">Expenses</h2>
                <p className="text-2xl font-bold">${userData.expenses.toFixed(2)}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Financial Overview Chart */}
              <div className="bg-white p-4 rounded-lg shadow">
                <h2 className="text-gray-900 font-semibold mb-3">Monthly Overview</h2>
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
                    <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white p-4 rounded-lg shadow">
                <h2 className="text-gray-900 font-semibold mb-3">Learning Progress</h2>
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
              
              {rankingData.length > 0 ? (
                <>
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
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.color} 
                            stroke={entry.isCurrentUser ? "#000" : "none"}
                            strokeWidth={entry.isCurrentUser ? 2 : 0}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                  <div className="mt-4 text-sm text-gray-600">
                    {getUserRankMessage()}
                  </div>
                </>
              ) : (
                <div className="flex justify-center items-center h-64 text-gray-500">
                  No ranking data available. Add friends to see how you compare!
                </div>
              )}
            </div>

            <div className="bg-white p-4 rounded-lg shadow mb-6">
              <h2 className="text-black font-semibold mb-3">Add Transaction</h2>
              <div className="flex flex-col md:flex-row gap-2">
                <input
                  type="text"
                  placeholder="Category"
                  value={newTransaction.category}
                  onChange={(e) => setNewTransaction({ ...newTransaction, category: e.target.value })}
                  className="border p-2 rounded md:mr-2 text-black w-full md:w-auto"
                />
                <select
                  value={newTransaction.type}
                  onChange={(e) => setNewTransaction({ ...newTransaction, type: e.target.value })}
                  className="border p-2 rounded md:mr-2 text-black w-full md:w-auto"
                >
                  <option value="Income">Income</option>
                  <option value="Expense">Expense</option>
                </select>
                <input
                  type="number"
                  placeholder="Amount"
                  value={newTransaction.amount}
                  onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
                  className="border p-2 rounded md:mr-2 text-black w-full md:w-auto"
                />
                <button 
                  onClick={addTransaction} 
                  className="bg-black text-white p-2 rounded w-full md:w-auto"
                >
                  Add
                </button>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-black font-semibold mb-3">Recent Transactions</h2>
              {transactions.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-200">
                        <th className="p-2 text-black text-left">Category</th>
                        <th className="p-2 text-black text-left">Type</th>
                        <th className="p-2 text-black text-right">Amount</th>
                        <th className="p-2 text-black text-right">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((tx, index) => (
                        <tr key={index} className="border-t">
                          <td className="p-2 text-black">{tx.category}</td>
                          <td className={`p-2 ${tx.type === "Income" ? "text-green-500" : "text-red-500"}`}>{tx.type}</td>
                          <td className={`p-2 text-right ${tx.type === "Income" ? "text-green-500" : "text-red-500"}`}>
                            ${tx.amount.toFixed(2)}
                          </td>
                          <td className="p-2 text-black text-right">
                            {new Date(tx.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No transactions found. Start adding your income and expenses!
                </div>
              )}
            </div>
          </>
        )}
      </div>
      <br></br>
     <Footer />
    </div>
  );
}