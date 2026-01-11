import React from "react";

const CityTabs = ({ cities, activeCity, onCityChange, onAddCity }) => {
    return (
        <div className="wd-city-tabs">
            {cities.map((city) => (
                <button
                    key={city.name}
                    className={`wd-city-tab ${activeCity === city.name ? "active" : ""}`}
                    onClick={() => onCityChange(city)}
                >
                    {city.name}
                </button>
            ))}
            <button className="wd-add-city" onClick={onAddCity} title="Add city">
                <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                >
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
            </button>
        </div>
    );
};

export default CityTabs;
