// Để sử dụng Redux trong ứng dụng React Native với Expo, bạn cần cài đặt thư viện react-redux và redux. Dưới đây là hướng dẫn chi tiết:

// Bắt đầu một dự án Expo mới:
// bash
// Copy code
// expo init ReduxApp
// cd ReduxApp
// Cài đặt thư viện Redux và React Redux:
// bash
// Copy code
// npm install redux react-redux
// Tạo các thư mục và file cho Redux:
// Tạo thư mục redux và bên trong tạo các thư mục actions, reducers.
// Tạo file types.js trong thư mục actions:
// javascript
// Copy code
// actions/types.js
export const SET_USER = 'SET_USER';
// Tạo file userActions.js trong thư mục actions:
// javascript
// Copy code
// actions/userActions.js
import { SET_USER } from './types';

export const setUser = (user) => ({
    type: SET_USER,
    payload: user,
});
// Tạo file userReducer.js trong thư mục reducers:
// javascript
// Copy code
// reducers/userReducer.js
import { SET_USER } from '../actions/types';

const initialState = {
    user: null,
};

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_USER:
            return {
                ...state,
                user: action.payload,
            };
        default:
            return state;
    }
};

export default userReducer;
// Kết nối Redux với ứng dụng:
// Sửa file App.js để kết nối Redux:
// javascript
// Copy code
// // App.js
import React from 'react';
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Screen_01 from './Screen_01';
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
                    {/* Thêm các màn hình khác tại đây nếu cần */}
                </Stack.Navigator>
            </NavigationContainer>
        </Provider>
    );
};

export default App;
// Sửa đổi Screen_01.js để sử dụng Redux:
// javascript
// Copy code
// Screen_01.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { setUser } from './redux/actions/userActions';
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
// Trong ví dụ này, Redux được sử dụng để lưu trữ thông tin người dùng sau khi đăng nhập, và useDispatch hook được sử dụng để gửi hành động setUser đến Redux store. Ngoài ra, bạn có thể sử dụng useSelector hook để truy cập thông tin từ Redux store nếu cần thiết.
