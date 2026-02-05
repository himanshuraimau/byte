import { UserRepository } from "@/database/repositories/UserRepository";
import { User } from "@/types/entities";
import React, { createContext, ReactNode, useContext, useState } from "react";

interface UserContextType {
  user: User | null;
  loading: boolean;
  login: (name: string, password: string) => Promise<void>;
  register: (name: string, password: string) => Promise<void>;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const userRepo = new UserRepository();

  const login = async (name: string, password: string): Promise<void> => {
    try {
      const loggedInUser = await userRepo.login(name, password);
      setUserState(loggedInUser);
    } catch (error) {
      console.error("Failed to login:", error);
      throw error;
    }
  };

  const register = async (name: string, password: string): Promise<void> => {
    try {
      const newUser = await userRepo.register(name, password);
      setUserState(newUser);
    } catch (error) {
      console.error("Failed to register:", error);
      throw error;
    }
  };

  const logout = () => {
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
