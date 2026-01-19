import { useState, useEffect } from 'react';
import './App.css';

function App() {
  // 테마 상태 관리 (초기값은 시스템 설정 또는 라이트 모드)
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  // 할 일 목록 상태 관리
  const [todos, setTodos] = useState([]);
  // 입력창의 값 상태 관리
  const [inputValue, setInputValue] = useState('');

  // 테마 변경 시 localStorage에 저장하고 body에 클래스 적용
  useEffect(() => {
    document.body.className = '';
    document.body.classList.add(`${theme}-theme`);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // 컴포넌트 마운트 시 localStorage에서 할 일 목록 불러오기
  useEffect(() => {
    try {
      const storedTodos = JSON.parse(localStorage.getItem('todos'));
      if (storedTodos) {
        setTodos(storedTodos);
      }
    } catch (error) {
      console.error("Failed to parse todos from localStorage", error);
      localStorage.removeItem('todos'); // 손상된 데이터 삭제
    }
  }, []);

  // todos 상태가 변경될 때마다 localStorage에 저장
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  // 테마 전환 함수
  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // 입력창 값 변경 핸들러
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  // 할 일 추가 함수
  const handleAddTodo = (e) => {
    e.preventDefault();
    if (inputValue.trim() === '') {
      alert('할 일을 입력해주세요!');
      return;
    }
    const newTodo = {
      id: Date.now(),
      text: inputValue,
      completed: false,
    };
    setTodos([newTodo, ...todos]); // 최신 항목을 위로
    setInputValue('');
  };

  // 할 일 완료/미완료 토글 함수
  const handleToggleComplete = (id) => {
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  // 할 일 삭제 함수
  const handleDeleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <div className="app-container">
      <div className="todo-app">
        <header className="app-header">
          <h1>My Tasks</h1>
          <button onClick={toggleTheme} className="theme-toggle-btn">
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </header>

        <form onSubmit={handleAddTodo} className="todo-form">
          <input
            type="text"
            className="todo-input"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="새로운 할 일을 추가하세요..."
          />
          <button type="submit" className="add-btn">추가</button>
        </form>

        <ul className="todo-list">
          {todos.map(todo => (
            <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
              <div className="checkbox-container" onClick={() => handleToggleComplete(todo.id)}>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => {}} // 컨테이너 클릭으로 핸들링
                  className="todo-checkbox"
                />
                 <span className="custom-checkbox"></span>
              </div>
              <span className="todo-text">{todo.text}</span>
              <button onClick={() => handleDeleteTodo(todo.id)} className="delete-btn">
                ✕
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;