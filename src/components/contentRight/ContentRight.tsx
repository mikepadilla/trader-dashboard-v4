import { useEffect } from "react";
import { useChartStore } from "../../zustand/chartStore.js";
import { useTableStore } from "../../zustand/store";
import BarChart from "../chart/BarChart/BarChart.js";
import LineChart from "../chart/LineChart/LineChart.js";
import TradingViewChart from "../chart/TradingViewChart.js";
import ChartTab from "../ChartTab/ChartTab";
import News from "../news/News.js";
import RightHeader from "../rightHeader/RightHeader";

const ContentRight = () => {

	const activeTableRow = useTableStore((state) => state.activeTableRow);
	
  const chartData = useChartStore((state) => state.chartData);
  const setChartData = useChartStore((state) => state.setChartData);
  const basisChartData = useChartStore((state) => state.basisChartData);
  const setBasisChartData = useChartStore((state) => state.setBasisChartData);
  const chartType = useChartStore((state) => state.chartType);
  

	const findMinMax = (data, ticker: string) => {
		if(data != undefined){
    if ( data.length < 1) {
      return [0, 0];
    }

		let min = data[0][ticker];
		let max = data[0][ticker];


    for (let i = 0; i < data.length; i++) {
      if (min > data[i][ticker]) {
        min = data[i][ticker];
      }
      if (max < data[i][ticker]) {
        max = data[i][ticker];
      }
    }

    return [min, max];}
  };



	const getChartData = () => {
    setChartData("Portfolio Value")
    setBasisChartData('Transactions')
  };

	useEffect(() => {
    getChartData();
  }, []);


  return (
    <div className="content">
      <RightHeader />
      <div className="" style={{ aspectRatio: "2.5/1", width: "100%" }}>
        <ChartTab
          tabData={[
            {
              title: "Market Value",
              content:
                  <LineChart
                    min={chartData != undefined ? findMinMax(chartData, activeTableRow == 'top-portfolio'? 'total' : "balance")[0] : 0}
                    max={chartData != undefined ? findMinMax(chartData, activeTableRow == 'top-portfolio'? 'total' : "balance")[1] : 10}
                    chartDataProp={chartData}
                    yKey={activeTableRow == 'top-portfolio'? 'total' : "balance"}
										events={false}
                  />
            },
            {
              title: "Performance",
              content:
                chartType == "cumulative" ? (
                  <LineChart
                    min={
                      chartData != undefined ? findMinMax(chartData, "total performance")[0] : 0
                    }
                    max={
                      chartData != undefined ? findMinMax(chartData, "total performance")[1] : 10
                    }
                    chartDataProp={chartData}
                    yKey={"total performance"}
										events={false}
                  />
                ) : (
                  <BarChart
                    chartDataProp={chartData}
                    yKey={"daily performance"}
										events={false}
                  />
                ),
            },
            {
              title: "Cost Basis",
              content:chartType == "cumulative" ? (
                <LineChart
                min={basisChartData != undefined ? findMinMax(basisChartData, "total cost basis")[0] : 0}
                max={basisChartData != undefined ? findMinMax(basisChartData, "total cost basis")[1] : 10}
                chartDataProp={basisChartData}
                yKey={"total cost basis"}
                events={true}
              />
              ) : (
                <BarChart
                  chartDataProp={chartData}
                  yKey={"daily buy sell"}
                  events={true}
                />
              ),
                
              
                
            },
            {
              title: "Quote Detail",
              content: <TradingViewChart />,
            },
          ]}
        />
      </div>
      <News />
      <div className=""></div>
    </div>
  );
};

export default ContentRight;
