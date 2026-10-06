// main.jsx（進入點）
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { LoginProvider } from "./content/LoginContent.jsx";
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <LoginProvider>
      <App />
    </LoginProvider>
  </BrowserRouter>
);