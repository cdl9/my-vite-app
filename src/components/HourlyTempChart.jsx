import React from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { Tooltip as ReTooltip } from "recharts";

const chartConfig = {
  temp: { key: "temp", color: "#ff7300", label: "Temperature", unit: "°" },
  humidity: { key: "humidity", color: "#00bcd4", label: "Humidity", unit: "%" },
  wind: { key: "wind", color: "#3f51b5", label: "Wind", unit: "" },
  rain: { key: "rain", color: "#938ef5", label: "Rain Probaility", unit: "%", isBar: true }
};

function CustomTooltip({ active, payload, label, chartType, unit }) {
  if (!active || !payload || !payload.length) return null;

  const value = payload[0].value;

  let name = "";
  let displayUnit = "";

  switch (chartType) {
    case "temp":
      name = "Temperature";
      displayUnit = unit === "metric" ? "°C" : "°F";
      break;
    case "humidity":
      name = "Humidity";
      displayUnit = "%";
      break;
    case "wind":
      name = "Wind";
      displayUnit = unit === "metric" ? "m/s" : "mph";
      break;
    case "rain":
      name = "Rain";
      displayUnit = "%";
      break;
    default:
      name = "";
  }

  return (
    <div className="custom-tooltip">
      <p><strong>{label}</strong></p>
      <p>{`${name}: ${value}${displayUnit}`}</p>
    </div>
  );
}

const HourlyTempChart = ({ hourlyData, selectedChart, unit }) => {
  const { key, color, label, unit: unitLabel, isBar } = chartConfig[selectedChart];

  const displayUnit =
    selectedChart === "wind"
      ? unit === "metric"
        ? "m/s"
        : "mph"
      : unitLabel;

  return (
    <div className="chart-container" >
      <ResponsiveContainer width="100%" height={300}>
      {isBar ? (
        <BarChart data={hourlyData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis
            label={{
              value: `${label} (${displayUnit})`,
              angle: -90,
              position: "insideLeft"
            }}
          />
           <Tooltip content={<CustomTooltip chartType={selectedChart} unit={unit} />} />
          <Bar dataKey={key} fill={color} />
        </BarChart>
      ) : (
        <LineChart data={hourlyData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis
            label={{
              value: `${label} (${displayUnit})`,
              angle: -90,
              position: "insideLeft"
            }}
          />
           <Tooltip content={<CustomTooltip chartType={selectedChart} unit={unit} />} />

          <Line type="monotone" dataKey={key} stroke={color} strokeWidth={2} />
        </LineChart>
      )}
    </ResponsiveContainer>
    </div>
  );
};

export default HourlyTempChart;
