import React, { useEffect } from "react";
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
import VerifyOtp from "./page/verifyOtp";
import VerifyEmail from "./page/verifyEmail";
import { connectSocket } from "./socket/socket";
import JoinRoom from "./components/chat/JoinRoom";
import CreateRoom from "./components/chat/CreateRoom";
import RoomCreated from "./components/chat/RoomCreated";
import RoomLobby from "./components/chat/RoomLobby";
import Profile from "./components/profile";

const router = createBrowserRouter([
  {
    path: '/', element: <PublicRouter/>, errorElement: <Errorpage />,
    children:[
      {path: '/', element: <Login/>},
      {path: '/register', element: <Register/>},
      {path: '/verify-email/:token', element: <VerifyEmail/>},
      {path: '/verify-otp', element: <VerifyOtp/>}
    ]
  },
  {
    path: '/', element: <Privateroute/>, errorElement: <Errorpage />,
    children:[
      {path: '/dashboard', element: <Dashboard/>},
      {path: '/adduser', element: <AddUser/>},
      {path: '/edituser/:userid', element: <AddUser/>},
      {path: '/create-room', element: <CreateRoom/>},
      {path: '/join-room', element: <JoinRoom/>},
      {path: '/rooms/:roomId/lobby', element: <RoomLobby/>},
      {path: '/room-created', element: <RoomCreated/>},
      {path: '/profile', element: <Profile/>}
    ]
  }
])

function App() {

      useEffect(() => {

        const token =
            localStorage.getItem(
                "accessToken"
            );

        if (token) {

            connectSocket(
                token
            );

        }

    }, []);

  return (
    <div>
      <Toaster position="top-right" richColors />
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
