import React from "react";

const ChartCard = ({ title, legend, children }) => {
    return (
        <div className="wd-card wd-chart-card">
            {/* Header */}
            <div className="wd-chart-header">
                <h3 className="wd-card-title">{title}</h3>
                <div className="wd-card-actions">
                    <button className="wd-icon-btn" title="Download">
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                            <polyline points="7,10 12,15 17,10" />
                            <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                    </button>
                    <button className="wd-icon-btn" title="More options">
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <circle cx="12" cy="6" r="2" />
                            <circle cx="12" cy="12" r="2" />
                            <circle cx="12" cy="18" r="2" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Legend */}
            {legend && (
                <div className="wd-chart-legend">
                    {legend.map((item, index) => (
                        <div key={index} className="wd-legend-item">
                            <span
                                className="wd-legend-dot"
                                style={{ backgroundColor: item.color }}
                            ></span>
                            <span>{item.label}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* Chart Content */}
            {children}
        </div>
    );
};

export default ChartCard;
