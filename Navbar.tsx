import React, { useContext, useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Page } from '../types';
import { AuthContext } from '../contexts/AuthContext'; 

interface NavbarProps {
    currentPage: Page;
    setCurrentPage: (page: Page) => void;
}

// Lucide React Icons (as SVG paths to avoid external dependencies)
const HomeIcon: React.FC<{className?: string}> = ({className}) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>);
const CameraIcon: React.FC<{className?: string}> = ({className}) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path><circle cx="12" cy="13" r="3"></circle></svg>);
const MicIcon: React.FC<{className?: string}> = ({className}) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" x2="12" y1="19" y2="22"></line></svg>);
const PlusSquareIcon: React.FC<{className?: string}> = ({className}) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="12" x2="12" y1="8" y2="16"></line><line x1="8" x2="16" y1="12" y2="12"></line></svg>);
const SettingsIcon: React.FC<{className?: string}> = ({className}) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1 0-2l.15.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>);
const InfoIcon: React.FC<{className?: string}> = ({className}) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"></circle><line x1="12" x2="12" y1="16" y2="12"></line><line x1="12" x2="12.01" y1="8" y2="8"></line></svg>);
const LogInIcon: React.FC<{className?: string}> = ({className}) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" x2="3" y1="12" y2="12"></line></svg>);
const UserPlusIcon: React.FC<{className?: string}> = ({className}) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><line x1="19" x2="19" y1="8" y2="14"></line><line x1="22" x2="16" y1="11" y2="11"></line></svg>);
const LogOutIcon: React.FC<{className?: string}> = ({className}) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="17 16 22 12 17 8"></polyline><line x1="22" x2="10" y1="12" y2="12"></line></svg>);
const UserIcon: React.FC<{className?: string}> = ({className}) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>);
const UserCircleIcon: React.FC<{className?: string}> = ({className}) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="10" r="3"></circle><path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662"></path></svg>);
const ChevronDownIcon: React.FC<{className?: string}> = ({className}) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m6 9 6 6 6-6"></path></svg>);
const ChevronUpIcon: React.FC<{className?: string}> = ({className}) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m18 15-6-6-6 6"></path></svg>);
const MenuIcon: React.FC<{className?: string}> = ({className}) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="4" x2="20" y1="12" y2="12"></line><line x1="4" x2="20" y1="6" y2="6"></line><line x1="4" x2="20" y1="18" y2="18"></line></svg>);
const XIcon: React.FC<{className?: string}> = ({className}) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>);


const navItems = [
    { page: Page.Home, icon: HomeIcon, label: 'Home' },
    { page: Page.SignToSpeech, icon: CameraIcon, label: 'Sign-to-Speech' },
    { page: Page.SpeechToSign, icon: MicIcon, label: 'Speech-to-Sign' },
    { page: Page.CustomSigns, icon: PlusSquareIcon, label: 'Custom Signs' },
    { page: Page.Settings, icon: SettingsIcon, label: 'Settings' },
    { page: Page.About, icon: InfoIcon, label: 'About' },
];

const Navbar: React.FC<NavbarProps> = ({ currentPage, setCurrentPage }) => {
    const { isLoggedIn, userEmail, logout } = useContext(AuthContext);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const profileDropdownRef = useRef<HTMLDivElement>(null);

    const handleNavigate = (page: Page) => {
        setCurrentPage(page);
        setIsMobileMenuOpen(false); // Close menu on navigation
        setIsProfileDropdownOpen(false); // Close profile dropdown on navigation
    };

    // Close dropdown if clicked outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
                setIsProfileDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogoutClick = () => {
        logout(); // This will now trigger the notification in App.tsx
        setIsProfileDropdownOpen(false); // Close dropdown immediately
    };

    return (
        <header className="fixed top-0 left-0 right-0 bg-black/30 backdrop-blur-lg border-b border-gray-700 z-50">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    <motion.h1 
                        className="text-2xl font-bold text-cyan-400" /* Slightly larger text for branding */
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        UniSign
                    </motion.h1>
                    <nav className="hidden md:flex space-x-1">
                        {navItems.map(({ page, icon: Icon, label }) => (
                            <motion.button
                                key={page}
                                onClick={() => handleNavigate(page)}
                                className={`relative px-5 py-2 rounded-md text-sm font-medium transition-colors duration-200 group flex items-center gap-2
                                    ${currentPage === page
                                        ? 'text-white'
                                        : 'text-gray-300 hover:text-white'
                                }`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                                aria-current={currentPage === page ? 'page' : undefined}
                            >
                                {currentPage === page && (
                                    <motion.span
                                        layoutId="underline"
                                        className="absolute bottom-0 left-0 right-0 h-full rounded-md bg-cyan-500/80 -z-10"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                    />
                                )}
                                <Icon className="w-5 h-5 text-current" />
                                <span className="relative z-10">{label}</span>
                            </motion.button>
                        ))}
                        
                        {/* Auth / Profile section for Desktop */}
                        <div className="ml-4 relative" ref={profileDropdownRef}>
                            {isLoggedIn ? (
                                <motion.button
                                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                                    className="flex items-center gap-2 px-4 py-2 rounded-md text-gray-300 hover:text-white transition-colors duration-200"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    aria-label="User profile menu"
                                    aria-expanded={isProfileDropdownOpen}
                                >
                                    <UserCircleIcon className="w-6 h-6" />
                                    <span className="hidden lg:inline">{userEmail?.split('@')[0]}</span> {/* Show only username part for brevity */}
                                    {isProfileDropdownOpen ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />}
                                </motion.button>
                            ) : (
                                <div className="flex items-center space-x-2">
                                    <motion.button
                                        onClick={() => handleNavigate(Page.Login)}
                                        className={`relative px-5 py-2 rounded-md text-sm font-medium transition-colors duration-200 group flex items-center gap-2
                                            ${currentPage === Page.Login ? 'text-white' : 'text-gray-300 hover:text-white'}`}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        aria-current={currentPage === Page.Login ? 'page' : undefined}
                                    >
                                        {currentPage === Page.Login && <motion.span layoutId="underline" className="absolute bottom-0 left-0 right-0 h-full rounded-md bg-cyan-500/80 -z-10" />}
                                        <LogInIcon className="w-5 h-5" />
                                        <span>Login</span>
                                    </motion.button>
                                    <motion.button
                                        onClick={() => handleNavigate(Page.SignUp)}
                                        className={`relative px-5 py-2 rounded-md text-sm font-medium transition-colors duration-200 group flex items-center gap-2
                                            ${currentPage === Page.SignUp ? 'text-white' : 'text-gray-300 hover:text-white'}`}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        aria-current={currentPage === Page.SignUp ? 'page' : undefined}
                                    >
                                        {currentPage === Page.SignUp && <motion.span layoutId="underline" className="absolute bottom-0 left-0 right-0 h-full rounded-md bg-cyan-500/80 -z-10" />}
                                        <UserPlusIcon className="w-5 h-5" />
                                        <span>Sign Up</span>
                                    </motion.button>
                                </div>
                            )}

                            <AnimatePresence>
                                {isLoggedIn && isProfileDropdownOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 focus:outline-none"
                                        role="menu"
                                        aria-orientation="vertical"
                                    >
                                        <div className="px-4 py-2 text-sm text-gray-300 border-b border-gray-700 truncate" role="menuitem">
                                            {userEmail}
                                        </div>
                                        <motion.button
                                            onClick={handleLogoutClick}
                                            className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-300 hover:bg-gray-700 hover:text-white"
                                            role="menuitem"
                                            whileHover={{ x: 5 }}
                                        >
                                            <LogOutIcon className="w-5 h-5" />
                                            Logout
                                        </motion.button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </nav>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        {isLoggedIn && (
                             <div className="relative" ref={profileDropdownRef}>
                                <button
                                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                                    className="text-gray-300 hover:text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 mr-2"
                                    aria-label="User profile menu"
                                    aria-expanded={isProfileDropdownOpen}
                                >
                                    <UserCircleIcon className="w-6 h-6" />
                                </button>
                                <AnimatePresence>
                                {isLoggedIn && isProfileDropdownOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 focus:outline-none"
                                        role="menu"
                                        aria-orientation="vertical"
                                    >
                                        <div className="px-4 py-2 text-sm text-gray-300 border-b border-gray-700 truncate" role="menuitem">
                                            {userEmail}
                                        </div>
                                        <motion.button
                                            onClick={handleLogoutClick}
                                            className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-300 hover:bg-gray-700 hover:text-white"
                                            role="menuitem"
                                            whileHover={{ x: 5 }}
                                        >
                                            <LogOutIcon className="w-5 h-5" />
                                            Logout
                                        </motion.button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            </div>
                        )}
                        <button 
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="text-gray-300 hover:text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            aria-label="Toggle menu"
                            aria-expanded={isMobileMenuOpen}
                        >
                            {isMobileMenuOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu content */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="md:hidden bg-black/40 backdrop-blur-lg border-b border-gray-700 py-2"
                    >
                        <nav className="flex flex-col items-center space-y-2 py-2"> {/* Added vertical padding */}
                            {navItems.map(({ page, icon: Icon, label }) => (
                                <motion.button
                                    key={page}
                                    onClick={() => handleNavigate(page)}
                                    className={`w-full py-3 px-4 text-center rounded-md text-base font-medium transition-colors duration-200 flex items-center justify-center gap-2
                                        ${currentPage === page
                                            ? 'text-white bg-cyan-500/80'
                                            : 'text-gray-300 hover:text-white hover:bg-gray-700'
                                    }`}
                                    whileTap={{ scale: 0.98 }}
                                    aria-current={currentPage === page ? 'page' : undefined}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span>{label}</span>
                                </motion.button>
                            ))}
                            {!isLoggedIn && ( // Only show Login/SignUp in mobile menu if not logged in
                                <>
                                    <motion.button
                                        onClick={() => handleNavigate(Page.Login)}
                                        className={`w-full py-3 px-4 text-center rounded-md text-base font-medium transition-colors duration-200 flex items-center justify-center gap-2
                                            ${currentPage === Page.Login ? 'text-white bg-cyan-500/80' : 'text-gray-300 hover:text-white hover:bg-gray-700'}`}
                                        whileTap={{ scale: 0.98 }}
                                        aria-current={currentPage === Page.Login ? 'page' : undefined}
                                    >
                                        <LogInIcon className="w-5 h-5" />
                                        <span>Login</span>
                                    </motion.button>
                                    <motion.button
                                        onClick={() => handleNavigate(Page.SignUp)}
                                        className={`w-full py-3 px-4 text-center rounded-md text-base font-medium transition-colors duration-200 flex items-center justify-center gap-2
                                            ${currentPage === Page.SignUp ? 'text-white bg-cyan-500/80' : 'text-gray-300 hover:text-white hover:bg-gray-700'}`}
                                        whileTap={{ scale: 0.98 }}
                                        aria-current={currentPage === Page.SignUp ? 'page' : undefined}
                                    >
                                        <UserPlusIcon className="w-5 h-5" />
                                        <span>Sign Up</span>
                                    </motion.button>
                                </>
                            )}
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Navbar;