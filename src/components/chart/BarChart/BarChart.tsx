import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";

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

import { useChartStore } from "../../../zustand/chartStore";
import { backgroundTicks, drawZeroLine, hoverLine, leaveEventPlugin } from "../customChartPlugins";
import "../style.css";
import { data } from "./chartData";
import { options } from "./chartOptions";

const BarChart = ({ chartDataProp, yKey, events }) => {
  const [activeLineY, setActiveLineY] = useState(null);
  const [activeLineYVal, setActiveLineYVal] = useState(null);
  const [chartData, setChartData] = useState(chartDataProp);


  const tradingViewChart = useChartStore((store) => store.tradingViewChart);
  const basisChartData = useChartStore((store) => store.basisChartData);
  

  const chartType = useChartStore((state) => state.chartType);
  const chartRef = useRef();
  
  useEffect(() => {
    findMinMax(chartData, yKey);
  }, []);

  useEffect(() => {
    setChartData(resetData(chartDataProp));
  }, [chartType, chartDataProp]);

    useEffect(() => {
      if(events) {
        const eventsArr = []
        chartDataProp.forEach(item => {
          if(item && item['trade'] != undefined){
            eventsArr.push(3)
          } else if(item && item['daily buy sell']){
            eventsArr.push(3)
          } else {
            eventsArr.push(0)
          }
        })
        if(chartDataProp.length > 0 && !chartDataProp[0]['share amount']){
          eventsArr.shift()
        }
      } 
    }, [chartDataProp])

  const resetData = (data, ticker = yKey) => {
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
        groupedData[key] = { ...item, date: key, [ticker]: 0 };
      }
      groupedData[key][ticker] += item[ticker] ? item[ticker] : 0;

    });

    return Object.values(groupedData);
  };


  const restoreBasisData = (data) => {
    const groupedData = {};
    data.forEach((item) => {
      const date = new Date(item["date"]);

      const key = date.toISOString().split("T")[0];

      if (!groupedData[key]) {
        groupedData[key] = { ...item};
      }
      for(const objKey in item) { 
        if(typeof item[objKey] == 'number'){
          groupedData[key][objKey] += item[objKey] ? item[objKey] : 0;
        } else {
          groupedData[key][objKey] = item[objKey] ? item[objKey] : 0;
        }
      }
      

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

    return [min, max];
  };

  const [min, max] = findMinMax(chartData, yKey);
  const plugins = [hoverLine(), backgroundTicks(), leaveEventPlugin(), drawZeroLine];


  return (
    <Bar
      className="chart"
      ref={chartRef}
      data={data(chartData, yKey)}
      options={options(events, chartData, min, max, activeLineY, setActiveLineY, activeLineYVal, setActiveLineYVal, tradingViewChart, restoreBasisData(basisChartData), yKey)}
      plugins={plugins}
    />
  );
};

export default BarChart;
