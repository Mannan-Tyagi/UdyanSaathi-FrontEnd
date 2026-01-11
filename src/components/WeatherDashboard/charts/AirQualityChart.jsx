import React from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from "recharts";
import ChartCard from "./ChartCard";

// Mock data for demo - replace with actual data
const generateMockData = () => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const today = new Date().getDay();

    return Array.from({ length: 9 }, (_, i) => ({
        name: i === 0 ? "Today" : days[(today + i) % 7],
        value: Math.floor(Math.random() * 40) + 10,
        isToday: i === 0,
    }));
};

const getBarColor = (value) => {
    if (value < 20) return "#93c5fd";
    if (value < 35) return "#60a5fa";
    return "#3b82f6";
};

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="wd-chart-tooltip">
                <p className="wd-tooltip-label">{label}</p>
                <p className="wd-tooltip-value">
                    AQI: <strong>{payload[0].value}</strong>
                </p>
            </div>
        );
    }
    return null;
};

const AirQualityChart = ({ data }) => {
    const chartData = data || generateMockData();

    const legend = [
        { color: "#93c5fd", label: "Good" },
        { color: "#60a5fa", label: "Moderate" },
        { color: "#3b82f6", label: "Unhealthy" },
    ];

    return (
        <ChartCard title="Air Quality Index" legend={legend}>
            <div className="wd-recharts-container">
                <ResponsiveContainer width="100%" height={160}>
                    <BarChart
                        data={chartData}
                        margin={{ top: 20, right: 10, left: -20, bottom: 5 }}
                        barCategoryGap="20%"
                    >
                        <defs>
                            <linearGradient id="aqiGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
                                <stop offset="100%" stopColor="#93c5fd" stopOpacity={0.8} />
                            </linearGradient>
                        </defs>
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 11, fill: "#9ca3af" }}
                            dy={8}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fill: "#9ca3af" }}
                            domain={[0, 50]}
                            ticks={[0, 25, 50]}
                        />
                        <Tooltip
                            content={<CustomTooltip />}
                            cursor={{ fill: "rgba(59, 130, 246, 0.1)", radius: 8 }}
                        />
                        <Bar
                            dataKey="value"
                            radius={[8, 8, 0, 0]}
                            maxBarSize={24}
                        >
                            {chartData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={getBarColor(entry.value)}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </ChartCard>
    );
};

export default AirQualityChart;
