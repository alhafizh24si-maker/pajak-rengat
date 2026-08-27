import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './style.css' // Import existing global styles

ReactDOM.createRoot(document.getElementById('app')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
