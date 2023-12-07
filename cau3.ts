// Để cập nhật thông tin lên API, bạn có thể sử dụng thư viện axios hoặc các phương thức khác để thực hiện các yêu cầu HTTP. Dưới đây là một ví dụ cách sử dụng Redux Toolkit và Axios để tạo nút "Update" và cập nhật thông tin lên API.

// Cài đặt thư viện Axios:
// bash
// Copy code
//      npm install axios
// Sửa đổi file userSlice.js trong thư mục redux/slices:
// javascript
// Copy code
// redux/slices/userSlice.js
import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const userSlice = createSlice({
    name: 'user',
    initialState: { id: 0, password: '', todos: [] },
    reducers: {
        setUser: (state, action) => {
            return action.payload;
        },
        addTodo: (state, action) => {
            state.todos.push(action.payload);
        },
        deleteTodo: (state, action) => {
            state.todos = state.todos.filter((todo) => todo !== action.payload);
        },
        updateUserInfo: async (state, action) => {
            try {
                const response = await axios.put(
                    `https://6145c71638339400175fc557.mockapi.io/users/${state.id}`,
                    {
                        password: state.password,
                        todos: state.todos,
                    }
                );

                console.log('Update success:', response.data);
            } catch (error) {
                console.error('Error during update:', error);
            }
        },
    },
});

export const { setUser, addTodo, deleteTodo, updateUserInfo } =
    userSlice.actions;
export default userSlice.reducer;
// Sửa đổi file Screen_02.js để thêm nút "Update":
// javascript
// Copy code
// Screen_02.js
import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, Button, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { addTodo, deleteTodo, updateUserInfo } from './redux/slices/userSlice';

const Screen_02 = () => {
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const [newTodo, setNewTodo] = useState('');

    const handleAddTodo = () => {
        if (newTodo.trim() !== '') {
            dispatch(addTodo(newTodo));
            setNewTodo('');
        } else {
            Alert.alert('Error', 'Please enter a valid todo.');
        }
    };

    const handleDeleteTodo = (todo) => {
        dispatch(deleteTodo(todo));
    };

    const handleUpdateUserInfo = () => {
        dispatch(updateUserInfo());
    };

    return (
        <View>
            <Text>User ID: {user.id}</Text>
            <Text>Password: {user.password}</Text>
            <Text>Todos:</Text>
            <FlatList
                data={user.todos}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View>
                        <Text>{item}</Text>
                        <Button
                            title="Delete"
                            onPress={() => handleDeleteTodo(item)}
                        />
                    </View>
                )}
            />
            <TextInput
                placeholder="Add a new todo"
                value={newTodo}
                onChangeText={(text) => setNewTodo(text)}
            />
            <Button title="Add" onPress={handleAddTodo} />
            <Button title="Update" onPress={handleUpdateUserInfo} />
        </View>
    );
};

export default Screen_02;
