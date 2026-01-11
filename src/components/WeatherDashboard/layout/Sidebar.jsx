import React, { useState } from "react";

const Sidebar = () => {
    const [activeItem, setActiveItem] = useState("dashboard");

    const navItems = [
        {
            id: "dashboard",
            title: "Dashboard",
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="3" width="7" height="7" rx="2" />
                    <rect x="14" y="3" width="7" height="7" rx="2" />
                    <rect x="3" y="14" width="7" height="7" rx="2" />
                    <rect x="14" y="14" width="7" height="7" rx="2" />
                </svg>
            ),
        },
        {
            id: "charts",
            title: "Analytics",
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M18 20V10M12 20V4M6 20v-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            ),
        },
        {
            id: "calendar",
            title: "Forecast Calendar",
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" />
                    <rect x="7" y="14" width="3" height="3" rx="0.5" />
                </svg>
            ),
        },
        {
            id: "globe",
            title: "Global Weather",
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M3.6 9h16.8M3.6 15h16.8" />
                    <ellipse cx="12" cy="12" rx="4" ry="9" />
                </svg>
            ),
        },
        {
            id: "settings",
            title: "Settings",
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
                </svg>
            ),
        },
    ];

    return (
        <aside className="wd-sidebar">
            {/* Logo */}
            <div className="wd-sidebar-logo">
                <div className="wd-logo-icon">
                    <svg viewBox="0 0 32 32" fill="none">
                        <path
                            d="M16 4C9.373 4 4 9.373 4 16s5.373 12 12 12 12-5.373 12-12S22.627 4 16 4z"
                            fill="url(#logoGradient)"
                        />
                        <path
                            d="M12 14c0-2.21 1.79-4 4-4s4 1.79 4 4"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                        />
                        <circle cx="16" cy="18" r="3" fill="white" />
                        <defs>
                            <linearGradient id="logoGradient" x1="4" y1="4" x2="28" y2="28">
                                <stop stopColor="#3B82F6" />
                                <stop offset="1" stopColor="#1D4ED8" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>
            </div>

            {/* Navigation */}
            <nav className="wd-sidebar-nav">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        className={`wd-sidebar-item ${activeItem === item.id ? "active" : ""}`}
                        title={item.title}
                        onClick={() => setActiveItem(item.id)}
                    >
                        <span className="wd-sidebar-icon">{item.icon}</span>
                        {activeItem === item.id && <span className="wd-sidebar-indicator" />}
                    </button>
                ))}
            </nav>

            {/* Bottom - User/Logout */}
            <div className="wd-sidebar-bottom">
                <button className="wd-sidebar-item" title="Notifications">
                    <span className="wd-sidebar-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </span>
                    <span className="wd-notification-dot" />
                </button>
                <div className="wd-sidebar-avatar">
                    <img
                        src="https://api.dicebear.com/7.x/avataaars/svg?seed=weather"
                        alt="User"
                    />
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
