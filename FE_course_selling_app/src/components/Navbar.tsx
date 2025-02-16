import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layers, LogIn, LogOut, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { token, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Layers className="h-8 w-8 text-indigo-600" />
              <span className="text-xl font-bold text-gray-900">CourseHub</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {!token ? (
              <>
                <div className="flex items-center space-x-2">
                  <Link
                    to="/user/signin"
                    className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-indigo-600"
                  >
                    <LogIn className="h-5 w-5 mr-1" />
                    Sign In
                  </Link>
                  <Link
                    to="/user/signup"
                    className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-indigo-600"
                  >
                    <UserPlus className="h-5 w-5 mr-1" />
                    Sign Up
                  </Link>
                </div>
                <div className="border-l border-gray-200 h-6" />
                <div className="flex items-center space-x-2">
                  <div className="relative group">
                    <button className="text-sm text-gray-600 hover:text-indigo-600">
                      Admin
                    </button>
                    <div className="absolute right-0 w-48 mt-2 py-2 bg-white rounded-md shadow-xl z-20 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-300 ease-in-out">
                      <Link
                        to="/admin/signup"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Admin Sign Up
                      </Link>
                      <Link
                        to="/admin/signin"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Admin Sign In
                      </Link>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/dashboard"
                  className="text-sm font-medium text-gray-700 hover:text-indigo-600"
                >
                  Dashboard
                </Link>
                {isAdmin && (
                  <Link
                    to="/course/create"
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
                  >
                    Create Course
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-indigo-600"
                >
                  <LogOut className="h-5 w-5 mr-1" />
                  Logout
                </button>
                {isAdmin && (
                  <span className="px-2 py-1 text-xs font-semibold text-indigo-600 bg-indigo-100 rounded-full">
                    Admin Mode
                  </span>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}