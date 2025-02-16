import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Course } from '../types';
import { Pencil } from 'lucide-react';

// @ts-ignore - Will be used later
interface Purchase {
  _id: string;
  userId: string;
  courseId: string;
}

export default function Dashboard() {
  const { token, isAdmin } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [purchasedCourses, setPurchasedCourses] = useState<Course[]>([]);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        if (isAdmin) {
          // Admin sees their created courses
          const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/admin/course/bulk`, {
            headers: {
              'token': token || ''
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            setCourses(data.courses || []);
          }
        } else {
          // Regular users see their purchased courses and available courses
          const purchasesResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/user/purchases`, {
            headers: {
              'token': token || ''
            }
          });
          
          if (purchasesResponse.ok) {
            const data = await purchasesResponse.json();
            setPurchasedCourses(data.coursesData || []);
          }

          // Fetch available courses
          const availableResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/course/preview`);
          if (availableResponse.ok) {
            const data = await availableResponse.json();
            setCourses(data.courses || []);
          }
        }
      } catch (error) {
        console.error('Failed to fetch courses:', error);
        setError('Failed to load courses');
      }
    };

    fetchCourses();
  }, [token, isAdmin]);

  const handlePurchaseCourse = async (courseId: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/course/purchase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': token || ''
        },
        body: JSON.stringify({ courseId })
      });

      if (response.ok) {
        // Refresh purchased courses after successful purchase
        const purchasesResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/user/purchases`, {
          headers: {
            'token': token || ''
          }
        });
        
        if (purchasesResponse.ok) {
          const data = await purchasesResponse.json();
          setPurchasedCourses(data.coursesData || []);
        }
      } else {
        setError('Failed to purchase course');
      }
    } catch (error) {
      console.error('Failed to purchase course:', error);
      setError('Failed to purchase course');
    }
  };

  const handleUpdateCourse = async (courseId: string, updatedData: Partial<Course>) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/admin/course`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'token': token || ''
        },
        body: JSON.stringify({
          courseId,
          ...updatedData
        })
      });

      if (response.ok) {
        const updatedCourses = courses.map(course => 
          course._id === courseId ? { ...course, ...updatedData } : course
        );
        setCourses(updatedCourses);
        setEditingCourse(null);
      }
    } catch (error) {
      console.error('Failed to update course:', error);
    }
  };

  const isPurchased = (courseId: string) => {
    return purchasedCourses.some(course => course._id === courseId);
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          {isAdmin ? 'Admin Dashboard' : 'Course Dashboard'}
        </h1>

        {error && (
          <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-md">
            {error}
          </div>
        )}

        {!isAdmin && (
          <>
            {purchasedCourses.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Purchased Courses</h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {purchasedCourses.map((course) => (
                    <div key={course._id} className="bg-white overflow-hidden shadow rounded-lg">
                      <div className="p-6">
                        <img
                          className="h-48 w-full object-cover rounded-lg mb-4"
                          src={course.imageUrl}
                          alt={course.title}
                        />
                        <h3 className="text-lg font-medium text-gray-900">{course.title}</h3>
                        <p className="mt-2 text-sm text-gray-500">{course.description}</p>
                        <div className="mt-4">
                          <span className="text-lg font-bold text-gray-900">${course.price}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <h2 className="text-xl font-semibold text-gray-900 mb-4">Available Courses</h2>
          </>
        )}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <div key={course._id} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-6">
                {isAdmin && editingCourse?._id === course._id ? (
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    handleUpdateCourse(course._id, editingCourse);
                  }}>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Title</label>
                        <input
                          type="text"
                          value={editingCourse.title}
                          onChange={(e) => setEditingCourse({
                            ...editingCourse,
                            title: e.target.value
                          })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                          value={editingCourse.description}
                          onChange={(e) => setEditingCourse({
                            ...editingCourse,
                            description: e.target.value
                          })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Price ($)</label>
                        <input
                          type="number"
                          value={editingCourse.price}
                          onChange={(e) => setEditingCourse({
                            ...editingCourse,
                            price: parseFloat(e.target.value)
                          })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <button
                          type="button"
                          onClick={() => setEditingCourse(null)}
                          className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-3 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </form>
                ) : (
                  <>
                    <img
                      className="h-48 w-full object-cover rounded-lg mb-4"
                      src={course.imageUrl}
                      alt={course.title}
                    />
                    <h3 className="text-lg font-medium text-gray-900">{course.title}</h3>
                    <p className="mt-2 text-sm text-gray-500">{course.description}</p>
                    <div className="mt-4 flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-900">${course.price}</span>
                      {isAdmin ? (
                        <button
                          onClick={() => setEditingCourse(course)}
                          className="p-1 text-gray-400 hover:text-indigo-600"
                        >
                          <Pencil className="h-5 w-5" />
                        </button>
                      ) : !isPurchased(course._id) ? (
                        <button
                          onClick={() => handlePurchaseCourse(course._id)}
                          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                        >
                          Purchase
                        </button>
                      ) : (
                        <span className="px-3 py-1 text-sm text-indigo-700 bg-indigo-100 rounded-full">
                          Purchased
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}