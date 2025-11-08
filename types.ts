export enum Page {
    Home = 'Home',
    SignToSpeech = 'Sign-to-Speech',
    SpeechToSign = 'Speech-to-Sign',
    CustomSigns = 'Custom Signs',
    Settings = 'Settings',
    About = 'About',
    Login = 'Login', 
    SignUp = 'Sign Up', 
}

export interface Language {
    code: string;
    name: string;
}

export interface User {
    id: number; // Added user ID from backend
    email: string;
    token: string;
}

export interface Sign {
    id: number;
    userId: number;
    word: string;
    videoUrl: string; // Placeholder for now, actual video upload/storage not implemented
    createdAt: string;
}

export interface Notification {
    message: string;
    type: 'info' | 'success' | 'error' | 'warning';
}

// Fix: Add TypeScript type declarations for `import.meta.env` to resolve the
// "Property 'env' does not exist on type 'ImportMeta'" error.
// This makes environment variables accessible with proper type checking throughout the application.
declare global {
    interface ImportMetaEnv {
        readonly VITE_API_KEY: string;
        readonly VITE_BACKEND_URL: string;
        // Add other VITE_ variables here as needed by the application
    }

    interface ImportMeta {
        readonly env: ImportMetaEnv;
    }

    // Declare global window properties for fallback environment variable access
    interface Window {
        VITE_BACKEND_URL?: string;
        VITE_API_KEY?: string;
    }
}