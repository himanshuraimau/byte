import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as SQLite from 'expo-sqlite';
import { User } from '@/types/entities';
import { UserRepository } from '@/database/repositories/UserRepository';
import { Config } from '@/constants/config';
import { initDatabase } from '@/database/db';

interface UserContextType {
  user: User | null;
  loading: boolean;
  setUser: (user: User) => void;
  createUser: (name: string) => Promise<void>;
  updateUser: (name: string) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [db, setDb] = useState<SQLite.SQLiteDatabase | null>(null);
  const [userRepo, setUserRepo] = useState<UserRepository | null>(null);

  // Initialize database
  useEffect(() => {
    async function setupDatabase() {
      try {
        const database = await initDatabase();
        setDb(database);
        const repository = new UserRepository(database);
        setUserRepo(repository);

        // Check if user exists
        const existingUser = await repository.getFirst();
        if (existingUser) {
          setUserState(existingUser);
        }
      } catch (error) {
        console.error('Failed to initialize database:', error);
      } finally {
        setLoading(false);
      }
    }

    setupDatabase();
  }, []);

  const setUser = (userData: User) => {
    setUserState(userData);
  };

  const createUser = async (name: string): Promise<void> => {
    if (!userRepo) {
      throw new Error('Database not initialized');
    }

    try {
      const newUser = await userRepo.create(name);
      setUserState(newUser);
    } catch (error) {
      console.error('Failed to create user:', error);
      throw error;
    }
  };

  const updateUser = async (name: string): Promise<void> => {
    if (!userRepo || !user) {
      throw new Error('User or database not initialized');
    }

    try {
      const updatedUser = await userRepo.update(user.id, name);
      setUserState(updatedUser);
    } catch (error) {
      console.error('Failed to update user:', error);
      throw error;
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        setUser,
        createUser,
        updateUser,
      }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
