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
import { useTableStore } from "../../zustand/store";
import {
  backgroundTicks,
  hoverLine,
  leaveEventPlugin
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
  const [pointEvents, setPointEvents] = useState<number[] | number>([0])
  const chartRef = useRef();

  const [chartData, setChartData] =
    useState(chartDataProp);

  useEffect(() => {
    setChartData(chartDataProp);
  });

  const tradingViewChart = useTableStore(store => store.tradingViewChart)


  useEffect(() => {
    if(events) {
      const colorsArr = []
      const eventsArr = []
      chartDataProp.forEach(item => {
        if(item && item['trade'] != undefined){
          if(item['trade'] == 'Buy'){
            colorsArr.push('green')
          } else if(item['trade'] == 'Sell') {
            colorsArr.push('red')
          }
          eventsArr.push(3)
        } else if(item && item['daily buy sell']){
          if(item['daily buy sell'] > 0){
            colorsArr.push('green')
          } else if(item['daily buy sell'] < 0) {
            colorsArr.push('red')
          }
          eventsArr.push(3)
        } else {
          colorsArr.push('transparent')
          eventsArr.push(0)
        }
      })
      setPointColors(colorsArr)
      setPointEvents(eventsArr)
    } else {
      setPointColors('transparent')
    }
  }, [chartDataProp])


  const data = {

        labels: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь"],
        datasets: [
          {
            label: "Продажи в 2024 году",
            data: chartData.map((item) => {
              return { x: new Date(item['date']).getTime(), y: item[yKey] };
            }),
            borderWidth: 2,
            borderColor: "#146EB0",
            pointRadius: pointEvents,
            pointHitRadius: pointEvents,
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
      
    
  };

  const findMinMaxDay = (data): [number, number] => {  
   if(data[0]) {
    let min: number = new Date(data[0]['date']).getTime();
    let max: number = new Date(data[0]['date']).getTime();

    for (let i = 0; i < data.length; i++) {
      if (max < new Date(data[i]['date']).getTime()) {
        max = new Date(data[i]['date']).getTime();
      }
      if (min > new Date(data[i]['date']).getTime()) {
        min = new Date(data[i]['date']).getTime();
      }
    }
    return [min, max]
   }
   return [0, 0]
  }

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
            if(chartData[tooltipData[0].dataIndex]["ticker"]){
              return `${chartData[tooltipData[0].dataIndex][
                "ticker"
              ].toUpperCase()} $${chartData[tooltipData[0].dataIndex][
                yKey
              ].toLocaleString("en-US")}`;
            } else {
              return `${tradingViewChart} $${chartData[tooltipData[0].dataIndex][
                yKey
              ].toLocaleString("en-US")}`;
            }
            

          },
          label: (tooltipData) => {
            if(chartData[tooltipData.dataIndex]["cost basis"]) {
              return `${chartData[tooltipData.dataIndex]["shares"].toLocaleString('en-US')} Shares $${
                chartData[tooltipData.dataIndex]["cost basis"].toLocaleString('en-US')
              }`;
            } else {
              return `${chartData[tooltipData.dataIndex]["shares"]} Shares $${
                chartData[tooltipData.dataIndex]["price"].toLocaleString('en-US')
              }`;
            }

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
        min: findMinMaxDay(chartData)[0],
        max: findMinMaxDay(chartData)[1],
        grid: {
          color: "transparent",
        },
        type: "linear",
        position: "bottom",
        border: {
          display: false,
        },

        ticks: {
          color: "#146EB0",align: 'inner',
          count: 11,
          callback: (val) => {
            return new Date(val).toLocaleDateString('en-GB', {
                
                month: "short",
                year: "numeric"
            });
          }
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
         dash:  (context) => {
          return context.tick.value === min - max / 100 ? [] : [3]; // Линия на y=50 сплошная, остальные пунктирные
        },
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
          count: 8
        },
      },
    },
  };

  const plugins = [hoverLine(), backgroundTicks(), leaveEventPlugin() ];


 
  return (
    <Line
      className="chart"
      ref={chartRef}
      data={data}
      options={options}
      plugins={plugins}
    />
  );
};


export default LineChart;
