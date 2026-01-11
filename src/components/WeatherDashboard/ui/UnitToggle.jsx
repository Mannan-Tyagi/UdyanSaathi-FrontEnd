import React from "react";

const UnitToggle = ({ unit, onToggle, isDark = false }) => {
    return (
        <div
            className={`wd-unit-toggle ${isDark ? "wd-unit-toggle-dark" : ""}`}
            onClick={onToggle}
        >
            <span
                className={`wd-unit-option ${unit === "C" ? "active" : ""}`}
            >
                °C
            </span>
            <span className="wd-unit-divider">/</span>
            <span
                className={`wd-unit-option ${unit === "F" ? "active" : ""}`}
            >
                °F
            </span>
        </div>
    );
};

export default UnitToggle;
