import React from "react";
import ChartCard from "./ChartCard";
import { generateMockChartData } from "../utils";

const AirQualityChart = ({ data }) => {
    // Use provided data or generate mock data
    const chartData = data || generateMockChartData(9, 10, 50);

    const legend = [
        { color: "#93c5fd", label: "Clean air" },
        { color: "#60a5fa", label: "Average quality" },
        { color: "#1e40af", label: "Harmful level" },
    ];

    const maxValue = 50;

    return (
        <ChartCard title="Air quality index" legend={legend}>
            <div className="wd-chart-container">
                {chartData.map((item, index) => {
                    const heightPercent = (item.value / maxValue) * 100;
                    const isToday = index === 0;

                    return (
                        <div key={index} className="wd-chart-bar-group">
                            {isToday && (
                                <span className="wd-chart-today-marker">Today</span>
                            )}
                            <div
                                className="wd-chart-bar"
                                style={{
                                    height: `${heightPercent}%`,
                                    background:
                                        item.value < 20
                                            ? "linear-gradient(180deg, #93c5fd 0%, #dbeafe 100%)"
                                            : item.value < 35
                                                ? "linear-gradient(180deg, #60a5fa 0%, #93c5fd 100%)"
                                                : "linear-gradient(180deg, #3b82f6 0%, #60a5fa 100%)",
                                }}
                                title={`AQI: ${item.value}`}
                            ></div>
                            <span className="wd-chart-label">{item.day}</span>
                        </div>
                    );
                })}
            </div>
        </ChartCard>
    );
};

export default AirQualityChart;
