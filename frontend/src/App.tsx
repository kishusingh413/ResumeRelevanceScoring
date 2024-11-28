import './App.css';
import React, { useEffect } from 'react';
import { Routes, Route } from "react-router-dom";

import { useAppSelector } from './hooks';
import Home from './pages/Home';
import Result from './pages/Result';
import Navbar from './components/Navbar';
import { Loading } from './components/Loading';
import { Toaster } from "./components/ui/toaster"
import { useToast } from "./components/ui/use-toast"

// require('dotenv').config()

function App() {
  const { toast } = useToast()
  const { isLoading, errorMessage, successMessage } = useAppSelector((state) => state.task)

  useEffect(() => {
    if (errorMessage) {
      toast({
        variant: "destructive",
        description: errorMessage,
      })
    }
    if (successMessage) {
      toast({
        description: successMessage,
      })
    }
  }, [errorMessage, successMessage, toast])

  return (
    <>
      {isLoading && <Loading/>}
      <Navbar />
      <div className="max-w-screen-2xl mx-auto">
        <Routes>
            <Route path="/" Component={Home} />
            <Route path="/result" Component={Result} />
        </Routes>
      </div>
      <Toaster />

    </>
  );
}

export default App;
