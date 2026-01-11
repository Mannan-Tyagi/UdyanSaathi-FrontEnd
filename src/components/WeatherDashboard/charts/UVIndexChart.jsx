import React from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Cell,
    ReferenceLine,
} from "recharts";
import ChartCard from "./ChartCard";

// Mock data for demo
const generateMockData = () => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const today = new Date().getDay();

    return Array.from({ length: 7 }, (_, i) => ({
        name: i === 0 ? "Today" : days[(today + i) % 7],
        value: Math.floor(Math.random() * 11) + 1,
        isToday: i === 0,
    }));
};

const getUVColor = (value) => {
    if (value <= 2) return "#22c55e"; // Low - Green
    if (value <= 5) return "#facc15"; // Moderate - Yellow
    if (value <= 7) return "#fb923c"; // High - Orange
    if (value <= 10) return "#ef4444"; // Very High - Red
    return "#a855f7"; // Extreme - Purple
};

const getUVLevel = (value) => {
    if (value <= 2) return "Low";
    if (value <= 5) return "Moderate";
    if (value <= 7) return "High";
    if (value <= 10) return "Very High";
    return "Extreme";
};

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        const value = payload[0].value;
        const level = getUVLevel(value);
        const color = getUVColor(value);

        return (
            <div className="wd-chart-tooltip">
                <p className="wd-tooltip-label">{label}</p>
                <p className="wd-tooltip-value">
                    UV Index: <strong>{value}</strong>
                </p>
                <p className="wd-tooltip-level" style={{ color }}>
                    {level}
                </p>
            </div>
        );
    }
    return null;
};

const UVIndexChart = ({ data }) => {
    const chartData = data || generateMockData();

    const legend = [
        { color: "#22c55e", label: "Low (0-2)" },
        { color: "#facc15", label: "Moderate (3-5)" },
        { color: "#fb923c", label: "High (6-7)" },
        { color: "#ef4444", label: "Very High (8+)" },
    ];

    return (
        <ChartCard title="UV Index" legend={legend}>
            <div className="wd-recharts-container">
                <ResponsiveContainer width="100%" height={160}>
                    <BarChart
                        data={chartData}
                        margin={{ top: 20, right: 10, left: -20, bottom: 5 }}
                        barCategoryGap="20%"
                    >
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
                            domain={[0, 12]}
                            ticks={[0, 3, 6, 9, 12]}
                        />
                        <ReferenceLine
                            y={6}
                            stroke="#fb923c"
                            strokeDasharray="3 3"
                            strokeOpacity={0.5}
                        />
                        <Tooltip
                            content={<CustomTooltip />}
                            cursor={{ fill: "rgba(251, 146, 60, 0.1)", radius: 8 }}
                        />
                        <Bar
                            dataKey="value"
                            radius={[8, 8, 0, 0]}
                            maxBarSize={24}
                        >
                            {chartData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={getUVColor(entry.value)}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </ChartCard>
    );
};

export default UVIndexChart;
