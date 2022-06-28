import './App.css';
import React, { Component } from 'react';
import logo from './logo.png';
import { Layout } from './components/Layout';
import { Container } from 'reactstrap';
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import LetterPlanting from './components/LetterPlanting';
export default class App extends Component {
  render () {
    return (
      <Layout>
        <Container>
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
        </Container>
      </Layout>
    );
  }
}
