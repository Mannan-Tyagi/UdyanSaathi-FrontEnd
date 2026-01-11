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
        value: Math.floor(Math.random() * 100),
        isToday: i === 0,
    }));
};

const getBarColor = (value) => {
    if (value < 30) return "#bae6fd";
    if (value < 60) return "#60a5fa";
    if (value < 80) return "#3b82f6";
    return "#1e40af";
};

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        const value = payload[0].value;
        let description = "Low chance";
        if (value >= 30 && value < 60) description = "Moderate chance";
        else if (value >= 60 && value < 80) description = "High chance";
        else if (value >= 80) description = "Very high chance";

        return (
            <div className="wd-chart-tooltip">
                <p className="wd-tooltip-label">{label}</p>
                <p className="wd-tooltip-value">
                    <strong>{value}%</strong> chance
                </p>
                <p className="wd-tooltip-desc">{description}</p>
            </div>
        );
    }
    return null;
};

const ChanceOfRainChart = ({ data }) => {
    const chartData = data || generateMockData();

    const legend = [
        { color: "#bae6fd", label: "0-30%" },
        { color: "#60a5fa", label: "30-60%" },
        { color: "#1e40af", label: "60%+" },
    ];

    return (
        <ChartCard title="Chance of Rain" legend={legend}>
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
                            domain={[0, 100]}
                            ticks={[0, 50, 100]}
                            tickFormatter={(value) => `${value}%`}
                        />
                        <ReferenceLine
                            y={50}
                            stroke="#e5e7eb"
                            strokeDasharray="3 3"
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

export default ChanceOfRainChart;
