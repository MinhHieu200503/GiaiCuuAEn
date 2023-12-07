
// Dưới đây là một ví dụ cụ thể về cách sử dụng TypeScript, Redux Toolkit và React Native Expo để thiết kế màn hình Screen_02 và thực hiện các yêu cầu của bạn.

// Cài đặt thư viện Redux Toolkit và Axios:

// bash
// Copy code
// npm install @reduxjs/toolkit react-redux axios
// Tạo file userSlice.ts trong thư mục redux/slices:

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
    addTodo: (state, action: PayloadAction<string>) => {
      state.todos.push(action.payload);
    },
    deleteTodo: (state, action: PayloadAction<number>) => {
      state.todos.splice(action.payload, 1);
    },
  },
});

export const { setUser, addTodo, deleteTodo } = userSlice.actions;
export default userSlice.reducer;
// Tạo Redux Store:
// Tạo file store.ts trong thư mục redux:

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
// Tạo màn hình Screen_02:
// Tạo file Screen_02.tsx trong thư mục screens:

// typescript
// Copy code
// src/screens/Screen_02.tsx
import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, Button } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { addTodo, deleteTodo } from '../redux/slices/userSlice';
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
            <Button title="Delete" onPress={() => handleDeleteTodo(index)} />
          </View>
        )}
      />
      <TextInput
        placeholder="Add a new todo"
        value={newTodo}
        onChangeText={text => setNewTodo(text)}
      />
      <Button title="Add" onPress={handleAddTodo} />
    </View>
  );
};

export default Screen_02;
// Integrate with Screen_01 and App:
// Cập nhật Screen_01.tsx và App.tsx để thực hiện điều hướng giữa Screen_01 và Screen_02.

// typescript
// Copy code
// src/screens/Screen_01.tsx
import React from 'react';
import { View, Text, Button } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';

interface Screen01Props {
  navigation: NavigationProp<RootStackParamList, 'Screen_01'>;
}

const Screen_01: React.FC<Screen01Props> = ({ navigation }) => {
  return (
    <View>
      <Text>Login</Text>
      {/* Add your login logic here */}
      <Button
        title="Continue"
        onPress={() => {
          // Assume successful login
          navigation.navigate('Screen_02');
        }}
      />
    </View>
  );
};

export default Screen_01;
typescript
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
// Định nghĩa kiểu cho React Navigation:
// Tạo file types/navigation.ts để định nghĩa kiểu cho React Navigation.

// typescript
// Copy code
// src/types/navigation.ts
import { StackNavigationProp } from '@react-navigation/stack';

export type RootStackParamList = {
  Screen_01: undefined;
  Screen_02: undefined;
};

export type Screen_01NavigationProp = StackNavigationProp<RootStackParamList, 'Screen_01'>;
// Chắc chắn rằng bạn đã cài đặt TypeScript và Expo trước khi thực hiện các bước trên.