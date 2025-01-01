import { ChartOptions } from "chart.js"

export type tableType = IPortfolioSnapshot[] | IRealizedPL[] | IUnrealizedPL[] | ITrumpMovers[]
export type chartType = IPortfolioValueChartData[] | ITickerChartData[] | IBasisChartData[]
export type chartItemType = IPortfolioValueChartData | ITickerChartData | IBasisChartData
export type chartY =  'total' | 'balance'  | 'total performance'  | 'total cost basis'


export type IInitialChartData = {
	chartData: IPortfolioValueChartData[] | ITickerChartData[],
	basisChartData: IBasisChartData[]
}


interface ICustomPlugin{
  plugins: {
    customPlugin: {
      activeLineY: number | null
      activeLineYVal: number | null
      chartData: chartType
    },
  }
}


export type NewChartOptionLine = ICustomPlugin & ChartOptions<'line'>
export type NewChartOptionBar = ICustomPlugin & ChartOptions<'bar'>

export interface IPortfolioSnapshot {
	Ticker: string,
	Last: number,
	Position: number,
	'Daily P&L': number,
	'Unrealized P&L': number
	'Change%': number,
	'Mkt Value': number,
}

export interface IRealizedPL {
	Ticker: string,
	Shares: number
	'Realized P&L': number,
	'Avg Cost per Share': number,
	'Total Cost Basis': number,
	'Total Sold Value': number,
}

export interface IUnrealizedPL {
	Ticker: string,
	Shares: number
	'Unrealized P&L': number,
	'Avg Cost per Share': number,
	'Total Cost Basis': number,
	'Current Value': number,
}

export interface ITrumpMovers {
	TICKER: string,
	PRICE: number
	'COMPANY NAME': string,
	'MARKET CAP': number,
	'P/E RATIO': string,
	'CHANGE %': number,
}


export interface ITopTableData {
	'Portfolio Snapshot'?: IPortfolioSnapshot[],
	'Realized P&L'?: IRealizedPL[],
	'Unrealized P&L'?: IUnrealizedPL[],
}

export interface IBottomTableData {
	'Trump Movers'?: ITrumpMovers[],
	'Healthcare Tech'?: ITrumpMovers[],
	'AI Bets'?: ITrumpMovers[]
}



export interface ITickerChartData {
	'date': Date,
	'price': number,
	'share': number,
	'balance':  number,
	'total cost basis': number,
	'total performance': number,
	'daily buy sell': number,
	'daily performance': number
}

export interface IPortfolioValueChartData {
	'date': Date,
	'nvda': number,
	'msft': number,
	'meta': number,
	'amzn': number,
	'googl': number,
	'nflx': number,
	'intc': number,
	'adbe': number,
	'aapl': number,
	'tsla': number,
	'total': number,
	'total cost basis': number,
	'total performance': number,
	'daily buy sell': number,
	'daily performance': number,
}

export interface IBasisChartData {
	'date': Date,
	'shares': number,
	'ticker':  string,
	'trade':  string,
	'share amount': number,
	'cost basis': number,
	'total cost basis': number,
}

export interface INewsArticle{
	description: string,
	favicon_url: string,
	id: string,
	site: string,
	tags: string[],
	tickers: string[],
	time: number,
	title: string,
	url: string
}

export interface INewsArticles {
	last_id: string
	stories: INewsArticle[]
}

export interface INewsSummary {
	summary: string
}


export type chartDataType = ITickerChartData[] | IPortfolioValueChartData[] | undefined

export interface INews {
	articlesLoading: boolean,
	articlesNews: INewsArticles,
	summaryLoading: boolean,
	summaryNews: INewsSummary
}