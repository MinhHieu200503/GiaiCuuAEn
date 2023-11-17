Để tích hợp Redux và Redux Toolkit vào ứng dụng React Native và hiển thị dữ liệu từ API lên màn hình, bạn cần thực hiện một số bước cơ bản. Dưới đây là một hướng dẫn đơn giản:

Cài đặt thư viện Redux và Redux Toolkit:
bash
Copy code
npm install @reduxjs/toolkit react-redux
Tạo Redux Slice:
Tạo một Redux Slice để quản lý trạng thái của danh sách công việc.

jsx
Copy code
// slices/todoSlice.js
import { createSlice } from '@reduxjs/toolkit';

const todoSlice = createSlice({
  name: 'todos',
  initialState: [],
  reducers: {
    setTodos: (state, action) => {
      return action.payload;
    },
  },
});

export const { setTodos } = todoSlice.actions;
export default todoSlice.reducer;
Tạo Redux Store:
jsx
Copy code
// store.js
import { configureStore } from '@reduxjs/toolkit';
import todoReducer from './slices/todoSlice';

const store = configureStore({
  reducer: {
    todos: todoReducer,
  },
});

export default store;
Kết nối Redux Store với ứng dụng chính:
jsx
Copy code
// App.js
import React from 'react';
import { Provider } from 'react-redux';
import store from './store';
import TodoList from './TodoList';

const App = () => {
  return (
    <Provider store={store}>
      <TodoList />
    </Provider>
  );
};

export default App;
Tạo Component hiển thị danh sách công việc:
jsx
Copy code
// TodoList.js
import React, { useEffect } from 'react';
import { View, Text, FlatList } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setTodos } from './slices/todoSlice';
import axios from 'axios';

const TodoList = () => {
  const dispatch = useDispatch();
  const todos = useSelector(state => state.todos);

  useEffect(() => {
    // Fetch data from the API
    axios.get('http://localhost:3000/api/todos')
      .then(response => dispatch(setTodos(response.data)))
      .catch(error => console.error('Error fetching data:', error));
  }, [dispatch]);

  return (
    <View>
      <Text>Todo List:</Text>
      <FlatList
        data={todos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Text>{item.todojob}</Text>
        )}
      />
    </View>
  );
};

export default TodoList;
Trong đoạn mã trên, chúng ta sử dụng hook useDispatch để gửi action đến Redux Store và useSelector để lấy dữ liệu từ Redux Store.

Lưu ý: Đảm bảo rằng bạn đã khởi động máy chủ Node.js (chứa API) và điều chỉnh URL trong axios.get phản ánh URL của máy chủ của bạn.


// ==========================================================================================================================================================
                                                                                            // CRUD TodoList
// Để thêm, xóa, và sửa các công việc trong danh sách Todo sử dụng Redux và Redux Toolkit, bạn cần thực hiện một số bước. Dưới đây là một hướng dẫn cơ bản:

// Sửa Redux Slice (todoSlice.js):
// jsx

// slices/todoSlice.js
import { createSlice } from '@reduxjs/toolkit';

const todoSlice = createSlice({
  name: 'todos',
  initialState: [],
  reducers: {
    setTodos: (state, action) => {
      return action.payload;
    },
    addTodo: (state, action) => {
      state.push(action.payload);
    },
    deleteTodo: (state, action) => {
      return state.filter(todo => todo.id !== action.payload);
    },
    updateTodo: (state, action) => {
      const { id, updatedTodo } = action.payload;
      const index = state.findIndex(todo => todo.id === id);
      if (index !== -1) {
        state[index] = updatedTodo;
      }
    },
  },
});

export const { setTodos, addTodo, deleteTodo, updateTodo } = todoSlice.actions;
export default todoSlice.reducer;
// Tạo Component để thêm, xóa, và sửa công việc (TodoList.js):
// jsx
// Copy code
// TodoList.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, Button } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setTodos, addTodo, deleteTodo, updateTodo } from './slices/todoSlice';
import axios from 'axios';

const TodoList = () => {
  const dispatch = useDispatch();
  const todos = useSelector(state => state.todos);

  const [newTodo, setNewTodo] = useState('');
  const [editTodo, setEditTodo] = useState({ id: null, text: '' });

  useEffect(() => {
    // Fetch data from the API
    axios.get('http://localhost:3000/api/todos')
      .then(response => dispatch(setTodos(response.data)))
      .catch(error => console.error('Error fetching data:', error));
  }, [dispatch]);

  const handleAddTodo = () => {
    const todo = { id: Date.now(), todojob: newTodo };
    dispatch(addTodo(todo));
    setNewTodo('');
  };

  const handleDeleteTodo = (id) => {
    dispatch(deleteTodo(id));
  };

  const handleEditTodo = () => {
    dispatch(updateTodo({ id: editTodo.id, updatedTodo: { id: editTodo.id, todojob: editTodo.text } }));
    setEditTodo({ id: null, text: '' });
  };

  return (
    <View>
      <Text>Todo List:</Text>
      <TextInput
        placeholder="New Todo"
        value={newTodo}
        onChangeText={(text) => setNewTodo(text)}
      />
      <Button title="Add" onPress={handleAddTodo} />
      <FlatList
        data={todos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View>
            <Text>{item.todojob}</Text>
            <Button title="Edit" onPress={() => setEditTodo({ id: item.id, text: item.todojob })} />
            <Button title="Delete" onPress={() => handleDeleteTodo(item.id)} />
          </View>
        )}
      />
      {editTodo.id !== null && (
        <View>
          <TextInput
            placeholder="Edit Todo"
            value={editTodo.text}
            onChangeText={(text) => setEditTodo({ ...editTodo, text })}
          />
          <Button title="Save" onPress={handleEditTodo} />
        </View>
      )}
    </View>
  );
};

export default TodoList;