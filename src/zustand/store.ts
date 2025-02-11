
import { create } from 'zustand'
import { combine, devtools } from 'zustand/middleware'


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
	descriptors: string,
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

interface IInitialData {
	topTableData: ITopTableData,
	bottomTableData: IBottomTableData,
	activeTableRow: string,

}

const initialData: IInitialData = {
	topTableData: {},
	bottomTableData: {},
	activeTableRow: 'top-portfolio',
}

const getTableUrl = 'https://script.google.com/macros/s/AKfycbxUh0f8wIouxgvOcGK3SyDy_Rcn3Bto0DZ2LblH0pkAWQvuxg8E0DypPoqRM6gHwNN8Dw/exec?sheets='


export const useTableStore = create(
	devtools(combine(initialData, (set) => {
		return {
			setTopTableData: async (url: string) => {
				fetch(getTableUrl + encodeURIComponent(url)).then(res => {
					if(!res.ok) throw new Error('Failed to fetch chart! Try again');
					return res.json()
				}).then(data => {
					set(() => ({topTableData: data}))
				})
			},
			setBottomTableData: (url: string) => {
				fetch(getTableUrl + encodeURIComponent(url)).then(res => {
					if(!res.ok) throw new Error('Failed to fetch chart! Try again');
					return res.json()
				}).then(data => {
					set(() => ({bottomTableData: data}))
				})
			},
			setActiveTableRow: (text: string)  => {
				set(() => ({
					activeTableRow: text
				}))
			},
		}
	})),
)
