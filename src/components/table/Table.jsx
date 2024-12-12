import { useState } from "react";
import {
  getArticlesNews,
  getMarketChartData,
  getNews,
  getPortfolioNews,
} from "../../api/getTableData";
import useTableStore from "../../zustand/store";
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
    setNewsSummary,
    setNewsArticles,
    setNewsArticlesLoading,
    setNewsPortfolioLoading,
    setActiveChart,
  } = useTableStore();

  const setChartData = (title) => {
    getMarketChartData(title).then((res) => {
      setMarketChartData(res);
      setPerformanceChartData(res);
    });
  };

  const [sortConfig, setSortConfig] = useState({
    key: Object.keys(tableData[0])[2],
    direction: "asc",
  });

  const onTableRowClick = (
    item,
    index
  ) => {
    if (isTopTable(item)) {
      setChartData(item.Ticker);
      setNews(item.Ticker);
    } else {
      setNews(item.TICKER);
    }

    console.log(isTopTable(item))

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
					return direction === "asc" ? a[key] - b[key] : b[key] - a[key];
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
    setNewsArticlesLoading(true);
    setNewsPortfolioLoading(true);
    getNews(ticker).then((res) => {
      setNewsSummary(res);
      setNewsPortfolioLoading(false);
    });
    getArticlesNews(ticker).then((res) => {
      setNewsArticles(res);
      setNewsArticlesLoading(false);
    });
  };

  const setPortfolioNews = () => {
    setChartData("Portfolio Value");
    getPortfolioNews().then((res) => {
      setNewsSummary(res);
    });
    getArticlesNews("NVDA").then((res) => {
      setNewsArticles(res);
    });
  };

  const getBackgroundColor = (
    value,
    maxPositive,
    minNegative
  ) => {
    const opacity = calculateOpacity(value, maxPositive, minNegative);
    if (value > 0) {
      return `rgba(0, 255, 0, ${opacity})`;
    } else if (value < 0) {
      return `rgba(255, 0, 0, ${opacity})`;
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
          }}
          className={activeTableRow == "top-portfolio" ? "row_active" : ""}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {data[0].Ticker == "My Portfolio"
            ? data.length &&
              Object.keys(data[0]).map((header) => (
                <th key={header}>
                  {typeof data[0][header] == "number"
                    ? data[0][header].toFixed(2)
                    : data[0][header]}
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
                    ...data.map((item) =>
                      item[sortConfig.key] > 0 ? item[sortConfig.key] : 0
                    )
                  ),
                  Math.min(
                    ...data.map((item) =>
                      item[sortConfig.key] < 0 ? item[sortConfig.key] : 0
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
                  {typeof value == "number" ? value.toFixed(2) : value}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
      <tfoot>
        <tr>
          {data[data.length - 1].Ticker == "CASH"
            ? data.length &&
              Object.keys(data[data.length - 1]).map((header) => (
                <td key={header}>{data[data.length - 1][header]}</td>
              ))
            : null}
        </tr>
      </tfoot>
    </table>
  );
};

export default Table;
