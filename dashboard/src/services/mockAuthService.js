// src/services/mockAuthService.js
import { DEMO_USERS } from '../data/mockData';

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock JWT token (in real app, this would come from backend)
const generateMockToken = (userId) => {
  return `mock-jwt-token-${userId}-${Date.now()}`;
};

export const mockAuthService = {
  async login(email, password) {
    await delay(1000); // Simulate network delay
    
    const user = DEMO_USERS.find(u => u.email === email && u.password === password);
    
    if (user) {
      const token = generateMockToken(user.id);
      const { password: _, ...userWithoutPassword } = user;
      
      return {
        success: true,
        token,
        user: userWithoutPassword
      };
    } else {
      return {
        success: false,
        error: 'Invalid email or password'
      };
    }
  },

  async register(userData) {
    await delay(1000);
    
    // Check if user already exists
    const existingUser = DEMO_USERS.find(u => u.email === userData.email);
    
    if (existingUser) {
      return {
        success: false,
        error: 'User with this email already exists'
      };
    }

    // Create new user (in real app, this would be saved to database)
    const newUser = {
      id: DEMO_USERS.length + 1,
      name: userData.name,
      email: userData.email,
      role: userData.role || 'student',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=random`
    };

    const token = generateMockToken(newUser.id);
    
    return {
      success: true,
      token,
      user: newUser
    };
  },

  async getCurrentUser(token) {
    await delay(500);
    
    if (!token || !token.startsWith('mock-jwt-token-')) {
      throw new Error('Invalid token');
    }

    // Extract user ID from mock token
    const tokenParts = token.split('-');
    const userId = parseInt(tokenParts[3]);
    
    const user = DEMO_USERS.find(u => u.id === userId);
    
    if (user) {
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } else {
      throw new Error('User not found');
    }
  },

  async verifyToken(token) {
    await delay(300);
    
    if (!token || !token.startsWith('mock-jwt-token-')) {
      return false;
    }

    // In real app, this would verify JWT signature and expiration
    return true;
  }
};