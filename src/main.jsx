import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './context/AuthContext'
import { VisitorProvider } from './context/VisitorContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <VisitorProvider>
        <App />
      </VisitorProvider>
    </AuthProvider>
  </React.StrictMode>,
)
