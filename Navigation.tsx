import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
};

export const Navigation: React.FC = () => {
    return (
        <motion.nav
            className="border-b border-gray-200 bg-white sticky top-0 z-50"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
        >
            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <motion.div
                        className="flex items-center space-x-2"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="w-9 h-9 bg-green-400 rounded-xl border-2 border-black flex items-center justify-center">
                            <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <span className="text-xl font-bold text-gray-900">GearGuard</span>
                    </motion.div>

                    {/* Navigation Links - Centered */}
                    <div className="hidden md:flex items-center justify-center flex-1">
                        <div className="flex items-center space-x-10">
                            <motion.button
                                onClick={() => scrollToSection('features')}
                                className="text-sm font-semibold text-gray-900 hover:text-gray-600 transition-colors relative group"
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.2 }}
                            >
                                Features
                            </motion.button>
                            <motion.button
                                onClick={() => scrollToSection('features')}
                                className="text-sm font-semibold text-gray-900 hover:text-gray-600 transition-colors relative group"
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.2 }}
                            >
                                Equipment
                            </motion.button>
                            <motion.button
                                onClick={() => scrollToSection('ai-assistant')}
                                className="text-sm font-semibold text-gray-900 hover:text-gray-600 transition-colors relative group"
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.2 }}
                            >
                                Teams
                            </motion.button>
                            <motion.button
                                onClick={() => scrollToSection('ai-assistant')}
                                className="text-sm font-semibold text-gray-900 hover:text-gray-600 transition-colors relative group"
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.2 }}
                            >
                                Requests
                            </motion.button>
                            <motion.button
                                onClick={() => scrollToSection('research-tools')}
                                className="text-sm font-semibold text-gray-900 hover:text-gray-600 transition-colors relative group"
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.2 }}
                            >
                                Kanban
                            </motion.button>
                            <motion.button
                                onClick={() => scrollToSection('research-tools')}
                                className="text-sm font-semibold text-gray-900 hover:text-gray-600 transition-colors relative group"
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.2 }}
                            >
                                Calendar
                            </motion.button>
                            <motion.button
                                onClick={() => scrollToSection('research-tools')}
                                className="text-sm font-semibold text-gray-900 hover:text-gray-600 transition-colors relative group"
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.2 }}
                            >
                                Reports
                            </motion.button>
                            <Link to="/login">
                                <motion.button
                                    className="text-sm font-semibold text-gray-900 hover:text-gray-600 transition-colors relative group"
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    Login
                                </motion.button>
                            </Link>
                        </div>
                    </div>

                    {/* CTA Button */}
                    <motion.div
                        whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(0,0,0,0.2)" }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Link
                            to="/login"
                            className="bg-black text-white px-6 py-2.5 rounded-full text-sm font-bold border-3 border-black inline-block"
                        >
                            Create Request
                        </Link>
                    </motion.div>
                </div>
            </div>
        </motion.nav>
    );
};

export default Navigation;
