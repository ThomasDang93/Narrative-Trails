import logo from './logo.png';
import './App.css';
import { Route } from 'react-router';
import React, { Component } from 'react';
import { Layout } from './components/Layout';

export default class App extends Component {
  render () {
    return (
      <Layout>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <a
            className="App-link"
            href="https://narrativetrails.xyz/"
            target="_blank"
            rel="noopener noreferrer"
          >
            About
          </a>
        </header>
      </div>
      </Layout>
    );
  }
}
