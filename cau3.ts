// Để thực hiện việc cập nhật thông tin từ object state lên API đã tạo, bạn cần sử dụng thư viện Axios để thực hiện các HTTP requests. Dưới đây là một ví dụ về cách có thể triển khai tính năng cập nhật thông tin từ màn hình Screen_02 lên API:

// Cài đặt Axios:

// bash
// Copy code
//      npm install axios
// Cập nhật userSlice.ts:
// Thêm một action để thực hiện cập nhật thông tin người dùng lên API.

// typescript
// Copy code
// src/redux/slices/userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface User {
    id: number;
    password: string;
    todos: string[];
}

const initialState: User = {
    id: 0,
    password: '',
    todos: [],
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User>) => {
            return action.payload;
        },
        addTodo: (state, action: PayloadAction<string>) => {
            state.todos.push(action.payload);
        },
        deleteTodo: (state, action: PayloadAction<number>) => {
            state.todos.splice(action.payload, 1);
        },
        updateUserInfo: (state, action: PayloadAction<User>) => {
            // Update state
            state.id = action.payload.id;
            state.password = action.payload.password;
            state.todos = action.payload.todos;

            // Update API
            axios.put(`https://api.example.com/users/${action.payload.id}`, {
                id: action.payload.id,
                password: action.payload.password,
                todos: action.payload.todos,
            });
        },
    },
});

export const { setUser, addTodo, deleteTodo, updateUserInfo } =
    userSlice.actions;
export default userSlice.reducer;
// Cập nhật Screen_02.tsx:
// Thêm button "Update" và sử dụng action mới tạo để cập nhật thông tin lên API.

// tsx
// Copy code
// src/screens/Screen_02.tsx
import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, Button } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { addTodo, deleteTodo, updateUserInfo } from '../redux/slices/userSlice';
import { RootState } from '../redux/store';

const Screen_02: React.FC = () => {
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.user);
    const [newTodo, setNewTodo] = useState('');

    const handleAddTodo = () => {
        if (newTodo.trim() !== '') {
            dispatch(addTodo(newTodo));
            setNewTodo('');
        }
    };

    const handleDeleteTodo = (index: number) => {
        dispatch(deleteTodo(index));
    };

    const handleUpdateUserInfo = () => {
        dispatch(updateUserInfo(user));
    };

    return (
        <View>
            <Text>User ID: {user.id}</Text>
            <Text>Password: {user.password}</Text>
            <Text>Todos:</Text>
            <FlatList
                data={user.todos}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => (
                    <View>
                        <Text>{item}</Text>
                        <Button
                            title="Delete"
                            onPress={() => handleDeleteTodo(index)}
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
// Lưu ý rằng trong thực tế, bạn cần thay thế URL https://api.example.com/users/${action.payload.id} bằng URL thực tế của API của bạn. Đồng thời, bạn cũng có thể thêm xử lý lỗi và feedback cho người dùng khi thực hiện cập nhật.
