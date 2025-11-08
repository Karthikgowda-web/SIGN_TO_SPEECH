import { createContext } from 'react';
import { User, Notification } from '../types';

interface AuthContextType {
    isLoggedIn: boolean;
    userEmail: string | null;
    userId: number | null; // Added userId
    userToken: string | null; // Added userToken
    login: (user: User) => void;
    logout: () => void;
    showNotification: (message: string, type: Notification['type']) => void;
}

export const AuthContext = createContext<AuthContextType>({
    isLoggedIn: false,
    userEmail: null,
    userId: null, // Default value
    userToken: null, // Default value
    login: () => {},
    logout: () => {},
    showNotification: () => {}, // Default empty function
});