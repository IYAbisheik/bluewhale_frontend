import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { GoogleOAuthProvider } from '@react-oauth/google'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="786579506443-dana47drtibvs09mnf9cco9dobr8sh3i.apps.googleusercontent.com">
        {/* <Util /> */}
        <App/>
    </GoogleOAuthProvider>
  </React.StrictMode>
)