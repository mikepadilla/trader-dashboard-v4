import { useEffect, useRef, useState } from "react";
import useTableStore from "../../zustand/store";

const TradingViewChart = () => {
  const chartContainerRef = useRef(null);
  const [preData, setPreData] = useState('NASDAQ')
  const tradingViewChart = useTableStore(store => store.tradingViewChart)

  useEffect(() => {
    if(
      tradingViewChart == 'NFLX' || tradingViewChart == 'ADBE' || 
      tradingViewChart == 'META' || tradingViewChart == 'MSFT' || 
      tradingViewChart == 'TSLA' || tradingViewChart == 'AAPL' || 
      tradingViewChart == 'AMZN' || tradingViewChart == 'GOOGL' || 
      tradingViewChart == 'NVDA' || tradingViewChart == 'INTC'  
    ) {
      setPreData('NASDAQ')
    } else {
      setPreData('NYSE')
    }
  }, [])

  useEffect(() => {
    if(chartContainerRef.current) chartContainerRef.current.innerHTML = ''
    if (chartContainerRef.current && !chartContainerRef.current.firstChild) {
      new window.TradingView.widget({
        container_id: chartContainerRef.current.id,

        "autosize": true,
        height: 500,
        symbol: `${preData}:${tradingViewChart}`,
        interval: "D",
        timezone: "Etc/UTC",
        theme: "dark",
        style: "1",
        locale: "en",
        toolbar_bg: "#f1f3f6",
      });
    }
  }, [tradingViewChart, preData]);

  return <div id="tradingview_chart" ref={chartContainerRef}></div>;
};

export default TradingViewChart;