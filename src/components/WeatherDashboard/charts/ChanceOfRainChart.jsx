import React from "react";
import ChartCard from "./ChartCard";
import { generateMockChartData } from "../utils";

const ChanceOfRainChart = ({ data }) => {
    // Use provided data or generate mock data
    const chartData = data || generateMockChartData(7, 0, 100);

    const legend = [
        { color: "#e0f2fe", label: "Cloudy: 0-30%" },
        { color: "#60a5fa", label: "Rain: 60-80%" },
        { color: "#1e40af", label: "Heavy rain: 80-100%" },
    ];

    const maxValue = 100;

    const getBarColor = (value) => {
        if (value < 30) {
            return "linear-gradient(180deg, #bae6fd 0%, #e0f2fe 100%)";
        } else if (value < 60) {
            return "linear-gradient(180deg, #60a5fa 0%, #93c5fd 100%)";
        } else if (value < 80) {
            return "linear-gradient(180deg, #3b82f6 0%, #60a5fa 100%)";
        } else {
            return "linear-gradient(180deg, #1e40af 0%, #3b82f6 100%)";
        }
    };

    return (
        <ChartCard title="Chance Of Rain" legend={legend}>
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
                                    background: getBarColor(item.value),
                                }}
                                title={`Rain: ${item.value}%`}
                            ></div>
                            <span className="wd-chart-label">{item.day}</span>
                        </div>
                    );
                })}
            </div>
        </ChartCard>
    );
};

export default ChanceOfRainChart;
