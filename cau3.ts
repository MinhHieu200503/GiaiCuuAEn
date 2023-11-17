// cập nhật Redux Slice (todoSlice.js):
// Thêm một action để cập nhật công việc trên API:


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
    updateTodoOnApi: (state, action) => {
      // Thực hiện cập nhật công việc trên API ở đây
    },
  },
});

export const { setTodos, addTodo, deleteTodo, updateTodo, updateTodoOnApi } = todoSlice.actions;
export default todoSlice.reducer;
// Tạo một Redux Thunk để xử lý cập nhật API:
// Redux Toolkit cho phép sử dụng Redux Thunk để thực hiện các thao tác bất đồng bộ. Tạo một file mới để chứa các Redux Thunk:


// thunks/todoThunks.js
import { updateTodoOnApi } from '../slices/todoSlice';

export const updateTodoApi = (id, updatedTodo) => {
  return async (dispatch) => {
    try {
      // Thực hiện cập nhật công việc trên API ở đây
      // Ví dụ: fetch hoặc sử dụng các thư viện khác thay thế cho Axios
      // Có thể sử dụng hàm window.fetch hoặc các thư viện như 'axios' hoặc 'superagent'

      // Ví dụ sử dụng window.fetch:
      const response = await fetch(`http://localhost:3000/api/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTodo),
      });

      if (!response.ok) {
        throw new Error('Update failed');
      }

      // Cập nhật trạng thái Redux sau khi cập nhật thành công trên API
      dispatch(updateTodoOnApi({ id, updatedTodo }));
    } catch (error) {
      console.error('Error updating todo on API:', error);
    }
  };
};
Sử dụng Redux Thunk trong Component TodoList (TodoList.js):
jsx
Copy code
// TodoList.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, Button } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setTodos, addTodo, deleteTodo, updateTodo } from './slices/todoSlice';
import { updateTodoApi } from './thunks/todoThunks';

const TodoList = () => {
  const dispatch = useDispatch();
  const todos = useSelector(state => state.todos);

  const [newTodo, setNewTodo] = useState('');
  const [editTodo, setEditTodo] = useState({ id: null, text: '' });

  useEffect(() => {
    // Fetch data from the API
    fetch('http://localhost:3000/api/todos')
      .then(response => response.json())
      .then(data => dispatch(setTodos(data)))
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
    dispatch(updateTodoApi(editTodo.id, { id: editTodo.id, todojob: editTodo.text }));
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
Trong đoạn mã trên, chúng ta đã thêm một Redux Thunk updateTodoApi để xử lý cập nhật công việc trên API. Khi người dùng nhấn nút "Save" để chỉnh sửa công việc, chúng ta gọi cả hai action Redux và Redux Thunk để cập nhật trạng thái của ứng dụng và cập nhật API.