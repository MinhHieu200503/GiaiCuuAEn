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