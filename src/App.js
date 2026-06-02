import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./Form/Login";
import 'bootstrap/dist/css/bootstrap.min.css';
import Errorpage from "./Form/Errorpage";
import Register from "./Form/Register";
import Dashboard from "./Form/Dashboard";
import AddUser from "./Form/AddUser";
import Privateroute from "./Form/Privaterouter";
import PublicRouter from "./Form/Publicroute";
import "../src/Assets/Styles/index.css"
import { Toaster } from "sonner";

const router = createBrowserRouter([
  {
    path: '/', element: <PublicRouter/>, errorElement: <Errorpage />,
    children:[
      {path: '/', element: <Login/>},
      {path: '/register', element: <Register/>}
    ]
  },
  {
    path: '/', element: <Privateroute/>, errorElement: <Errorpage />,
    children:[
      {path: '/dashboard', element: <Dashboard/>},
      {path: '/adduser', element: <AddUser/>},
      {path: '/edituser/:userid', element: <AddUser/>}
    ]
  }
])

function App() {
  return (
    <div>
      <Toaster position="top-right" richColors />
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
