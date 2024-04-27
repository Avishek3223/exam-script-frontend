import React from 'react';
import ReactDOMClient from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from './App'
import './index.css'
import { UserProvider } from './Context/UserContext';

const root = ReactDOMClient.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <UserProvider>
      <App />
    </UserProvider>
  </BrowserRouter>
);