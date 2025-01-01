import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";

// Регистрация компонентов Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

import { useEffect, useRef, useState } from "react";
import { Bar } from "react-chartjs-2";

import useTableStore from "../../zustand/store";
import { backgroundTicks, drawEvents, hoverLine } from "./customChartPlugins";
import "./style.css";

const BarChart = ({ chartDataProp, yKey, events }) => {
  const [activeLineY, setActiveLineY] = useState(null);
  const [activeLineYVal, setActiveLineYVal] = useState(null);

  const { chartType } = useTableStore();

  const chartRef = useRef();

  const [chartData, setChartData] = useState(chartDataProp);

  useEffect(() => {
    findMinMax(chartData, yKey);
  }, []);

  useEffect(() => {
    setChartData(resetData(chartDataProp));
  }, [chartType, chartDataProp]);

  const resetData = (data) => {
    const groupedData = {};

    data.forEach((item) => {
      const date = new Date(item["date"]);

      let key;
      if (chartType === "daily") {
        key = date.toISOString().split("T")[0];
      } else if (chartType === "weekly") {
        const startOfWeek = new Date(date);
        startOfWeek.setDate(date.getDate() - date.getDay());
        key = startOfWeek.toISOString().split("T")[0];
      } else if (chartType === "monthly") {
        key = `${date.getFullYear()}-${(date.getMonth() + 1)
          .toString()
          .padStart(2, "0")}`;
      }

      if (!groupedData[key]) {
        groupedData[key] = { date: key, [yKey]: 0 };
      }
      groupedData[key][yKey] += item[yKey];
    });

    return Object.values(groupedData);
  };

  const findMinMax = (data, ticker) => {
    if (data.length < 1) {
      return [0, 0];
    }

    let max = data[0][ticker];
    let min = data[0][ticker]

    for (let i = 0; i < data.length; i++) {
      if (min > data[i][ticker] ) {
        min = data[i][ticker];
      }
      if (max < data[i][ticker]) {
        max = data[i][ticker];
      }
    }

    if(min * -1 > max) {
      max = min * -1
    } else {
      min = max * -1
    }

    return [min, max];
  };

  const getColors = (data) => {
    const colorsArr = [];
    data.forEach((item, i) => {
      if (item[yKey] < 0) {
        colorsArr[i] = "red";
      } else {
        colorsArr[i] = "green";
      }
    });
    return colorsArr
  };

  const data = {
    labels: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь"],
    datasets: [
      {
        data: chartData.map((item, i) => {
          return { x: i, y: item[yKey] };
        }),
        borderWidth: 0,
        // borderColor: getColors(chartData),
        fill: "start",
        pointBackgroundColor: "transparent",
        pointBorderColor: "transparent",
        backgroundColor: getColors(chartData)
      },
    ],
  };

  const [min, max] = findMinMax(chartData, yKey);

  const options = {
    animation: false,
    maintainAspectRatio: false,
    layout: {
      padding: 0,
    },
    plugins: {
      legend: {
        display: false,
      },
      chartAreaBorder: {
        borderColor: "transparent",
        borderWidth: 2,
      },
      tooltip: {
        enabled: events ? true : false,
        yAlign: "bottom",
        callbacks: {
          title: (tooltipData) => {
            return `${chartData[tooltipData[0].dataIndex][
              "ticker"
            ].toUpperCase()} $${chartData[tooltipData[0].dataIndex][
              yKey
            ].toLocaleString("en-US")}`;
          },
          label: (tooltipData) => {
            return `${chartData[tooltipData.dataIndex]["shares"]} Shares ${
              chartData[tooltipData.dataIndex]["cost basis"]
            }`;
          },
          footer: (tooltipData) => {
            const date = new Date(chartData[tooltipData[0].dataIndex]["date"]);
            const month = date.getUTCMonth();
            const day = date.getUTCDate();
            const year = date.getUTCFullYear();

            return `${month}/${day}/${year}`;
          },
        },
        backgroundColor: "#146EB0",
        titleColor: "#fff",
        bodyColor: "#fff",
        labelColor: "#fff",
        titleFont: { weight: "bold" },
        padding: 0,
        cornerRadius: 10,
        borderWidth: "0",
        displayColors: false,
      },
      backgroundTicks: backgroundTicks(),

      customPlugin: {
        activeLineY,
        activeLineYVal,
        chartData,
      },
    },
    onHover: (event, elements, ctx) => {
      const h = ctx.height - 12;

      const y = Math.max(12, Math.min(h, event.y));
      const position = parseFloat(
        (((h - y) / (h - 20)) * (max - min) + min).toFixed(2)
      );

      setActiveLineY(position);
      setActiveLineYVal(position);
    },
    scales: {
      x: {
        min: 1,
        max: chartData.length,
        grid: {
          color: "transparent",
        },
        type: "linear",
        position: "bottom",
        border: {
          display: false,
        },

        maxTicksLimit: 10,
        minTicksLimit: 10,
        ticks: {
          display: false,
        },
      },
      y: {
        min: min,
        max: max,
        grid: {
          color: "#1F4C69",
          tickLength: 0,
        },
        position: "right",
        type: "linear",
        border: {
          dash: [3],
          display: false,
        },
        ticks: {
          color: "#146EB0",
          callback: (value) => {
            return Math.floor(value);
          },
          font: {
            size: 12,
            family: "Proxima nova, sans-serif",
          },
          padding: 10,
        },
      },
    },
  };

  const plugins = [hoverLine(), backgroundTicks()];

  if (events) {
    plugins.push(drawEvents());
  }

  return (
    <Bar
      className="chart"
      ref={chartRef}
      data={data}
      options={options}
      plugins={plugins}
    />
  );
};

export default BarChart;
