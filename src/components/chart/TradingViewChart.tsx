import { memo, useEffect, useRef, useState } from 'react';
import { useTableStore } from '../../zustand/store';

function TradingViewChart() {
  const container = useRef(null);

  const [preData, setPreData] = useState('NASDAQ')
  const tradingViewChart = useTableStore(store => store.tradingViewChart)

  useEffect(() => {
    if(
      tradingViewChart == 'NFLX' || tradingViewChart == 'ADBE' || 
      tradingViewChart == 'META' || tradingViewChart == 'MSFT' || 
      tradingViewChart == 'TSLA' || tradingViewChart == 'AAPL' || 
      tradingViewChart == 'AMZN' || tradingViewChart == 'GOOGL' || 
      tradingViewChart == 'NVDA' || tradingViewChart == 'INTC' ||
      tradingViewChart == 'DJT' || tradingViewChart == 'AVGO' 
    ) {
      setPreData('NASDAQ')
    } else {
      setPreData('NYSE')
    }
  }, [tradingViewChart])

  useEffect(
    () => {
      if(container.current){
          container.current.innerHTML = ''
      }
      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = JSON.stringify({
        "autosize": true,
        symbol: `${preData}:${tradingViewChart}`,
        "interval": "D",
        "timezone": "Etc/UTC",
        "theme": "dark",
        "style": "1",
        "locale": "en",
        "allow_symbol_change": true,
        "calendar": false,
        "support_host": "https://www.tradingview.com"
      });
        if(container.current) {
          container.current.appendChild(script);
        }
      
    },
    [tradingViewChart, preData]
  );

  return (
    <div className="tradingview-widget-container" ref={container} style={{ height: "100%", width: "100%" }}>
      <div className="tradingview-widget-container__widget" style={{ height: "calc(100% - 32px)", width: "100%" }}></div>
      <div className="tradingview-widget-copyright"><a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank"><span className="blue-text">Track all markets on TradingView</span></a></div>
    </div>
  );
}

export default memo(TradingViewChart);
