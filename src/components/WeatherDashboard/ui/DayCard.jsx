import React from "react";
import WeatherIcon from "./WeatherIcon";

const DayCard = ({ day, date, icon, temp, isActive, onClick }) => {
    return (
        <div
            className={`wd-day-card ${isActive ? "active" : ""}`}
            onClick={onClick}
        >
            <div className="wd-day-name">{day}</div>
            <div className="wd-day-number">{date}</div>
            <div className="wd-day-icon">
                <WeatherIcon condition={icon} size={40} />
            </div>
            <div className="wd-day-temp">{temp}</div>
        </div>
    );
};

export default DayCard;
