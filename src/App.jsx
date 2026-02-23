import { useState, useReducer } from "react";
import "./App.css";

const initialState = [
  {
    id: 1,
    title: "create todo",
    completed: true,
    editing: false,
    editText: "create todo",
  },
  {
    id: 2,
    title: "edit todo",
    completed: false,
    editing: true,
    editText: "edit todo",
  },
];

let nextId = 3;

function reducer(state, action) {
  switch (action.type) {
    case "add":
      return [
        {
          id: nextId++,
          title: action.title,
          completed: false,
          editing: false,
          editText: action.title,
        },
        ...state,
      ];
    case "toggle":
      return state.map((t) =>
        t.id === action.id ? { ...t, completed: !t.completed } : t,
      );
    case "delete":
      return state.filter((t) => t.id !== action.id);
    case "edit":
      return state.map((t) =>
        t.id === action.id ? { ...t, editing: true } : t,
      );
    case "doneEdit":
      return state.map((t) =>
        t.id === action.id ? { ...t, editText: action.text } : t,
      );
    case "save":
      return state.map((t) =>
        t.id === action.id ? { ...t, title: t.editText, editing: false } : t,
      );
    default:
      return state;
  }
}

export default function TodoList() {
  const [todos, dispatch] = useReducer(reducer, initialState);
  const [newTask, setNewTask] = useState("");

  function handleAdd() {
    if (!newTask.trim()) return;
    dispatch({ type: "add", title: newTask.trim() });
    setNewTask("");
  }

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        maxWidth: "400px",
      }}>
      <h1 style={{ marginBottom: "12px", fontSize: "32px" }}>
        Create Todo List
      </h1>

      {/* Add Task Row  */}
      <div style={{ display: "flex", gap: "4px", marginBottom: "10px" }}>
        <input
          style={{
            flex: 1,
            padding: "4px 6px",
            border: "1px solid #ccc",
            fontSize: "14px",
          }}
          placeholder="Add task"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
        />
        <button onClick={handleAdd} style={btnStyle}>
          Add
        </button>
      </div>

      {/* Todo Items */}
      {todos.map((todo) => (
        <div
          key={todo.id}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            marginBottom: "6px",
          }}>
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => dispatch({ type: "toggle", id: todo.id })}
          />

          {todo.editing ? (
            <input
              autoFocus
              value={todo.editText}
              onChange={(e) =>
                dispatch({
                  type: "doneEdit",
                  id: todo.id,
                  text: e.target.value,
                })
              }
              onKeyDown={(e) =>
                e.key === "Enter" && dispatch({ type: "SAVE", id: todo.id })
              }
              style={{
                padding: "3px 6px",
                border: "1px solid #fff",
                fontSize: "14px",
                width: "160px",
              }}
            />
          ) : (
            <span style={{ fontSize: "14px", minWidth: "130px" }}>
              {todo.title}
            </span>
          )}

          {todo.editing ? (
            <button
              onClick={() => dispatch({ type: "save", id: todo.id })}
              style={btnStyle}>
              Save
            </button>
          ) : (
            <>
              <button
                onClick={() => dispatch({ type: "edit", id: todo.id })}
                style={btnStyle}>
                Edit
              </button>
              <button
                onClick={() => dispatch({ type: "delete", id: todo.id })}
                disabled={!todo.completed}
                style={{
                  ...btnStyle,
                  color: todo.completed ? "#fff" : "#999",
                  cursor: todo.completed ? "pointer" : "not-allowed",
                }}>
                Delete
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

const btnStyle = {
  padding: "3px 10px",
  fontSize: "13px",
  color: "#fff",
  border: "1px solid #ccc",
  background: "#00F",
  cursor: "pointer",
};
