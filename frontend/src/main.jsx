import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import "./i18n";
import App from './App.jsx'

import { registerSW } from "virtual:pwa-register";

registerSW({ immediate: true });

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)