// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

// Mock users for demonstration
const mockUsers = [
  { 
    id: 1, 
    email: 'admin@college.edu', 
    password: 'admin123', 
    role: 'ADMIN', 
    name: 'System Admin' 
  },
  { 
    id: 2, 
    email: 'tech.head@college.edu', 
    password: 'tech123', 
    role: 'CLUB_HEAD', 
    name: 'Tech Club Head',
    clubId: 1 
  },
  { 
    id: 3, 
    email: 'drama.head@college.edu', 
    password: 'drama123', 
    role: 'CLUB_HEAD', 
    name: 'Drama Club Head',
    clubId: 2 
  },
  { 
    id: 4, 
    email: 'john.student@college.edu', 
    password: 'student123', 
    role: 'STUDENT', 
    name: 'John Doe' 
  },
  { 
    id: 5, 
    email: 'jane.student@college.edu', 
    password: 'student123', 
    role: 'STUDENT', 
    name: 'Jane Smith' 
  }
];

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in (stored in localStorage)
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);
  // useEffect(() => {
  //   const userEmail="gsgesi/pcom";
  //    const user= await db.users.find(u => u.email === userEmail);
  //     if(!user){
  //       return Response.json({ success: false, error: 'User not found' });
  //     }else{
  //       return Response.json({ success: true, user });// user without password
  //     }
  // }, [currentUser]);
  const login = async (email, password) => {
    const user = mockUsers.find(u => u.email === email && u.password === password);
    if (user) {
      const userWithoutPassword = { ...user };
      delete userWithoutPassword.password;
      setCurrentUser(userWithoutPassword);
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      return { success: true, user: userWithoutPassword };
    }
    return { success: false, error: 'Invalid credentials' };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const value = {
    currentUser,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};