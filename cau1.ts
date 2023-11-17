Để tạo một API đơn giản với hai trường dữ liệu là id và todojob và sau đó sử dụng nó để hiển thị dữ liệu trong ứng dụng Native, bạn cần thực hiện một số bước sau:

Tạo API:
Bạn có thể sử dụng một số công cụ như Node.js và Express để tạo một API đơn giản. Dưới đây là một ví dụ đơn giản bằng Node.js:

javascript
Copy code
// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

let todoList = [];

app.get('/api/todos', (req, res) => {
  res.json(todoList);
});

app.post('/api/todos', (req, res) => {
  const { id, todojob } = req.body;
  const newTodo = { id, todojob };
  todoList.push(newTodo);
  res.json(newTodo);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
Gửi dữ liệu từ ứng dụng Native:
Trong ứng dụng Native của bạn, bạn sẽ cần sử dụng một thư viện HTTP client để gửi yêu cầu đến API. Dưới đây là một ví dụ sử dụng fetch:

javascript
Copy code
// NativeApp.js
import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';

const NativeApp = () => {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    // Fetch data from the API
    fetch('http://localhost:3000/api/todos')
      .then(response => response.json())
      .then(data => setTodos(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <View>
      <Text>Todo List:</Text>
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>{todo.todojob}</li>
        ))}
      </ul>
    </View>
  );
};

export default NativeApp;