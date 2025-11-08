import { Sign } from '../types';

// Use environment variable for backend URL with a fallback for local development
const BACKEND_URL_ENV = (import.meta as any).env?.VITE_BACKEND_URL || (window as any).VITE_BACKEND_URL || 'http://localhost:3001';
const API_BASE_URL = `${BACKEND_URL_ENV}/api`;

interface SignApiResponse {
    message?: string;
    error?: string;
    sign?: Sign;
    signs?: Sign[];
}

/**
 * Fetches all custom signs for the authenticated user from the backend.
 * @param {string} token - The authentication token.
 * @returns {Promise<SignApiResponse>} A promise that resolves to an object containing signs or an error.
 */
export const fetchUserCustomSigns = async (token: string): Promise<SignApiResponse> => {
    try {
        const response = await fetch(`${API_BASE_URL}/signs`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        const data: SignApiResponse = await response.json();

        if (!response.ok) {
            return { error: data.message || data.error || 'Failed to fetch custom signs.' };
        }

        return { signs: data.signs };
    } catch (error: any) {
        console.error('Network or server error fetching custom signs:', error);
        return { error: 'Network error. Please try again later.' };
    }
};

/**
 * Adds a new custom sign for the authenticated user to the backend.
 * @param {string} word - The word for the new sign.
 * @param {string} token - The authentication token.
 * @returns {Promise<SignApiResponse>} A promise that resolves to the new sign object or an error.
 */
export const addCustomSign = async (word: string, token: string): Promise<SignApiResponse> => {
    // Mock videoUrl as actual file upload/storage is not implemented yet
    const videoUrl = `https://example.com/signs/${encodeURIComponent(word)}.mp4`;

    try {
        const response = await fetch(`${API_BASE_URL}/signs`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ word, videoUrl }),
        });

        const data: SignApiResponse = await response.json();

        if (!response.ok) {
            return { error: data.message || data.error || 'Failed to add custom sign.' };
        }

        return { message: data.message, sign: data.sign };
    } catch (error: any) {
        console.error('Network or server error adding custom sign:', error);
        return { error: 'Network error. Please try again later.' };
    }
};

/**
 * Deletes a custom sign for the authenticated user from the backend.
 * @param {number} signId - The ID of the sign to delete.
 * @param {string} token - The authentication token.
 * @returns {Promise<SignApiResponse>} A promise that resolves to a success message or an error.
 */
export const deleteCustomSign = async (signId: number, token: string): Promise<SignApiResponse> => {
    try {
        const response = await fetch(`${API_BASE_URL}/signs/${signId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        const data: SignApiResponse = await response.json();

        if (!response.ok) {
            return { error: data.message || data.error || 'Failed to delete custom sign.' };
        }

        return { message: data.message };
    } catch (error: any) {
        console.error('Network or server error deleting custom sign:', error);
        return { error: 'Network error. Please try again later.' };
    }
};