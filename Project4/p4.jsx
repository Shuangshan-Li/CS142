import React from 'react';
import ReactDOM from 'react-dom';
import Header from './components/header/Header';
import DynamicDisplay from './components/dynamicDisplay/DynamicDisplay';
import './styles/main.css';


ReactDOM.render(
    <div>
        <Header />
        <DynamicDisplay />
    </div>,
    document.getElementById('reactapp'),
);