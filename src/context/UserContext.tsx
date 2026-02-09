import { User } from "@/types/entities";
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { apiClient } from "@/services/ApiClient";

interface UserContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      try {
        const response = await apiClient.get('/auth/me');
        if (response.ok) {
          const data = await response.json();
          // API returns { _id, email, createdAt }; map to User shape
          setUserState({
            id: data._id ?? data.id,
            email: data.email,
            created_at: data.createdAt ? new Date(data.createdAt).getTime() / 1000 : undefined,
          });
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      await apiClient.setSession(data.session);
      setUserState(data.user);
    } catch (error) {
      console.error("Failed to login:", error);
      throw error;
    }
  };

  const register = async (email: string, password: string): Promise<void> => {
    try {
      const response = await apiClient.post('/auth/register', { email, password });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      await apiClient.setSession(data.session);
      setUserState(data.user);
    } catch (error) {
      console.error("Failed to register:", error);
      throw error;
    }
  };

  const logout = async () => {
    await apiClient.clearSession();
    setUserState(null);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
