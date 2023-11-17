// Dưới đây là hướng dẫn chi tiết để cài đặt Redux trong ứng dụng ReactJS để gọi API và hiển thị dữ liệu mà không sử dụng thư viện Axios. Trong hướng dẫn này, chúng ta sẽ sử dụng fetch để thực hiện các yêu cầu HTTP.

// Tạo ứng dụng React:
// Sử dụng Create React App để tạo một ứng dụng React mới:

// bash
// Copy code
// npx create-react-app my-redux-app
// cd my-redux-app
// Cài đặt Redux và các thư viện liên quan:
// Cài đặt Redux, React Redux, và Redux Thunk:

// bash
// Copy code
// npm install redux react-redux redux-thunk
// # hoặc
// yarn add redux react-redux redux-thunk
// Tạo Redux Store:
// Tạo một store Redux trong file src/store/index.js:

// jsx
// Copy code
// // src/store/index.js
// import { createStore, applyMiddleware } from 'redux';
// import thunk from 'redux-thunk';
// import rootReducer from './reducers';

// const store = createStore(rootReducer, applyMiddleware(thunk));

// export default store;
// Tạo các reducers trong thư mục src/store/reducers.

// Tạo Action và Reducer:
// Tạo action và reducer để thực hiện việc gọi API và lưu trữ dữ liệu vào store. Sử dụng fetch để thực hiện các yêu cầu HTTP.

// jsx
// Copy code
// // src/store/actions/dataActions.js
// export const fetchData = () => async (dispatch) => {
//   try {
//     const response = await fetch('https://api.example.com/data');
//     const data = await response.json();
//     dispatch({ type: 'FETCH_DATA_SUCCESS', payload: data });
//   } catch (error) {
//     dispatch({ type: 'FETCH_DATA_FAILURE', payload: error.message });
//   }
// };
// jsx
// Copy code
// // src/store/reducers/dataReducer.js
// const initialState = {
//   data: [],
//   error: null,
// };

// const dataReducer = (state = initialState, action) => {
//   switch (action.type) {
//     case 'FETCH_DATA_SUCCESS':
//       return { ...state, data: action.payload, error: null };
//     case 'FETCH_DATA_FAILURE':
//       return { ...state, data: [], error: action.payload };
//     default:
//       return state;
//   }
// };

// export default dataReducer;
// Kết hợp reducers trong src/store/reducers/index.js.

// Kết nối Redux với React:
// Kết hợp Redux với ứng dụng React trong file src/index.js.

// jsx
// Copy code
// // src/index.js
// import React from 'react';
// import ReactDOM from 'react-dom';
// import { Provider } from 'react-redux';
// import store from './store';
// import App from './App';
// import './index.css';

// ReactDOM.render(
//   <Provider store={store}>
//     <App />
//   </Provider>,
//   document.getElementById('root')
// );
// Sử dụng Redux trong Component:
// Sử dụng connect từ react-redux để kết nối component với Redux store và useDispatch để gọi action.

// jsx
// Copy code
// // src/components/DataComponent.js
// import React, { useEffect } from 'react';
// import { connect } from 'react-redux';
// import { fetchData } from '../store/actions/dataActions';

// const DataComponent = ({ data, error, fetchData }) => {
//   useEffect(() => {
//     fetchData();
//   }, [fetchData]);

//   if (error) {
//     return <div>Error: {error}</div>;
//   }

//   return (
//     <div>
//       <h1>Data</h1>
//       <ul>
//         {data.map((item) => (
//           <li key={item.id}>{item.name}</li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// const mapStateToProps = (state) => ({
//   data: state.data.data,
//   error: state.data.error,
// });

// export default connect(mapStateToProps, { fetchData })(DataComponent);
// Chạy ứng dụng:
// Chạy ứng dụng React:

// bash
// Copy code
// npm start
// # hoặc
// yarn start
