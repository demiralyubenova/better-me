"use client";
import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function Dashboard() {
    const [userData, setUserData] = useState({
      age: "",
      location: "",
      income: 0,
      expenses: 0,
    });
  

  const [transactions, setTransactions] = useState([]);
  const [newTransaction, setNewTransaction] = useState({ category: "", type: "Income", amount: "" });

  useEffect(() => {
    const storedData = localStorage.getItem("userData");
    if (storedData) {
      setUserData(JSON.parse(storedData));
    }

    const storedTransactions = localStorage.getItem("transactions");
    if (storedTransactions) {
      setTransactions(JSON.parse(storedTransactions));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    const income = transactions.filter(tx => tx.type === "Income").reduce((acc, tx) => acc + tx.amount, 0);
    const expenses = transactions.filter(tx => tx.type === "Expense").reduce((acc, tx) => acc + tx.amount, 0);
    setUserData({ income, expenses });
  }, [transactions]);

  const balance = userData.income - userData.expenses;

  const addTransaction = () => {
    if (!newTransaction.category || !newTransaction.amount) return;

    const amount = parseFloat(newTransaction.amount);
    const updatedTransactions = [...transactions, { ...newTransaction, amount }];
    setTransactions(updatedTransactions);
    setNewTransaction({ category: "", type: "Income", amount: "" });
  };

    const chartData = [
    { name: "Jan", income: 5000, expenses: 2000 },
    { name: "Feb", income: 6000, expenses: 2500 },
    { name: "Mar", income: 7000, expenses: 3000 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
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

                  {/* Bar Chart */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="text-blue-500 font-semibold mb-3">Месечен Преглед</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="income" fill="#4CAF50" />
            <Bar dataKey="expenses" fill="#F44336" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Add Transaction */}
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
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx, index) => (
              <tr key={index} className="border-t">
                <td className="p-2 text-black">{tx.category}</td>
                <td className={`p-2 ${tx.type === "Income" ? "text-green-500" : "text-red-500"}`}>{tx.type}</td>
                <td className="p-2 text-black">${tx.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
