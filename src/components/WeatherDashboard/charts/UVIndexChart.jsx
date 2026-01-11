import React from "react";
import ChartCard from "./ChartCard";
import { generateMockChartData } from "../utils";

const UVIndexChart = ({ data }) => {
    // Use provided data or generate mock data for UV index (0-12 scale)
    const chartData = data || generateMockChartData(7, 2, 12);

    const legend = [
        { color: "#4ade80", label: "Low" },
        { color: "#facc15", label: "Moderate" },
        { color: "#fb923c", label: "High" },
        { color: "#ef4444", label: "Very High" },
    ];

    const maxValue = 12;

    // Calculate segment heights based on UV value
    const getSegments = (value) => {
        const segments = [];
        const segmentSize = 3; // Each segment represents 3 UV levels

        // Low (0-3)
        const low = Math.min(value, 3);
        if (low > 0) {
            segments.push({
                height: (low / maxValue) * 100,
                color: "#4ade80",
            });
        }

        // Moderate (3-6)
        const moderate = Math.min(Math.max(value - 3, 0), 3);
        if (moderate > 0) {
            segments.push({
                height: (moderate / maxValue) * 100,
                color: "#facc15",
            });
        }

        // High (6-9)
        const high = Math.min(Math.max(value - 6, 0), 3);
        if (high > 0) {
            segments.push({
                height: (high / maxValue) * 100,
                color: "#fb923c",
            });
        }

        // Very High (9-12)
        const veryHigh = Math.min(Math.max(value - 9, 0), 3);
        if (veryHigh > 0) {
            segments.push({
                height: (veryHigh / maxValue) * 100,
                color: "#ef4444",
            });
        }

        return segments;
    };

    return (
        <ChartCard title="Ultraviolet Index" legend={legend}>
            <div className="wd-chart-container">
                {chartData.map((item, index) => {
                    const segments = getSegments(item.value);
                    const isToday = index === 0;

                    return (
                        <div key={index} className="wd-chart-bar-group">
                            {isToday && (
                                <span className="wd-chart-today-marker">Today</span>
                            )}
                            <div
                                className="wd-uv-bar"
                                style={{ display: "flex", flexDirection: "column-reverse" }}
                                title={`UV: ${item.value}`}
                            >
                                {segments.map((segment, segIndex) => (
                                    <div
                                        key={segIndex}
                                        className="wd-uv-segment"
                                        style={{
                                            height: `${segment.height}%`,
                                            backgroundColor: segment.color,
                                            minHeight: segment.height > 0 ? "4px" : "0",
                                        }}
                                    ></div>
                                ))}
                            </div>
                            <span className="wd-chart-label">{item.day}</span>
                        </div>
                    );
                })}
            </div>
        </ChartCard>
    );
};

export default UVIndexChart;
