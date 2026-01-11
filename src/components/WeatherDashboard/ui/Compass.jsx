import React from "react";

const Compass = ({ degrees = 0, speed, unit = "m/s" }) => {
    return (
        <div className="wd-compass-new">
            {/* Outer Ring */}
            <div className="wd-compass-ring-new">
                {/* Direction Labels */}
                <span className="wd-compass-dir wd-dir-n">N</span>
                <span className="wd-compass-dir wd-dir-e">E</span>
                <span className="wd-compass-dir wd-dir-s">S</span>
                <span className="wd-compass-dir wd-dir-w">W</span>

                {/* Inner Ring with tick marks */}
                <div className="wd-compass-inner">
                    {/* Tick marks */}
                    {[...Array(12)].map((_, i) => (
                        <div
                            key={i}
                            className="wd-compass-tick"
                            style={{
                                transform: `rotate(${i * 30}deg)`,
                            }}
                        />
                    ))}

                    {/* Direction indicator line */}
                    <div
                        className="wd-compass-indicator"
                        style={{
                            transform: `rotate(${degrees}deg)`,
                        }}
                    >
                        <div className="wd-indicator-line" />
                    </div>

                    {/* Center display */}
                    <div className="wd-compass-center-new">
                        <span className="wd-center-value">{speed}</span>
                        <span className="wd-center-unit">{unit}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Compass;
