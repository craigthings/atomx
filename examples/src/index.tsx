import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Todo from './components/Todo';
import Counter from './components/Counter';

ReactDOM.render(
  <React.StrictMode>
    <Todo />
    <Counter />
  </React.StrictMode>,
  document.getElementById('root')
);