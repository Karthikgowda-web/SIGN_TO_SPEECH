
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { HomePage } from './components/pages/HomePage';
import { SignToSpeechPage } from './components/pages/SignToSpeechPage';
import { SpeechToSignPage } from './components/pages/SpeechToSignPage';
import { SettingsPage } from './components/pages/SettingsPage';
import { AboutPage } from './components/pages/AboutPage';
import { CustomSignsPage } from './components/pages/CustomSignsPage';
import { LoginPage } from './components/pages/LoginPage';
import { SignUpPage } from './components/pages/SignUpPage'; 
import NotificationToast from './components/NotificationToast';
import { Page, Language, User, Sign, Notification } from './types';
import { LanguageContext } from './contexts/LanguageContext';
import { CustomSignsContext } from './contexts/CustomSignsContext';
import { AuthContext } from './contexts/AuthContext';
import { AVAILABLE_LANGUAGES } from './constants';
import { fetchUserCustomSigns, addCustomSign, deleteCustomSign } from './services/signService';


const App: React.FC = () => {
    const [currentPage, setCurrentPage] = useState<Page>(Page.Home);
    const [language, setLanguage] = useState<Language>(() => {
        const savedLang = localStorage.getItem('language');
        // Prioritize Kannada as the default if nothing is saved or if the saved language isn't in AVAILABLE_LANGUAGES
        const defaultLang = AVAILABLE_LANGUAGES.find(lang => lang.code === 'kn') || AVAILABLE_LANGUAGES[0];
        try {
            const parsedLang = savedLang ? (JSON.parse(savedLang) as Language) : defaultLang;
            // Ensure the parsed language is actually one of the available languages
            return AVAILABLE_LANGUAGES.find(lang => lang.code === parsedLang.code) || defaultLang;
        } catch (error) {
            console.error("Error parsing saved language from localStorage, using default.", error);
            return defaultLang;
        }
    });
    
    // Custom signs will now be fetched from the backend
    const [customSigns, setCustomSigns] = useState<Sign[]>([]); 

    // Auth State
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [userId, setUserId] = useState<number | null>(null); // Added userId
    const [userToken, setUserToken] = useState<string | null>(null); // Store token for API calls
    const [notification, setNotification] = useState<Notification | null>(null);

    // Effect to load user from localStorage on app start
    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            try {
                const user: User = JSON.parse(savedUser);
                setIsLoggedIn(true);
                setUserEmail(user.email);
                setUserId(user.id);
                setUserToken(user.token);
            } catch (error) {
                console.error("Error parsing saved user from localStorage", error);
                localStorage.removeItem('user'); // Clear corrupted data
            }
        }
    }, []);

    // Effect to handle navigation from login/signup pages
    useEffect(() => {
        const handleNavigate = (event: Event) => {
            const customEvent = event as CustomEvent<Page>;
            if (customEvent.detail) {
                const nextPage = customEvent.detail;
                setCurrentPage(nextPage);
            }
        };
        window.addEventListener('navigate', handleNavigate);
        return () => {
            window.removeEventListener('navigate', handleNavigate);
        };
    }, []);

    const showNotification = useCallback((message: string, type: Notification['type']) => {
        setNotification({ message, type });
        const timeoutId = setTimeout(() => {
            setNotification(null);
        }, 3000);
        return () => clearTimeout(timeoutId);
    }, []);

    // Function to fetch custom signs from backend
    const refreshSigns = useCallback(async () => {
        if (isLoggedIn && userToken) {
            const result = await fetchUserCustomSigns(userToken);
            if (result.signs) {
                setCustomSigns(result.signs);
            } else if (result.error) {
                showNotification(`Error loading custom signs: ${result.error}`, 'error');
            }
        } else {
            setCustomSigns([]); // Clear signs if not logged in
        }
    }, [isLoggedIn, userToken, showNotification]);

    // Effect to fetch signs when user logs in or token changes
    useEffect(() => {
        refreshSigns();
    }, [isLoggedIn, userToken, refreshSigns]);


    const login = useCallback((user: User) => {
        setIsLoggedIn(true);
        setUserEmail(user.email); 
        setUserId(user.id); // Store user ID
        setUserToken(user.token); // Store user token
        localStorage.setItem('user', JSON.stringify(user));
        setCurrentPage(Page.Home);
        showNotification('Login successful!', 'success');
        refreshSigns(); // Refresh signs after login
    }, [showNotification, refreshSigns]);

    const logout = useCallback(() => {
        showNotification('You are logging out...', 'info');
        setTimeout(() => {
            setIsLoggedIn(false);
            setUserEmail(null);
            setUserId(null); // Clear user ID
            setUserToken(null); // Clear user token
            localStorage.removeItem('user');
            setCustomSigns([]); // Clear custom signs on logout
            setCurrentPage(Page.Home);
            showNotification('Logged out successfully.', 'info');
        }, 1500);
    }, [showNotification]);

    const handleSetLanguage = useCallback((lang: Language) => {
        setLanguage(lang);
        localStorage.setItem('language', JSON.stringify(lang));
    }, []);

    // These `handleAddSign` and `handleRemoveSign` now directly call refreshSigns after API interaction
    const handleAddSign = useCallback(async (word: string) => {
        if (!userToken) {
            showNotification('Please log in to add custom signs.', 'error');
            return;
        }
        const result = await addCustomSign(word, userToken);
        if (result.sign) {
            showNotification(`Sign for "${result.sign.word}" added.`, 'success');
            refreshSigns(); // Re-fetch signs after adding
        } else if (result.error) {
            showNotification(`Failed to add sign: ${result.error}`, 'error');
        }
    }, [userToken, refreshSigns, showNotification]);

    const handleRemoveSign = useCallback(async (signId: number) => {
        if (!userToken) {
            showNotification('Please log in to remove custom signs.', 'error');
            return;
        }
        const result = await deleteCustomSign(signId, userToken);
        if (result.message) {
            showNotification(result.message, 'success');
            refreshSigns(); // Re-fetch signs after deleting
        } else if (result.error) {
            showNotification(`Failed to remove sign: ${result.error}`, 'error');
        }
    }, [userToken, refreshSigns, showNotification]);
    
    const languageContextValue = useMemo(() => ({
        language,
        setLanguage: handleSetLanguage,
    }), [language, handleSetLanguage]);

    const customSignsContextValue = useMemo(() => ({
        customSigns,
        addSign: (signWord: string) => handleAddSign(signWord), // Adapt to accept word
        removeSign: (signId: number) => handleRemoveSign(signId), // Adapt to accept ID
        refreshSigns: refreshSigns, // Provide refreshSigns directly
    }), [customSigns, handleAddSign, handleRemoveSign, refreshSigns]);

    const authContextValue = useMemo(() => ({
        isLoggedIn,
        userEmail,
        userId, // Provide userId
        userToken, // Provide userToken
        login,
        logout,
        showNotification,
    }), [isLoggedIn, userEmail, userId, userToken, login, logout, showNotification]);

    const renderPage = () => {
        switch (currentPage) {
            case Page.Home:
                return <HomePage />;
            case Page.SignToSpeech:
                return <SignToSpeechPage />;
            case Page.SpeechToSign:
                return <SpeechToSignPage />;
            case Page.CustomSigns:
                return <CustomSignsPage />;
            case Page.Settings:
                return <SettingsPage />;
            case Page.About:
                return <AboutPage />;
            case Page.Login:
                return <LoginPage />;
            case Page.SignUp: 
                return <SignUpPage />;
            default:
                return <HomePage />;
        }
    };

    const pageVariants = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
    };

    return (
        <LanguageContext.Provider value={languageContextValue}>
            <CustomSignsContext.Provider value={customSignsContextValue}>
                <AuthContext.Provider value={authContextValue}>
                    <div className="min-h-screen bg-gray-900 text-white flex flex-col bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
                        <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
                        <main className="flex-grow container mx-auto px-4 py-12 mt-16 mb-16 relative z-10">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentPage}
                                    variants={pageVariants}
                                    initial="initial"
                                    animate="animate"
                                    exit="exit"
                                    transition={{ type: "tween", duration: 0.4 }}
                                    className="h-full"
                                >
                                    {renderPage()}
                                </motion.div>
                            </AnimatePresence>
                        </main>
                        <Footer />
                        <NotificationToast notification={notification} />
                    </div>
                </AuthContext.Provider>
            </CustomSignsContext.Provider>
        </LanguageContext.Provider>
    );
};

export default App;
