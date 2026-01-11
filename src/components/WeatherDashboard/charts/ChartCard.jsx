import React from "react";

const ChartCard = ({ title, legend, children }) => {
    return (
        <div className="wd-card wd-chart-card">
            {/* Header */}
            <div className="wd-chart-header">
                <div className="wd-header-left">
                    <h3 className="wd-card-title">{title}</h3>
                </div>
                <div className="wd-card-actions">
                    <button className="wd-icon-btn wd-icon-btn-sm" title="Export data">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                            <polyline points="7,10 12,15 17,10" />
                            <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                    </button>
                    <button className="wd-icon-btn wd-icon-btn-sm" title="More options">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                            <circle cx="12" cy="5" r="1.5" />
                            <circle cx="12" cy="12" r="1.5" />
                            <circle cx="12" cy="19" r="1.5" />
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
                            />
                            <span className="wd-legend-label">{item.label}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* Chart Content */}
            <div className="wd-chart-content">{children}</div>
        </div>
    );
};

export default ChartCard;
