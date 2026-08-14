import React from "react";
import 'font-awesome/css/font-awesome.min.css';
import Home from "./Component/Home";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import Sidebar from "./Component/Sidebar";
import { useAuth } from "./Component/Auth";
import Navbar from "./Component/Navbar";
import Profile from "./Component/Profile";
import Dashboard from "./Component/Dashboard";
import History from "./Component/History";
import Result from "./Component/Result";
import Login from "./Component/Login";
import TestPage from "./Component/TestPage";
import Exam from "./Component/Exam";
import "./App.css";
import AddQues from "./Component/Admin/AddQues";
import Category from "./Component/Category";
import Streem from "./Component/Streem";
import Python from "./Component/Python";
import DataSc from "./Component/DataSc";
import AdminPanel from './Component/AdninPanel'
import WrittenExam from './Component/WrittenExam'

const App = () => {

  const { isloggedIn, loading } = useAuth();
  const location = useLocation();

  // 🔥 ADMIN ROUTE DETECT
  const hideLayout = location.pathname.startsWith("/addQues");

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        Loading...
      </div>
    );
  }

  return (
    <div className="app-container">

      {/* 🔥 SIDEBAR + NAVBAR HIDE IN ADMIN PANEL
      {!hideLayout && (
        isloggedIn ? <Sidebar /> : <Navbar />
      )} */}

      <Routes>

        <Route
          path="/home"
          element={isloggedIn ? <Navigate to="/profile" /> : <Home />}
        />

        <Route
          path="/profile"
          element={isloggedIn ? <Profile /> : <Navigate to="/home" />}
        />

        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/history" element={<History />} />
        <Route path="/result" element={<Result />} />

        {/* STREAM SELECT */}
        <Route path="/streem" element={<Streem />} />

        {/* CATEGORY */}
        <Route path="/category/:stream" element={<Category />} />

        {/* EXAM */}
        <Route path="/exam" element={<Exam />} />
        <Route path="/Exam" element={<Exam />} />

        <Route path="/written-exam" element={<WrittenExam />} />

        <Route path="/addQues" element={<AdminPanel />} />

        <Route path="/python" element={<Python />} />
        <Route path="/datasc" element={<DataSc />} />

        <Route
          path="*"
          element={<Navigate to={isloggedIn ? "/profile" : "/home"} />}
        />

      </Routes>

    </div>
  );
};

export default App;