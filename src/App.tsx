import Header from "./components/header/Header";
import Tab from "./components/tab/Tab";

import { useEffect, useState } from "react";
import "./App.css";
import ContentRight from "./components/contentRight/ContentRight";
import Footer from "./components/footer/Footer";
import LeftButtons from "./components/leftButtons/leftButtons";
import Table from "./components/table/Table.js";
import TableSkeleton from "./components/tableSkeleton/TableSkeleton";
import { useTableStore } from "./zustand/store";

interface ITabData {
  title: string;
  content: JSX.Element;
}

function App() {

  const topTableData = useTableStore((state) => state.topTableData);
  const setTopTableData = useTableStore((state) => state.setTopTableData);
  
  const bottomTableData = useTableStore((state) => state.bottomTableData);
  const setBottomTableData = useTableStore((state) => state.setBottomTableData);


  useEffect(() => {
    setTopTableData('Portfolio Snapshot,Unrealized P&L,Realized P&L');
    setBottomTableData('Watchlists');
  }, []);

  const [topTabData, setTopTabData] = useState<ITabData[]>([]);
  const [bottomTabData, setBottomTabBottom] = useState<ITabData[]>([]);

  useEffect(() => {
    setTopTableProps();
  }, [topTableData]);

  useEffect(() => {
    setBottomTableProps();
  }, [bottomTableData]);



  const setTopTableProps = () => {
    const newArr: ITabData[] = [];
    if(topTableData !== undefined){
    (Object.keys(topTableData) as Array<keyof typeof topTableData>).forEach((key) => {
      newArr.push({
        title: key,
        content: <Table key={key} tableData={topTableData[key]} tableId={'top'}/>,
      });
    });}

    setTopTabData(newArr);
  };

  const setBottomTableProps = () => {
    const newArr: ITabData[] = [];
    if(bottomTableData !== undefined){
    Object.keys(bottomTableData).forEach((key) => {
      newArr.push({
        title: key,
        content: <Table key={key} tableData={bottomTableData[key]} tableId={'bottom'}/>,
      });
    });
    setBottomTabBottom(newArr);}
  };

  



  return (
    <div className="app">
      <Header />

      <main>
        <div className="app__body">
          <div className="left">
          <div className="cash__tab">
          {topTabData.length < 1 ? (
              <TableSkeleton />
            ) : (
              <Tab tabData={topTabData} />
            )}
          </div>

            <div className="trump__tab">
              {bottomTabData.length < 1 ? (
                <TableSkeleton />
              ) : (
                <Tab tabData={bottomTabData} />
              )}
            </div>

            <LeftButtons />
          </div>
          <ContentRight/>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;
