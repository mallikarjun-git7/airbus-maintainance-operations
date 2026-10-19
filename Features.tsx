export const Features: React.FC = () => {
    return (
        <section id="features" className="bg-white py-24 border-t-2 border-black" style={{
            backgroundImage: `
        linear-gradient(rgba(0, 0, 0, 0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0, 0, 0, 0.03) 1px, transparent 1px)
      `,
            backgroundSize: '20px 20px'
        }}>
            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
                <div className="text-center mb-16">
                    <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">MAINTENANCE TRACKING PLATFORM</p>
                    <h2 className="text-5xl font-black text-gray-900">Everything you need for maintenance management</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-yellow-300 rounded-3xl border-4 border-black p-8 shadow-brutal hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all">
                        <div className="w-12 h-12 bg-white rounded-xl border-3 border-black flex items-center justify-center mb-6">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                            </svg>
                        </div>

                        <h3 className="text-2xl font-black text-gray-900 mb-4">Equipment Database</h3>
                        <p className="text-gray-800 mb-6 leading-relaxed">Store every machine/vehicle/computer with owner, location, warranty, serial no, vendor, and attachments.</p>

                        <div className="space-y-3">
                            <div className="flex items-center space-x-2">
                                <svg className="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="text-sm font-bold text-gray-900">Ownership by Department/Employee</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <svg className="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="text-sm font-bold text-gray-900">Warranty & Serial Tracking</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <svg className="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="text-sm font-bold text-gray-900">Central Asset Registry</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-green-300 rounded-3xl border-4 border-black p-8 shadow-brutal hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all relative">
                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-black text-white px-4 py-2 rounded-full text-xs font-bold">
                            TOP FEATURE
                        </div>

                        <div className="w-12 h-12 bg-white rounded-xl border-3 border-black flex items-center justify-center mb-6">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>

                        <h3 className="text-2xl font-black text-gray-900 mb-4">Maintenance Teams</h3>
                        <p className="text-gray-800 mb-6 leading-relaxed">Create specialized teams (Mechanics, Electricians, IT Support). Only team members can pick assigned requests.</p>

                        <div className="space-y-3">
                            <div className="flex items-center space-x-2">
                                <svg className="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="text-sm font-bold text-gray-900">Role-based assignment</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <svg className="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="text-sm font-bold text-gray-900">Team-wise queues</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <svg className="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="text-sm font-bold text-gray-900">Faster resolution</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-pink-300 rounded-3xl border-4 border-black p-8 shadow-brutal hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all">
                        <div className="w-12 h-12 bg-white rounded-xl border-3 border-black flex items-center justify-center mb-6">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                            </svg>
                        </div>

                        <h3 className="text-2xl font-black text-gray-900 mb-4">Maintenance Requests Workflow</h3>
                        <p className="text-gray-800 mb-6 leading-relaxed">Log breakdowns and preventive tasks with subject, equipment, scheduled date, and expected duration.</p>

                        <div className="space-y-3">
                            <div className="flex items-center space-x-2">
                                <svg className="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="text-sm font-bold text-gray-900">Breakdown & Routine</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <svg className="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="text-sm font-bold text-gray-900">Status Tracking</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <svg className="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="text-sm font-bold text-gray-900">Time Logging</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Features;
