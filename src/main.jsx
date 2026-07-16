import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import './styles/theme.css'
import { BrowserRouter } from 'react-router-dom' // Import ở đây
import { GoAlert } from 'react-icons/go'
import { GoogleOAuthProvider } from '@react-oauth/google'


const GOOGLE_CLIENT_ID = "32518878914-ro4ujuh90039s9lu4nh28m65f1bltsbp.apps.googleusercontent.com"; // Thay bằng Client ID của bạn
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
   
   <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}> 
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>,
)