import React from "react";

const MetricCard = ({ icon, label, value, description }) => {
    return (
        <div className="wd-metric-card">
            <div className="wd-metric-header">
                <div className="wd-metric-icon">{icon}</div>
                <span className="wd-metric-label">{label}</span>
            </div>
            <div className="wd-metric-value">{value}</div>
            {description && <div className="wd-metric-desc">{description}</div>}
        </div>
    );
};

export default MetricCard;
