import { User } from '../types';

// Use environment variable for backend URL with a fallback for local development
// First, try import.meta.env (for Vite). If not available, try window global (from index.html).
// Finally, fall back to a hardcoded local URL.
const BACKEND_URL_ENV = (import.meta as any).env?.VITE_BACKEND_URL || (window as any).VITE_BACKEND_URL || 'http://localhost:3001';
const API_BASE_URL = `${BACKEND_URL_ENV}/api`;

interface AuthResponse {
    token?: string;
    message?: string; // Make message optional as error might be present
    error?: string;
    email?: string; // Add email to AuthResponse for login success
    id?: number; // Added user ID to AuthResponse for login success
}

/**
 * Handles user login by sending credentials to the backend.
 */
export const loginUser = async (email: string, password: string): Promise<AuthResponse> => {
    if (!email || !password) {
        return { message: 'Email and password are required.', error: 'Email and password are required.' };
    }

    try {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data: AuthResponse = await response.json();

        if (!response.ok) {
            // Backend sends 'message' for user-friendly errors, 'error' for dev errors
            return { message: data.message || data.error || 'Login failed.', error: data.message || data.error || 'Login failed.' };
        }
        // Assuming the backend returns token, email, AND id on successful login
        return { token: data.token, message: data.message || 'Login successful!', email: data.email, id: data.id };
    } catch (error: any) {
        console.error('Network or server error during login:', error);
        return { message: 'Network error. Please try again later.', error: 'Network error. Please try again later.' };
    }
};

/**
 * Handles user registration by sending user details to the backend.
 */
export const registerUser = async (email: string, password: string): Promise<AuthResponse> => {
    if (!email || !password) {
        return { message: 'Email and password are required.', error: 'Email and password are required.' };
    }
    // Frontend password length validation as good practice, but backend will also validate.
    if (password.length < 6) {
        return { message: 'Password must be at least 6 characters long.', error: 'Password must be at least 6 characters long.' };
    }

    try {
        const response = await fetch(`${API_BASE_URL}/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data: AuthResponse = await response.json();

        if (!response.ok) {
            // Backend sends 'message' for user-friendly errors, 'error' for dev errors
            return { message: data.message || data.error || 'Registration failed.', error: data.message || data.error || 'Registration failed.' };
        }

        return { message: data.message || 'Registration successful!' };
    } catch (error: any) {
        console.error('Network or server error during registration:', error);
        return { message: 'Network error. Please try again later.', error: 'Network error. Please try again later.' };
    }
};