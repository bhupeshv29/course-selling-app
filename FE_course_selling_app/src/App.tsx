import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Layers, LogIn, LogOut, UserPlus } from 'lucide-react';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import UserSignup from './pages/UserSignup';
import UserSignin from './pages/UserSignin';
import AdminSignup from './pages/AdminSignup';
import AdminSignin from './pages/AdminSignin';
import Dashboard from './pages/Dashboard';
import CreateCourse from './pages/CreateCourse';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/user/signup" element={<UserSignup />} />
            <Route path="/user/signin" element={<UserSignin />} />
            <Route path="/admin/signup" element={<AdminSignup />} />
            <Route path="/admin/signin" element={<AdminSignin />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/course/create" element={<CreateCourse />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;