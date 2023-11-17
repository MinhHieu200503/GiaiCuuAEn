// Dưới đây là hướng dẫn để tạo một ứng dụng Todo List sử dụng ReactJS, Redux và Axios để gọi API. Trong hướng dẫn này, chúng ta sẽ sử dụng JSONPlaceholder làm API mẫu.

// Tạo ứng dụng React:
// Sử dụng Create React App để tạo một ứng dụng React mới:

// bash
// Copy code
// npx create-react-app redux-todo-app
// cd redux-todo-app
// Cài đặt Redux và Axios:
// Cài đặt Redux, React Redux, và Axios:

// bash
// Copy code
// npm install redux react-redux axios
// # hoặc
// yarn add redux react-redux axios
// Tạo Redux Store:
// Tạo một store Redux trong file src/store/index.js:

// jsx
// Copy code
// // src/store/index.js
// import { createStore, applyMiddleware } from 'redux';
// import thunk from 'redux-thunk';
// import rootReducer from './reducers';

// const store = createStore(rootReducer, applyMiddleware(thunk));

// export default store;
// Tạo các reducers trong thư mục src/store/reducers.

// Tạo Action và Reducer:
// Tạo action và reducer để thực hiện việc thêm công việc, lấy danh sách công việc và cập nhật trạng thái công việc. Sử dụng Axios để thực hiện các yêu cầu HTTP.

// jsx
// Copy code
// src/store/actions/todoActions.js
import axios from 'axios';

export const fetchTodosSuccess = (todos) => ({
    type: 'FETCH_TODOS_SUCCESS',
    payload: todos,
});

export const fetchTodosFailure = (error) => ({
    type: 'FETCH_TODOS_FAILURE',
    payload: error,
});

export const addTodoSuccess = (todo) => ({
    type: 'ADD_TODO_SUCCESS',
    payload: todo,
});

export const addTodoFailure = (error) => ({
    type: 'ADD_TODO_FAILURE',
    payload: error,
});

export const toggleTodo = (id) => ({
    type: 'TOGGLE_TODO',
    payload: id,
});

export const fetchTodos = () => async (dispatch) => {
    try {
        const response = await axios.get(
            'https://jsonplaceholder.typicode.com/todos'
        );
        dispatch(fetchTodosSuccess(response.data));
    } catch (error) {
        dispatch(fetchTodosFailure(error.message));
    }
};

export const addTodo = (title) => async (dispatch) => {
    try {
        const response = await axios.post(
            'https://jsonplaceholder.typicode.com/todos',
            {
                title,
                completed: false,
            }
        );
        dispatch(addTodoSuccess(response.data));
    } catch (error) {
        dispatch(addTodoFailure(error.message));
    }
};
// jsx
// Copy code
// src/store/reducers/todoReducer.js
const initialState = {
    todos: [],
    error: null,
};

const todoReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'FETCH_TODOS_SUCCESS':
            return { ...state, todos: action.payload, error: null };
        case 'FETCH_TODOS_FAILURE':
            return { ...state, todos: [], error: action.payload };
        case 'ADD_TODO_SUCCESS':
            return {
                ...state,
                todos: [...state.todos, action.payload],
                error: null,
            };
        case 'ADD_TODO_FAILURE':
            return { ...state, error: action.payload };
        case 'TOGGLE_TODO':
            return {
                ...state,
                todos: state.todos.map((todo) =>
                    todo.id === action.payload
                        ? { ...todo, completed: !todo.completed }
                        : todo
                ),
            };
        default:
            return state;
    }
};

export default todoReducer;
// Kết hợp reducers trong src/store/reducers/index.js.

// Kết nối Redux với React:
// Kết hợp Redux với ứng dụng React trong file src/index.js.

// jsx
// Copy code
// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './store';
import App from './App';
import './index.css';

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);
// Tạo thành phần TodoList:

// jsx
// Copy code
// src/components/TodoList.js
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { fetchTodos, addTodo, toggleTodo } from '../store/actions/todoActions';

const TodoList = ({ todos, error, fetchTodos, addTodo, toggleTodo }) => {
    useEffect(() => {
        fetchTodos();
    }, [fetchTodos]);

    const handleAddTodo = () => {
        const title = prompt('Enter todo title:');
        if (title) {
            addTodo(title);
        }
    };

    return (
        <div>
            <h1>Todo List</h1>
            <button onClick={handleAddTodo}>Add Todo</button>
            {error && <div>Error: {error}</div>}
            <ul>
                {todos.map((todo) => (
                    <li
                        key={todo.id}
                        style={{
                            textDecoration: todo.completed
                                ? 'line-through'
                                : 'none',
                        }}
                        onClick={() => toggleTodo(todo.id)}
                    >
                        {todo.title}
                    </li>
                ))}
            </ul>
        </div>
    );
};

const mapStateToProps = (state) => ({
    todos: state.todo.todos,
    error: state.todo.error,
});

export default connect(mapStateToProps, { fetchTodos, addTodo, toggleTodo })(
    TodoList
);
