export const Portfolio: React.FC = () => {
    return (
        <section id="research-tools" className="bg-blue-100 py-24 border-t-2 border-black" style={{
            backgroundImage: `
        linear-gradient(rgba(0, 0, 0, 0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0, 0, 0, 0.03) 1px, transparent 1px)
      `,
            backgroundSize: '20px 20px'
        }}>
            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <p className="text-sm font-bold text-gray-600 uppercase tracking-widest mb-4">MAINTENANCE DASHBOARD</p>
                        <h2 className="text-5xl font-black text-gray-900 mb-6">All your maintenance. One Dashboard.</h2>

                        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                            Stop tracking maintenance in spreadsheets. Visualize requests, teams, and equipment status with drag-and-drop Kanban, Calendar views, and detailed reports.
                        </p>

                        <div className="space-y-4 mb-8">
                            <div className="bg-white rounded-2xl border-3 border-black p-5 flex items-center space-x-4 shadow-brutal-sm">
                                <div className="w-10 h-10 bg-white rounded-lg border-2 border-black flex items-center justify-center flex-shrink-0">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                                    </svg>
                                </div>
                                <span className="text-lg font-bold text-gray-900">
                                    Drag & Drop <span className="bg-yellow-300 px-2 py-1 rounded">Kanban Board</span>
                                </span>
                            </div>

                            <div className="bg-white rounded-2xl border-3 border-black p-5 flex items-center space-x-4 shadow-brutal-sm">
                                <div className="w-10 h-10 bg-white rounded-lg border-2 border-black flex items-center justify-center flex-shrink-0">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <span className="text-lg font-bold text-gray-900">Calendar & Scheduling</span>
                            </div>
                        </div>

                        <button className="bg-white text-black px-8 py-4 rounded-full text-base font-bold border-4 border-black shadow-brutal-sm hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all">
                            Open Kanban Board
                        </button>
                    </div>

                    <div className="relative">
                        <div className="bg-white rounded-3xl border-4 border-black p-6 shadow-brutal-lg transform rotate-1">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-2xl font-black text-gray-900">Kanban Snapshot</h3>
                                <span className="bg-green-400 text-gray-900 px-3 py-1 rounded-full text-xs font-bold border-2 border-black">
                                    Live
                                </span>
                            </div>

                            <div className="space-y-4 mb-6">
                                <div className="flex items-center justify-between pb-4 border-b-2 border-gray-200">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center">
                                            <span className="text-white font-black text-lg">N</span>
                                        </div>
                                        <div>
                                            <p className="text-base font-bold text-gray-900">New Requests</p>
                                            <p className="text-sm text-gray-500">Pending assignment</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-yellow-600">12 items</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pb-4 border-b-2 border-gray-200">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                                            <span className="text-white font-black text-lg">P</span>
                                        </div>
                                        <div>
                                            <p className="text-base font-bold text-gray-900">In Progress</p>
                                            <p className="text-sm text-gray-500">Active repairs</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-blue-600">8 items</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t-2 border-gray-300">
                                <span className="text-base font-bold text-gray-600">Columns: New / In Progress / Repaired / Scrap</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Portfolio;
