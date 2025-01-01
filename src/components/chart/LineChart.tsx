import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip
} from "chart.js";
import { useEffect, useRef, useState } from "react";
import { Line } from "react-chartjs-2";

import { NewChartOptionLine } from "../../types/types";
import {
  backgroundTicks,
  hoverLine
} from "./customChartPlugins";
import "./style.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler            
);


const LineChart = ({ min, max, chartDataProp, yKey, events }) => {
  const [activeLineY, setActiveLineY] = useState(null);
  const [activeLineYVal, setActiveLineYVal] = useState(null);
  const [pointColors, setPointColors] = useState<string[] | string>(['transparent'])
  const chartRef = useRef();

  const [chartData, setChartData] =
    useState(chartDataProp);

  useEffect(() => {
    setChartData(chartDataProp);
  });


  useEffect(() => {
    if(events) {
      const colorsArr = []
      chartDataProp.forEach(item => {
        if(item && item['trade'] != undefined){
          if(item['trade'] == 'Buy'){
            colorsArr.push('green')
          } else if(item['trade'] == 'Sell') {
            colorsArr.push('red')
          }
        }
      })
      setPointColors(colorsArr)
    } else {
      setPointColors('transparent')
    }
  }, [chartDataProp])

  const data = () => {

      return {
        labels: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь"],
        datasets: [
          {
            label: "Продажи в 2024 году",
            data: chartData.map((item, i) => {
              return { x: i, y: item[yKey] };
            }),
            borderWidth: 2,
            borderColor: "#146EB0",
            pointBackgroundColor: pointColors,
            pointBorderColor: "transparent",                                    
            fill: 'start',
            backgroundColor: (context) => {
              const ctx = context.chart.ctx
              const gradientFill = ctx.createLinearGradient(
                0,
                0,
                0,
                ctx.canvas.height / 1.5
              );
              gradientFill.addColorStop(0, "#5998F533");
              gradientFill.addColorStop(1, "#ffffff00");
  
              return gradientFill;
            }
          },
        ]
      }
    
  };

  const options: NewChartOptionLine = {
    animation: false,
    layout: {
      padding: 0,
    },
    plugins: {
      legend: {
        display: false,
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
        titleFont: { weight: "bold" },
        padding: 10,
        cornerRadius: 10,
        borderWidth: 0,
        displayColors: false,
      },

      customPlugin: {
        activeLineY,
        activeLineYVal,
        chartData,
      },
    },
    onHover: (event, _, ctx) => {
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

        ticks: {
          display: false,
        },
      },
      y: {
        min: min - max / 100,
        max: max + max / 100,
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
          callback: (value: number) => {
            return Math.floor(value).toLocaleString('en-US');
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

  const plugins = [hoverLine(), backgroundTicks() ];


  return (
    <Line
      className="chart"
      ref={chartRef}
      data={data()}
      options={options}
      plugins={plugins}
    />
  );
};


export default LineChart;
