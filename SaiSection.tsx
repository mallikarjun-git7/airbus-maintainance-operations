export const SaiSection: React.FC = () => {
    return (
        <section id="ai-assistant" className="bg-amber-50 py-24 border-t-2 border-black" style={{
            backgroundImage: `
        linear-gradient(rgba(0, 0, 0, 0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0, 0, 0, 0.03) 1px, transparent 1px)
      `,
            backgroundSize: '20px 20px'
        }}>
            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
                <div className="text-center mb-16">
                    <div className="inline-block bg-black text-white px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
                        SMART MAINTENANCE ROUTING
                    </div>
                    <h2 className="text-5xl font-black text-gray-900">Your Maintenance Workflow Engine</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                    <div className="bg-white rounded-3xl border-4 border-black p-8 shadow-brutal hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all">
                        <div className="flex justify-center mb-6">
                            <div className="w-16 h-16 rounded-full border-3 border-black flex items-center justify-center">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                            </div>
                        </div>

                        <h3 className="text-2xl font-black text-gray-900 text-center mb-6">You Report</h3>

                        <div className="bg-gray-50 rounded-2xl p-5 border-2 border-gray-200">
                            <p className="text-gray-600 text-center italic">"AC stopped working in Lab 2"</p>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-3xl border-4 border-black p-8 shadow-brutal hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all">
                        <div className="flex justify-center mb-6">
                            <div className="w-16 h-16 bg-indigo-400 rounded-2xl border-3 border-black flex items-center justify-center">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                                </svg>
                            </div>
                        </div>

                        <h3 className="text-3xl font-black text-white text-center mb-6">GearGuard Routes</h3>

                        <div className="space-y-4">
                            <div className="flex items-center space-x-3">
                                <svg className="w-5 h-5 text-white flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <span className="text-white font-semibold">Auto-fills equipment</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <svg className="w-5 h-5 text-white flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                <span className="text-white font-semibold">Suggests team</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <svg className="w-5 h-5 text-white flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                </svg>
                                <span className="text-white font-semibold">Breakdown vs routine</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <svg className="w-5 h-5 text-white flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-white font-semibold">Logs duration</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl border-4 border-black p-8 shadow-brutal hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all">
                        <div className="flex justify-center mb-6">
                            <div className="w-16 h-16 rounded-full border-3 border-black flex items-center justify-center">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>

                        <h3 className="text-2xl font-black text-gray-900 text-center mb-6">GearGuard Updates</h3>

                        <div className="bg-green-50 rounded-2xl p-5 border-2 border-green-200">
                            <p className="text-gray-800 text-center font-medium">"Status: New → In Progress → Repaired. Can mark as Scrap if needed. Full tracking available."</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SaiSection;
