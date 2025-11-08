import { createContext } from 'react';
import { Sign } from '../types';

interface CustomSignsContextType {
    customSigns: Sign[];
    // Fix: Update addSign to accept a string for the word and return a Promise<void>
    addSign: (signWord: string) => Promise<void>;
    removeSign: (signId: number) => Promise<void>;
    refreshSigns: () => Promise<void>; // Added to trigger re-fetching from backend
}

export const CustomSignsContext = createContext<CustomSignsContextType>({
    customSigns: [],
    addSign: async () => {}, // Default empty async function
    removeSign: async () => {},
    refreshSigns: async () => {}, // Default empty async function
});