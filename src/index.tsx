import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Todo from './examples/Todo';
import Counter from './examples/Counter';
// import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <Todo />
    <Counter />
  </React.StrictMode>,
  document.getElementById('root')
);