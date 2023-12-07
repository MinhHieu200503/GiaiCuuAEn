// Để sử dụng React Native Expo, Redux và TypeScript để tạo màn hình Screen_01, bạn có thể làm theo các bước sau:

// Khởi tạo Dự án Expo TypeScript:

// bash
// Copy code
// expo init MyProject --template expo-template-blank-typescript
// cd MyProject
// Cài đặt thư viện Redux và Axios:

// bash
// Copy code
// npm install redux react-redux axios
// Tạo thư mục redux và tạo các file cho Redux:

// Trong thư mục src, tạo thư mục redux.
// Trong thư mục redux, tạo các thư mục actions, reducers, slices.
// Trong thư mục redux, tạo file store.ts:
// typescript
// Copy code
// src/redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
// Trong thư mục redux, tạo file slices/userSlice.ts:
// typescript
// Copy code
// src/redux/slices/userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
// Tạo màn hình Screen_01 sử dụng React Navigation và Redux:

// Cài đặt React Navigation:
// bash
// Copy code
// npm install @react-navigation/native @react-navigation/stack
// Trong thư mục src, tạo file screens/Screen_01.tsx:
// tsx
// Copy code
// src/screens/Screen_01.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/slices/userSlice';
import { NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';

interface Screen01Props {
  navigation: NavigationProp<RootStackParamList, 'Screen_01'>;
}

const Screen_01: React.FC<Screen01Props> = ({ navigation }) => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      // Gọi API để kiểm tra thông tin đăng nhập
      // (Sử dụng API mock trong trường hợp này)
      const response = await fetch('https://6145c71638339400175fc557.mockapi.io/users');
      const users = await response.json();
      const user = users.find(u => u.password === password && u.id.toString() === email);

      if (user) {
        dispatch(setUser(user)); // Lưu thông tin user vào Redux store
        Alert.alert('Login successful!', 'Redirecting to Screen 02...');
        navigation.navigate('Screen_02');
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
        onChangeText={text => setEmail(text)}
        keyboardType="numeric"
      />
      <TextInput
        placeholder="Enter your password"
        secureTextEntry
        value={password}
        onChangeText={text => setPassword(text)}
      />
      <Button title="Continue" onPress={handleLogin} />
    </View>
  );
};

export default Screen_01;
// Tạo file screens/Screen_02.tsx:
// tsx
// Copy code
// src/screens/Screen_02.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

const Screen_02: React.FC = () => {
  const user = useSelector((state: RootState) => state.user);

  return (
    <View>
      <Text>User ID: {user.id}</Text>
      <Text>Password: {user.password}</Text>
      <Text>Todos: {JSON.stringify(user.todos)}</Text>
    </View>
  );
};

export default Screen_02;
// Tạo file types/navigation.ts để định nghĩa kiểu cho React Navigation:
// typescript
// Copy code
// src/types/navigation.ts
import { StackNavigationProp } from '@react-navigation/stack';

export type RootStackParamList = {
  Screen_01: undefined;
  Screen_02: undefined;
};

export type Screen_01NavigationProp = StackNavigationProp<RootStackParamList, 'Screen_01'>;
Cập nhật file src/App.tsx để sử dụng React Navigation:
tsx
Copy code
// src/App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider } from 'react-redux';
import Screen_01 from './screens/Screen_01';
import Screen_02 from './screens/Screen_02';
import store from './redux/store';
import { RootStackParamList } from './types/navigation';

const Stack = createStackNavigator<RootStackParamList>();

const App: React.FC = () => {
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
// Chắc chắn rằng bạn đã cài đặt Expo và TypeScript trước khi bắt đầu thực hiện các bước trên.





