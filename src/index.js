import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { GoogleOAuthProvider } from '@react-oauth/google'
import client from './graphql/client'
import { ApolloProvider } from "@apollo/client/react";
import Users from './graphql/queries/getUser'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="786579506443-dana47drtibvs09mnf9cco9dobr8sh3i.apps.googleusercontent.com">
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
      {/* <Util /> */}
    </GoogleOAuthProvider>
  </React.StrictMode>
)