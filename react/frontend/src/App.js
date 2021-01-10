import React from 'react'
import Main from './Main'
import './App.css';
import { NavLink } from 'react-router-dom'

const Navigation = () => (
    <nav>
      <ul>
        <li><NavLink to="/">Home</NavLink></li>
        <li><NavLink to="/visualize">Visualize</NavLink></li>
        <li><NavLink to="/manage">Manage</NavLink></li>
      </ul>
    </nav>
);

const App = () => (
    <div className="app">
      <Navigation />
      <Main />
    </div>
);

export default App;
