import React from 'react';
import { motion } from 'framer-motion';

// Lucide React Icons (as SVG paths to avoid external dependencies)
const GitHubIcon: React.FC<{className?: string}> = ({className}) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>);
const MailIcon: React.FC<{ className?: string }> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>);


const Footer: React.FC = () => {
    return (
        <motion.footer 
            className="fixed bottom-0 left-0 right-0 bg-black/30 backdrop-blur-lg border-t border-gray-700 z-40" // Lower z-index than Navbar
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
        >
            <div className="container mx-auto px-4 py-4 text-center text-gray-400 text-sm"> {/* Increased py-3 to py-4 */}
                <div className="flex flex-col md:flex-row justify-center items-center space-y-2 md:space-y-0 md:space-x-4">
                    <span>© 2024 Universal Sign & Speech Communication System</span>
                    <div className="flex items-center space-x-3">
                        <motion.a 
                            href="mailto:contact@unisign.com" 
                            className="hover:text-cyan-400 transition-colors flex items-center gap-1 text-base" /* Increased text to base */
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            aria-label="Contact us by email"
                        >
                           <MailIcon className="w-4 h-4" />
                           <span>contact@unisign.com</span>
                        </motion.a>
                        <motion.a 
                            href="https://github.com/your-github-profile/unisign" // Placeholder GitHub link
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="hover:text-cyan-400 transition-colors flex items-center gap-1 text-base" /* Increased text to base */
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            whileTap={{ scale: 0.9 }}
                            aria-label="Visit our GitHub repository"
                        >
                           <GitHubIcon className="w-4 h-4" />
                           <span>GitHub</span>
                        </motion.a>
                    </div>
                </div>
            </div>
        </motion.footer>
    );
};

export default Footer;