export const Footer: React.FC = () => {
    return (
        <footer className="bg-white py-8 border-t-2 border-black">
            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
                <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
                    <div className="flex items-center space-x-2">
                        <div className="w-9 h-9 bg-green-400 rounded-xl border-2 border-black flex items-center justify-center">
                            <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <span className="text-xl font-bold text-gray-900">GearGuard</span>
                    </div>

                    <div className="flex items-center space-x-8">
                        <a href="#" className="text-sm font-semibold text-gray-900 hover:text-gray-600 transition-colors">
                            Privacy Policy
                        </a>
                        <a href="#" className="text-sm font-semibold text-gray-900 hover:text-gray-600 transition-colors">
                            Terms of Service
                        </a>
                        <a href="#" className="text-sm font-semibold text-gray-900 hover:text-gray-600 transition-colors">
                            GitHub Repo
                        </a>
                        <a href="#" className="text-sm font-semibold text-gray-900 hover:text-gray-600 transition-colors">
                            Contact
                        </a>
                    </div>

                    <div className="text-sm text-gray-600">
                        © 2025 GearGuard. Made by Team <span className="font-bold text-gray-900">Innov 8</span>.
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
