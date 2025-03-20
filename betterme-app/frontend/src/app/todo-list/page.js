"use client";
import './page.css';
import { useState } from 'react';

function App() {
  const [todos, setTodos] = useState([]);
  const [newToDoName, setNewToDoName] = useState("");
  const [newToDoDate, setNewToDoDate] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [editText, setEditText] = useState("");
  const [editDate, setEditDate] = useState("");

  const completeOrNotTodo = index => {
    const updatedTodos = [...todos];
    updatedTodos[index].isCompleted = !updatedTodos[index].isCompleted;
    setTodos(updatedTodos);
  };

  const addToDo = () => {
    if (newToDoName.trim() && newToDoDate) {
      const newTask = { text: newToDoName, date: newToDoDate, isCompleted: false };
      setTodos([...todos, newTask]);
      setNewToDoName("");
      setNewToDoDate("");
      console.log("Task added:", newTask);
    }
  };

  const deleteTodo = (index) => {
    const newTodo = [...todos];
    newTodo.splice(index, 1);
    setTodos(newTodo);
    console.log("Task deleted, new list:", newTodo);
  };

  const editTodo = (index) => {
    setEditIndex(index);
    setEditText(todos[index].text);
    setEditDate(todos[index].date || "");
    console.log("Editing task:", todos[index]);
  };

  const saveNewText = () => {
    if (editIndex !== null) {
      const updatedTodos = [...todos];
      updatedTodos[editIndex].text = editText;
      updatedTodos[editIndex].date = editDate;
      setTodos(updatedTodos);
      setEditIndex(null);
      console.log("Task updated:", updatedTodos[editIndex]);
    }
  };

  return (
    <div className="App">
      <h1>To-Do List</h1>
      <div className="flex gap-2 align-center justify-center">
      <textarea
        placeholder="Enter a new todo"
        value={newToDoName}
        onChange={e => setNewToDoName(e.target.value)}
      />
      <input
      className="border p-2 rounded bg-gray-600 w-1/2 h-10"
        type="date"
        value={newToDoDate}
        onChange={e => setNewToDoDate(e.target.value)}
      />
      </div>
      <button onClick={addToDo}>Add To-Do</button>
      

      <div className="todo-container">
        {todos.map((todo, index) => (
          <div key={index} className={`todo ${todo.isCompleted ? 'completed' : ''}`}>
            <div className='flex flex-col gap-2'>
            <span>{todo.text || "N/A"}</span>
            <span>{todo.date || "N/A"}</span>
            </div>
            <div className="todo-actions">
              <button onClick={() => completeOrNotTodo(index)}>
                {todo.isCompleted ? "Incomplete" : "Complete"}
              </button>
              <button className="edit" onClick={() => editTodo(index)}>
                Edit
              </button>
              <button className="delete" onClick={() => deleteTodo(index)}>
                Delete
              </button>
            </div>
            {editIndex === index && (
              <div className="flex flex-col gap-2 w-1/2">
                <textarea
                  className="border p-2 rounded w-full"
                  rows={1}
                  cols={1}
                  value={editText}
                  onChange={e => setEditText(e.target.value)}
                  placeholder="Edit your task"
                />
                <input
                  type="date"
                  value={editDate || ""}
                  onChange={e => setEditDate(e.target.value)}
                />
                <button 
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 self-center"
                  onClick={saveNewText}
                >
                  Save
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;