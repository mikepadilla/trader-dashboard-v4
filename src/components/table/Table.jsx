import { useEffect, useState } from "react";
import {
  getMarketChartData
} from "../../api/getTableData";
import { useNewsStore, useTableStore } from "../../zustand/store";
import "./style.css";


function isTopTable(
  obj
) {
  return "Ticker" in obj;
}

const Table = ({ tableData, tableId }) => {
  const [data, setData] = useState(tableData);
  const {
    setMarketChartData,
    setPerformanceChartData,
    activeTableRow,
    setActiveTableRow,
    setActiveChart,
    setTradingViewChart,
    setBasisChartData,
  } = useTableStore();

  const setArticlesNews = useNewsStore(store => store.setArticlesNews)
  const setSummaryNews = useNewsStore(store => store.setSummaryNews)
  const setSummaryPortfolioNews = useNewsStore(store => store.setSummaryPortfolioNews)

  const setChartData = (title) => {
    getMarketChartData(title).then((res) => {
      setMarketChartData(res);
      setPerformanceChartData(res);
    });
  };

  const [sortConfig, setSortConfig] = useState({
    key: Object.keys(tableData[0])[0],
    direction: "desc",
  });

 useEffect(() => {
  if(tableData[0]['Change%'] == '' || tableData[0]['Change%']) {
    
    setSortConfig({
      key: 'Change%',
      direction: "desc",
    })
    sortData('Change%')
  }
  if(tableData[0]['CHANGE %'] == '' || tableData[0]['CHANGE %']) {
    setSortConfig({
      key: 'CHANGE %',
      direction: "desc",
    })
    sortData('CHANGE %')
  }
  if(
    !(tableData[0]['Change%'] == '' || tableData[0]['Change%']) && 
    !(tableData[0]['CHANGE %'] == '' || tableData[0]['CHANGE %'])
  ) {
    setSortConfig({
      key: Object.keys(tableData[0])[2],
      direction: "desc",
    })
    sortData(Object.keys(tableData[0])[2])
  }
 }, [])


  const onTableRowClick = (
    item,
    index
  ) => {
    if (isTopTable(item)) {
      setChartData(item.Ticker);
      setTradingViewChart(item.Ticker)
      setNews(item.Ticker);
      getMarketChartData(item.Ticker).then(res => {
        setBasisChartData(res)
      })
    } else {
      setNews(item.TICKER);
      setTradingViewChart(item.TICKER)
    }

    setActiveTableRow(`${tableId}-${index}`);
    if (tableId == "top") {
      setActiveChart(1);
    } else {
      setActiveChart(3);
    }
  };

  const sortData = (
    key
  ) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";

			const sortedData = [...data].sort((a, b) => {
				if (typeof a[key] === "number" && typeof b[key] === "number") {
					return direction === "desc" ? a[key] - b[key] : b[key] - a[key];
				} else {
					const aKey = a[key].toString().toLowerCase();
					const bKey = b[key].toString().toLowerCase();
					if (aKey < bKey) return direction === "asc" ? -1 : 1;
					if (aKey > bKey) return direction === "asc" ? 1 : -1;
					return 0;
				}
			});

    setData(sortedData);
    setSortConfig({ key, direction });
  };
  


  const calculateOpacity = (value, max, min) => {
    if (value > 0) {
      return 0.1 + (0.9 * value) / max;
    } else if (value < 0) {
      return 0.1 + (0.9 * Math.abs(value)) / Math.abs(min);
    }
    return 0;
  };
  const handleMouseEnter = (event) => {
    const block = event.currentTarget;

    if (!block.querySelector(".hover-overlay")) {
      const overlay = document.createElement("div");
      overlay.classList.add("hover-overlay");
      overlay.style.display = "flex";
      const button = document.createElement("button");
      button.textContent = "Trade";
      overlay.appendChild(button);
      block.appendChild(overlay);
    }
  };

  const handleMouseLeave = (event) => {
    const block = event.currentTarget;

    const element = block.querySelector(".hover-overlay");
    if (element) {
      block.removeChild(element);
    }
  };

  const setNews = (ticker) => {
    setSummaryNews(ticker)
    setArticlesNews(ticker)
  };

  const setPortfolioNews = () => {
    setChartData("Portfolio Value");
    getMarketChartData('Transactions').then(res => {
      setBasisChartData(res)
    })

    setSummaryPortfolioNews();
    setArticlesNews('nvda');
  };

  const getBackgroundColor = (
    value,
    maxPositive,
    minNegative
  ) => {
    const opacity = calculateOpacity(value, maxPositive, minNegative);
    if (value > 0) {
      return `rgba(1, 135, 64, ${opacity})`;
    } else if (value < 0) {
      return `rgba(216, 14, 31, ${opacity})`;
    }
    return "transparent";
  };
  return (
    <table className="table">
      <thead>
        <tr>
          {data.length > 0 &&
            Object.keys(data[0]).map((header) => (
              <th
                key={header}
                onClick={() => {
                  sortData(header);
                }}
              >
                {header}
              </th>
            ))}
        </tr>
        <tr
          onClick={() => {
            setActiveTableRow(`top-portfolio`);
            setPortfolioNews();
            setActiveChart(0)
          }}
          className={activeTableRow == "top-portfolio" ? "row_active" : ""}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {tableData[0].Ticker == "My Portfolio"
            ? tableData.length &&
              Object.keys(tableData[0]).map((header) => (
                <th key={header}>
                  {typeof tableData[0][header] == "number"
                    ? parseFloat(tableData[0][header].toFixed(2)).toLocaleString('en-US')
                    : tableData[0][header]}
                </th>
              ))
            : null}
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => {
          if (item.Ticker == "My Portfolio" || item.Ticker == "CASH") return "";
          return (
            <tr
              className={
                activeTableRow == `${tableId}-${index}` ? "row_active" : ""
              }
              key={index}
              style={{
                background: getBackgroundColor(
                  item[sortConfig.key],
                  Math.max(
                    ...data.map((item) =>{
                      if(item["Ticker"] != 'My Portfolio') {
                        return item[sortConfig.key] 
                      } else {
                        return 0
                      }
                    }
                    )
                  ),
                  Math.min(
                    ...data.map((item) =>{
                      if(item["Ticker"] != 'My Portfolio') {
                        return item[sortConfig.key] 
                      } else {
                        return 0
                      }
                        
                      
                      }
                    )
                  )
                ),
              }}
              onClick={() => {
                onTableRowClick(item, index);
              }}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {Object.values(item).map((value, i) => (
                <td key={i}>
                  {typeof value == "number" ? parseFloat(value.toFixed(2)).toLocaleString("en-US") : value}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
      <tfoot>
        <tr>
          {tableData[tableData.length - 1].Ticker == "CASH"
            ? tableData.length &&
              Object.keys(tableData[tableData.length - 1]).map((header) => (
                <td key={header}>{tableData[tableData.length - 1][header].toLocaleString("en-US")}</td>
              ))
            : null}
        </tr>
      </tfoot>
    </table>
  );
};

export default Table;
