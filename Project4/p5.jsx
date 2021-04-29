import React from 'react';
import ReactDOM from 'react-dom';
import Header from './components/header/Header';
import States from './components/states/States';
import Example from './components/example/Example';
import { HashRouter, Route, Link, Redirect } from "react-router-dom";
import './p5.css';
import './styles/main.css';


ReactDOM.render(
    <div>
        <Header />
        <HashRouter>
            <ul id="router-nav-bar">
                <Link to="/states" className="router-link">States</Link>
                <Link to="/example" className="router-link">Example</Link>
            </ul>
            <Redirect to="/states" />
            <Route path="/states" component={States} />
            <Route path="/example" component={Example} />
        </HashRouter>
    </div>,
    document.getElementById('reactapp'),
);