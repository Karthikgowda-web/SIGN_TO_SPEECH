import { createContext } from 'react';
import { Language } from '../types';
import { AVAILABLE_LANGUAGES } from '../constants';

interface LanguageContextType {
    language: Language;
    setLanguage: (language: Language) => void;
}

export const LanguageContext = createContext<LanguageContextType>({
    language: AVAILABLE_LANGUAGES[0], // Default to the first language (Kannada)
    setLanguage: () => {},
});