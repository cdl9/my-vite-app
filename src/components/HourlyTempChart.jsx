import React from "react";
import { LineChart, Line, AreaChart, Area, LabelList, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { Tooltip as ReTooltip } from "recharts";

const chartConfig = {
  temp: { key: "temp", color: "#ffaf3e", label: "Temperature", unit: "°" },
  humidity: { key: "humidity", color: "#74cbf1", label: "Humidity", unit: "%" },
  wind: { key: "wind", color: "#938ef5", label: "Wind", unit: "" },
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
      <div><strong>{label}</strong></div>
      <div>{`${name}: ${value}${displayUnit}`}</div>
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
      <ResponsiveContainer width="100%" height={300} style={{outline:"none", stroke:"none"}}>
      {isBar ? (
        <BarChart data={hourlyData}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis dataKey="time" />
          <YAxis
            label={{
              value: `${label} (${displayUnit})`,
              angle: -90,
              position: "insideLeft"
            }}
            padding={{ top: 20 }}
          />
           <Tooltip content={<CustomTooltip chartType={selectedChart} unit={unit} />} cursor={{ fill: 'transparent' }}/>
           <defs>
            <linearGradient id="rainGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.9}/>
              <stop offset="100%" stopColor="#74c0fc" stopOpacity={0.4}/>
            </linearGradient>
            <linearGradient id="rainGradientActive" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={1} />      {/* slightly stronger on top */}
              <stop offset="100%" stopColor="#74c0fc" stopOpacity={0.6} /> {/* slightly stronger on bottom */}
            </linearGradient>
          </defs>

          <Bar dataKey={key} fill="url(#rainGradient)" barSize={12} radius={[6, 6, 0, 0]} isAnimationActive={true} animationDuration={800} activeBar={{fill:"url(#rainGradientActive)"}}>
            <LabelList dataKey="rain" formatter={(v) => `${Math.round(v)}%`} position="top" />
          </Bar>
        </BarChart>
      ) : (
        <AreaChart data={hourlyData}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.3}/>
          <XAxis dataKey="time"  />
          <YAxis
            label={{
              value: `${label} (${displayUnit})`,
              angle: -90,
              position: "insideLeft"
            }}
            padding={{ top: 20}}
          />
           <Tooltip content={<CustomTooltip chartType={selectedChart} unit={unit} />} />
          <defs>
            <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.8}/>
              <stop offset="100%" stopColor={color} stopOpacity={0.2}/>
            </linearGradient>
          </defs>
          <Area type="monotone" dataKey={key} stroke={color} strokeWidth={3}  
            dot={{ r: 4, stroke: color, strokeWidth: 1, fill: "#fff" }} // custom dot style
            activeDot={{ r: 8, strokeWidth: 2 }}
            fill="url(#tempGradient)"  // soft area under line
            isAnimationActive={true}
            animationDuration={800}  
          />
        </AreaChart>
      )}
    </ResponsiveContainer>
    </div>
  );
};

export default HourlyTempChart;
