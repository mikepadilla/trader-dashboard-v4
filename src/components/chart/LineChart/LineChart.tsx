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
import { useChartStore } from "../../../zustand/chartStore";
import {
  backgroundTicks,
  DrawColorsLine,
  drawZeroLine,
  hoverLine,
  leaveEventPlugin
} from "../customChartPlugins";
import "../style.css";
import { data } from "./chartData";
import { options } from "./chartOptions";

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

  const [chartData, setChartData] = useState(chartDataProp);



  useEffect(() => {
    setChartData(chartDataProp);
  });

  const tradingViewChart = useChartStore(store => store.tradingViewChart)
  const isBasisActive = useChartStore(store => store.isBasisActive)

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
      if(chartDataProp.length > 0 && !chartDataProp[0]['share amount']){
        colorsArr.shift()
        eventsArr.shift()
      }
      setPointColors(colorsArr)
      setPointEvents(eventsArr)
    } else {
      setPointColors('transparent')
    }
  }, [chartDataProp])

  const plugins = [
    hoverLine(),
    backgroundTicks(),
    leaveEventPlugin(),
    drawZeroLine,
    DrawColorsLine,
  ];
 
  return (
    <Line
      className="chart"
      ref={chartRef}
      data={data(chartData, yKey, pointEvents, pointColors)}
      options={options(events, chartData, tradingViewChart, activeLineY, setActiveLineY, activeLineYVal, setActiveLineYVal, min, max, isBasisActive)}
      plugins={plugins}
    />
  );
};


export default LineChart;
