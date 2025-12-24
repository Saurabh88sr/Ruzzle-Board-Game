import React from 'react'
import './App.css'
import AppPage from './page/AppPage'
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

const App = () => {
  socket.emit("connection", "connected");
  socket.on("connect", () => {
  console.log("Socket ID:", socket.id,);
});

  return (
    <>
    <AppPage/>
    </>
  )
}

export default App
