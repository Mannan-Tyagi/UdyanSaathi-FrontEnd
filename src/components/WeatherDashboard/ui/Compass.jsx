import React from "react";

const Compass = ({ degrees = 0, speed, unit = "m/s" }) => {
    // Get wind direction label
    const getWindDirection = (deg) => {
        const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
        const index = Math.round(deg / 45) % 8;
        return directions[index];
    };

    return (
        <div className="wd-compass">
            {/* Outer ring with gradient */}
            <svg viewBox="0 0 120 120" className="wd-compass-svg">
                {/* Background circle */}
                <circle
                    cx="60"
                    cy="60"
                    r="54"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="2"
                />

                {/* Direction ticks */}
                {[...Array(16)].map((_, i) => {
                    const angle = i * 22.5;
                    const isMajor = i % 4 === 0;
                    const length = isMajor ? 8 : 4;
                    const x1 = 60 + (54 - length) * Math.sin((angle * Math.PI) / 180);
                    const y1 = 60 - (54 - length) * Math.cos((angle * Math.PI) / 180);
                    const x2 = 60 + 54 * Math.sin((angle * Math.PI) / 180);
                    const y2 = 60 - 54 * Math.cos((angle * Math.PI) / 180);

                    return (
                        <line
                            key={i}
                            x1={x1}
                            y1={y1}
                            x2={x2}
                            y2={y2}
                            stroke={isMajor ? "#6b7280" : "#d1d5db"}
                            strokeWidth={isMajor ? 2 : 1}
                            strokeLinecap="round"
                        />
                    );
                })}

                {/* Direction labels */}
                <text x="60" y="18" textAnchor="middle" className="wd-compass-label wd-compass-label-primary">N</text>
                <text x="102" y="64" textAnchor="middle" className="wd-compass-label">E</text>
                <text x="60" y="110" textAnchor="middle" className="wd-compass-label">S</text>
                <text x="18" y="64" textAnchor="middle" className="wd-compass-label">W</text>

                {/* Wind direction indicator */}
                <g transform={`rotate(${degrees}, 60, 60)`}>
                    {/* Arrow body */}
                    <path
                        d="M60 20 L64 50 L60 45 L56 50 Z"
                        fill="url(#arrowGradient)"
                    />
                    {/* Arrow tail */}
                    <line
                        x1="60"
                        y1="45"
                        x2="60"
                        y2="75"
                        stroke="#94a3b8"
                        strokeWidth="2"
                        strokeLinecap="round"
                    />
                </g>

                {/* Gradient definition */}
                <defs>
                    <linearGradient id="arrowGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#1d4ed8" />
                    </linearGradient>
                </defs>
            </svg>

            {/* Center display */}
            <div className="wd-compass-center">
                <span className="wd-compass-speed">{speed}</span>
                <span className="wd-compass-unit">{unit}</span>
                <span className="wd-compass-direction">{getWindDirection(degrees)}</span>
            </div>
        </div>
    );
};

export default Compass;
