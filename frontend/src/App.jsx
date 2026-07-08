import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import FrameworkSelection from "./components/FrameworkSelection";
import FetchFiles from "./components/FetchFiles";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login onLogin={setCurrentUser} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<FrameworkSelection />} />
        <Route path="/:username/editor/:frameworkname/:foldername/:roomId" element={<FetchFiles />} />
        {!currentUser && <Route path="*" element={<Navigate to="/login" />} />}
      </Routes>
    </Router>
  );
}

export default App;
