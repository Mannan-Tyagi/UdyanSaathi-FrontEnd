import React from "react";

const LocationBadge = ({ city, country }) => {
    return (
        <div className="wd-location-badge">
            <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
            >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                <circle cx="12" cy="10" r="3" />
            </svg>
            <span>
                {city}
                {country && `, ${country}`}
            </span>
        </div>
    );
};

export default LocationBadge;
