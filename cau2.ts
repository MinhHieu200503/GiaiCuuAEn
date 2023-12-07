// Dưới đây là một ví dụ cách thiết kế màn hình Screen_02 và thực hiện các yêu cầu bạn đã nêu, sử dụng React Native Expo và Redux Toolkit:

// Cài đặt Redux Toolkit:
// bash
// Copy code
//     npm install @reduxjs/toolkit react-redux
// Tạo file userSlice.js trong thư mục redux/slices:
// javascript
// Copy code
// redux/slices/userSlice.js
import { createSlice } from '@reduxjs/toolkit';

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
    },
});

export const { setUser, addTodo, deleteTodo } = userSlice.actions;
export default userSlice.reducer;
// Sửa đổi file userReducer.js trong thư mục redux/reducers:
// javascript
// Copy code
// redux/reducers/userReducer.js
import { combineReducers } from 'redux';
import userReducer from '../slices/userSlice';

const rootReducer = combineReducers({
    user: userReducer,
});

export default rootReducer;
// Sửa đổi file store.js trong thư mục redux:
// javascript
// Copy code
// redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducers/userReducer';

const store = configureStore({
    reducer: rootReducer,
});

export default store;
// Sửa đổi file Screen_01.js để sử dụng Redux Toolkit:
// javascript
// Copy code
// Screen_01.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { setUser } from './redux/slices/userSlice';
import { loginUser } from './api';

const Screen_01 = ({ navigation }) => {
    const dispatch = useDispatch();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            const user = await loginUser(email, password);

            if (user) {
                dispatch(setUser(user)); // Lưu thông tin user vào Redux store
                Alert.alert('Login successful!', 'Redirecting to Screen 02...');
                // Thêm logic chuyển màn hình tại đây
                // Ví dụ: navigation.navigate('Screen_02');
            } else {
                Alert.alert('Invalid email or password', 'Please try again.');
            }
        } catch (error) {
            console.error('Error during login:', error);
        }
    };

    return (
        <View>
            <Text>Login</Text>
            <TextInput
                placeholder="Enter your email"
                value={email}
                onChangeText={(text) => setEmail(text)}
            />
            <TextInput
                placeholder="Enter your password"
                secureTextEntry
                value={password}
                onChangeText={(text) => setPassword(text)}
            />
            <Button title="Continue" onPress={handleLogin} />
        </View>
    );
};

export default Screen_01;
// Tạo file Screen_02.js để hiển thị thông tin và thêm/xóa công việc:
// javascript
// Copy code
// Screen_02.js
import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, Button, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { addTodo, deleteTodo } from './redux/slices/userSlice';

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
        </View>
    );
};

export default Screen_02;
// Sửa đổi file App.js để thêm màn hình Screen_02:
// javascript
// Copy code
// App.js
import React from 'react';
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Screen_01 from './Screen_01';
import Screen_02 from './Screen_02';
import userReducer from './redux/reducers/userReducer';

const rootReducer = combineReducers({
    user: userReducer,
});

const store = createStore(rootReducer);

const Stack = createStackNavigator();

const App = () => {
    return (
        <Provider store={store}>
            <NavigationContainer>
                <Stack.Navigator initialRouteName="Screen_01">
                    <Stack.Screen name="Screen_01" component={Screen_01} />
                    <Stack.Screen name="Screen_02" component={Screen_02} />
                </Stack.Navigator>
            </NavigationContainer>
        </Provider>
    );
};

export default App;
// Lưu ý rằng trong ví dụ này, các công việc được lưu trữ trong mảng todos của Redux store. Bạn có thể tùy chỉnh và mở rộng logic để đáp ứng đúng với yêu cầu cụ thể của ứng dụng của mình.
