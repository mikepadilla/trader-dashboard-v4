import { useEffect, useRef } from "react";

const TradingViewChart = () => {
  const chartContainerRef = useRef(null);

  useEffect(() => {
    if (chartContainerRef.current && !chartContainerRef.current.firstChild) {
      new window.TradingView.widget({
        container_id: chartContainerRef.current.id,

        "autosize": true,
        height: 500,
        symbol: "NASDAQ:AAPL",
        interval: "D",
        timezone: "Etc/UTC",
        theme: "dark",
        style: "1",
        locale: "en",
        toolbar_bg: "#f1f3f6",
      });
    }
  }, []);

  return <div id="tradingview_chart" ref={chartContainerRef}></div>;
};

export default TradingViewChart;