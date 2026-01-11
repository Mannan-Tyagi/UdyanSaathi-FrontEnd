import React from "react";

const UnitToggle = ({ unit, onToggle }) => {
    return (
        <div className="wd-unit-toggle" onClick={onToggle}>
            <span style={{ fontWeight: unit === "C" ? 600 : 400 }}>°C</span>
            <span style={{ color: "#9CA3AF" }}>/</span>
            <span style={{ fontWeight: unit === "F" ? 600 : 400 }}>°F</span>
            <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
            >
                <path d="M6 9l6 6 6-6" />
            </svg>
        </div>
    );
};

export default UnitToggle;
