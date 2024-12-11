import { create } from 'zustand'
import { combine } from 'zustand/middleware'


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


interface ITopTableData {
	'Portfolio Snapshot'?: IPortfolioSnapshot[],
	'Realized P&L'?: IRealizedPL[],
	'Unrealized P&L'?: IUnrealizedPL[],
}

interface IBottomTableData {
	'Trump Movers'?: ITrumpMovers[],
	'Healthcare Tech'?: ITrumpMovers[],
	'AI Bets'?: ITrumpMovers[]
}


interface IInitialData {
	topTableData: ITopTableData,
	bottomTableData: IBottomTableData
}

const initialData = {
	topTableData: {},
	bottomTableData: {},
	marketChartData: [],
	performanceChartData: [],
	basisChartData: [],
	newsSummary: {},
	newsArticles: {},
	chartType: 'cumulative',
	activeTableRow: 'top-portfolio',
	newsArticlesLoading: false,
	newsPortfolioLoading: false,
	activeChart: 0
}


const useTableStore = create(
	combine(initialData, (set) => {
		return {
			setTopTableData: (newTableData: ITopTableData) => {
				set(() => ({
					topTableData: newTableData
				}))
			},
			setBottomTableData: (newTableData: IBottomTableData) => {
				set(() => ({
					bottomTableData: newTableData
				}))
			},
			setMarketChartData: (newChartData) => {
				set(() => ({
					marketChartData: newChartData == undefined ? [] : newChartData
				}))
			},
			setPerformanceChartData: (newChartData) => {
				set(() => ({
					performanceChartData: newChartData == undefined ? [] : newChartData
				}))
			},
			setBasisChartData: (newChartData) => {
				set(() => ({
					basisChartData: newChartData == undefined ? [] : newChartData
				}))
			},
			setNewsSummary: (newNews) => {
				set(() => ({
					newsSummary: newNews
				}))
			},
			setNewsArticles: (newNews) => {
				set(() => ({
					newsArticles: newNews
				}))
			},
			setChartType: (newType) => {
				set(() => ({
					chartType: newType
				}))
			},
			setActiveTableRow: (text)  => {
				set(() => ({
					activeTableRow: text
				}))
			},
			setNewsArticlesLoading: (loading) => {
				set(() => ({
					newsArticlesLoading: loading
				}))
			},
			setNewsPortfolioLoading: (loading) => {
				set(() => ({
					newsPortfolioLoading: loading
				}))
			},
			setActiveChart: (activeChart) => {
				set(() => ({
					activeChart
				}))
			}
		}
	}),
)


export default useTableStore