import { FC, useState } from "react";
import useTableStore from "../../zustand/store";
import "./style.css";
interface ITabData {
  title: string;
  content: JSX.Element;
}

interface rightTabProps {
  tabData: ITabData[];
}

const ChartTab: FC<rightTabProps> = ({ tabData }) => {
  const { chartType, setChartType, activeChart } =
    useTableStore();

  const [activeTabIndex, setActiveTabIndex] = useState<number>(0);
  const [isPeriodActive, setIsPeriodActive] = useState(true);

  return (
    <div className="tab">
      <div className="tab__buttons">
        {activeChart == 3 ? (
          <button className="tab__button tab__button_active" >
            {tabData[3].title}
          </button>
        ) : (
          tabData.map((item, i) => {
            if (activeTabIndex == i) {
              return (
                <button className="tab__button tab__button_active" key={i}>
                  {item.title}
                </button>
              );
            }
            if (i == 3 || i == 2) {
              return (
                <button
                  className="tab__button"
                  key={i}
                  onClick={() => {
                    setIsPeriodActive(false);
                    setChartType('cumulative')
                    setActiveTabIndex(i);
                  }}
                >
                  {item.title}
                </button>
              );
            }

            return (
              <button
                className="tab__button"
                key={i}
                onClick={() => {
                  setIsPeriodActive(true);
                  setActiveTabIndex(i);
                }}
              >
                {item.title}
              </button>
            );
          })
        )}
        {isPeriodActive ? (
          <div className="select__chart-period">
            <button
              className={`period__button ${
                chartType == "cumulative" ? "period__button_active" : ""
              }`}
              onClick={() => setChartType("cumulative")}
            >
              Cumulative
            </button>
            <button
              className={`period__button ${
                chartType == "daily" ? "period__button_active" : ""
              }`}
              onClick={() => setChartType("daily")}
            >
              Daily
            </button>
            <button
              className={`period__button ${
                chartType == "weekly" ? "period__button_active" : ""
              }`}
              onClick={() => setChartType("weekly")}
            >
              Weekly
            </button>
            <button
              className={`period__button ${
                chartType == "monthly" ? "period__button_active" : ""
              }`}
              onClick={() => setChartType("monthly")}
            >
              Monthly
            </button>
          </div>
        ) : null}
      </div>
      <div className="tab__contents">
        {activeChart == 3? (              <div
                className="tab__content chart__tab-content tab__content_active"

              >
                {tabData[3].content}
              </div>) :tabData.map((item, i) => {
          if (activeTabIndex == i) {
            return (
              <div
                className="tab__content chart__tab-content tab__content_active"
                key={i}
              >
                {item.content}
              </div>
            );
          }
          return (
            <div className="tab__content" key={i}>
              {item.content}
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default ChartTab;
