import React from "react";

const Sidebar = () => {
    return (
        <aside className="wd-sidebar">
            {/* Logo */}
            <div className="wd-sidebar-logo">
                <svg
                    viewBox="0 0 40 40"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <rect width="40" height="40" rx="8" fill="#3B82F6" />
                    <path
                        d="M12 14L20 10L28 14V26L20 30L12 26V14Z"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M12 14L20 18L28 14"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinejoin="round"
                    />
                    <path d="M20 18V30" stroke="white" strokeWidth="2" />
                </svg>
            </div>

            {/* Navigation */}
            <nav className="wd-sidebar-nav">
                {/* Dashboard */}
                <button className="wd-sidebar-item active" title="Dashboard">
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <rect x="3" y="3" width="7" height="7" rx="1" />
                        <rect x="14" y="3" width="7" height="7" rx="1" />
                        <rect x="3" y="14" width="7" height="7" rx="1" />
                        <rect x="14" y="14" width="7" height="7" rx="1" />
                    </svg>
                </button>

                {/* Clock/History */}
                <button className="wd-sidebar-item" title="History">
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <circle cx="12" cy="12" r="9" />
                        <path d="M12 6v6l4 2" />
                    </svg>
                </button>

                {/* Globe */}
                <button className="wd-sidebar-item" title="Global Weather">
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <circle cx="12" cy="12" r="9" />
                        <path d="M3.6 9h16.8M3.6 15h16.8" />
                        <path d="M12 3c-2.5 3-4 6-4 9s1.5 6 4 9c2.5-3 4-6 4-9s-1.5-6-4-9z" />
                    </svg>
                </button>

                {/* Calendar */}
                <button className="wd-sidebar-item" title="Forecast Calendar">
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <rect x="3" y="4" width="18" height="18" rx="2" />
                        <path d="M16 2v4M8 2v4M3 10h18" />
                    </svg>
                </button>

                {/* Settings */}
                <button className="wd-sidebar-item" title="Settings">
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <circle cx="12" cy="12" r="3" />
                        <path d="M12 1v4m0 14v4m11-11h-4M5 12H1m17.36-6.36l-2.83 2.83M9.46 14.54l-2.83 2.83m0-10.73l2.83 2.83m5.08 5.08l2.83 2.83" />
                    </svg>
                </button>
            </nav>

            {/* Bottom - Logout */}
            <div className="wd-sidebar-bottom">
                <button className="wd-sidebar-item" title="Logout">
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                        <polyline points="16,17 21,12 16,7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
