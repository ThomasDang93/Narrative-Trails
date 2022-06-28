import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css';
import App from './App';
import LetterPlanting from './components/LetterPlanting';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Layout } from './components/Layout';
import { Container } from 'reactstrap';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path='/plant-letter-box' element={LetterPlanting} />
        </Routes>
      </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
