import React from "react";
import WeatherIcon from "./WeatherIcon";

const DayCard = ({ day, date, icon, temp, condition, isActive, onClick }) => {
    return (
        <button
            className={`wd-day-card ${isActive ? "wd-day-card-active" : ""}`}
            onClick={onClick}
            type="button"
        >
            <div className="wd-day-header">
                <span className="wd-day-name">{day}</span>
                <span className="wd-day-number">{date}</span>
            </div>
            <div className="wd-day-icon-wrapper">
                <WeatherIcon condition={icon} size={48} />
            </div>
            <div className="wd-day-footer">
                <span className="wd-day-temp">{temp}</span>
                {condition && <span className="wd-day-condition">{condition}</span>}
            </div>
        </button>
    );
};

export default DayCard;
