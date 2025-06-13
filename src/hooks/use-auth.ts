// src/hooks/use-auth.ts
'use client';

import { useEffect } from 'react';
import { atom, useAtom } from 'jotai';
import type { User, UserRole } from '@/types';
import { useRouter } from 'next/navigation';

const mockAdmin: User = { id: '1', name: 'Admin Nexus', email: 'admin@nexusalpri.com', role: 'admin', avatar: 'https://placehold.co/100x100.png?text=A' };
const mockInstructor: User = { id: '2', name: 'Instructor Profe', email: 'instructor@nexusalpri.com', role: 'instructor', avatar: 'https://placehold.co/100x100.png?text=I' };
const mockStudent: User = { id: '3', name: 'Estudiante Aplicado', email: 'student@nexusalpri.com', role: 'student', avatar: 'https://placehold.co/100x100.png?text=E' };

// Attempt to persist user state in localStorage for development convenience
const getInitialUser = (): User | null => {
  if (typeof window !== 'undefined') {
    const storedUser = localStorage.getItem('nexusAlpriUser');
    if (storedUser) {
      try {
        return JSON.parse(storedUser) as User;
      } catch (e) {
        localStorage.removeItem('nexusAlpriUser');
        return null;
      }
    }
  }
  return null; 
};

const currentUserAtom = atom<User | null>(getInitialUser());
const isLoadingAtom = atom<boolean>(true);

export function useAuth() {
  const [user, setUser] = useAtom(currentUserAtom);
  const [isLoading, setIsLoading] = useAtom(isLoadingAtom);
  const router = useRouter();

  useEffect(() => {
    // Simulate async loading, even if it's just from localStorage
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300); // Short delay to show loading state initially
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Persist user to localStorage
    if (typeof window !== 'undefined') {
      if (user) {
        localStorage.setItem('nexusAlpriUser', JSON.stringify(user));
      } else {
        localStorage.removeItem('nexusAlpriUser');
      }
    }
  }, [user]);

  const performLogin = (loggedInUser: User | null) => {
    setIsLoading(true);
    setUser(loggedInUser);
    // Navigate after setting user, typically to a dashboard
    if (loggedInUser) {
      router.push('/dashboard'); 
    } else {
      router.push('/login');
    }
    // Short delay to allow navigation and state update before setting loading to false
    setTimeout(() => setIsLoading(false), 100);
  };

  const login = (role: UserRole) => {
    if (role === 'admin') performLogin(mockAdmin);
    else if (role === 'instructor') performLogin(mockInstructor);
    else if (role === 'student') performLogin(mockStudent);
    else performLogin(null); // Should not happen
  };

  const logout = () => {
    performLogin(null);
  };

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    // Direct login functions for testing/dev buttons
    loginAsAdmin: () => performLogin(mockAdmin),
    loginAsInstructor: () => performLogin(mockInstructor),
    loginAsStudent: () => performLogin(mockStudent),
  };
}
