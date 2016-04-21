//import 'assets/app.css!'
import './vendor';
import React from 'react';
import ReactDOM from 'react-dom';
import Routes from './routes';

var appEl = document.createElement('div');
appEl.id = 'app';
document.body.appendChild(appEl);

ReactDOM.render(
  <Routes/>,
  document.getElementById('app')
);

