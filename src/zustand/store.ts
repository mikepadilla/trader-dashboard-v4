
import { create } from 'zustand'
import { combine, devtools } from 'zustand/middleware'
import { IInitialChartData, INews } from '../types/types'


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
	marketChartData: chartDataType,
	tradingViewChart: string,
	performanceChartData: chartDataType,
	basisChartData: IBasisChartData[] | undefined,
	newsSummary: INewsSummary,
	newsArticles: INewsArticles,
	chartType: string,
	activeTableRow: string,
	newsArticlesLoading: boolean,
	newsPortfolioLoading: boolean,
	activeChart: number

}

const initialData: IInitialData = {
	topTableData: {},
	bottomTableData: {},
	marketChartData: [],
	tradingViewChart: 'ADBE',
	performanceChartData: [],
	basisChartData: [],
	newsSummary: {
		summary: ''
	},
	newsArticles: {
		last_id: '',
		stories: [
			{
				descriptors: '',
				favicon_url: '',
				id: '',
				site: '',
				tags: [''],
				tickers: [''],
				time: 0,
				title: '',
				url: ''
			}
		]
	},
	chartType: 'cumulative',
	activeTableRow: 'top-portfolio',
	newsArticlesLoading: false,
	newsPortfolioLoading: false,
	activeChart: 0
}


export const useTableStore = create(
	devtools(combine(initialData, (set) => {
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
			setMarketChartData: (newChartData: chartDataType) => {
				set(() => ({
					marketChartData: newChartData
				}))
			},
			setTradingViewChart: (newChart: string) => {
				set(() => ({
					tradingViewChart: newChart
				}))
			},
			setPerformanceChartData: (newChartData: chartDataType) => {
				set(() => ({
					performanceChartData: newChartData
				}))
			},
			setBasisChartData: (newChartData: IBasisChartData[] | undefined) => {
				set(() => ({
					basisChartData: newChartData
				}))
			},
			setNewsSummary: (newNews: INewsSummary) => {
				set(() => ({
					newsSummary: newNews
				}))
			},
			setNewsArticles: (newNews: INewsArticles) => {
				set(() => ({
					newsArticles: newNews
				}))
			},
			setChartType: (newType: string) => {
				set(() => ({
					chartType: newType
				}))
			},
			setActiveTableRow: (text: string)  => {
				set(() => ({
					activeTableRow: text
				}))
			},
			setNewsArticlesLoading: (loading: boolean) => {
				set(() => ({
					newsArticlesLoading: loading
				}))
			},
			setNewsPortfolioLoading: (loading: boolean) => {
				set(() => ({
					newsPortfolioLoading: loading
				}))
			},
			setActiveChart: (activeChart: number) => {
				set(() => ({
					activeChart
				}))
			}
		}
	})),
)

const initialNewsState: INews = {
	articlesNews: {
		last_id: '',
		stories: []
	},
	articlesLoading: false,
	summaryNews: {
		summary: ''
	},
	summaryLoading: false,
}

export const  useNewsStore = create(
	combine(
		initialNewsState,
		(set) => ({
			setArticlesNews: async (url: string) => {
				set({articlesLoading: true})

				try{
					const res = await fetch("https://api.tickertick.com/feed?q=z:" + url + "&n=10")

					if(!res.ok) throw new Error('Failed to fetch articles news! Try again');

					set({articlesNews: await res.json()})
				}  finally {
					set({articlesLoading: false})
				}
			},
			setSummaryNews: async (url: string) => {
				set({summaryLoading: true})

				try{
					const res = await fetch("https://uxprototypes.org/ibkr/web-trader-dashboard/news-summary.php?ticker=" + url)

					if(!res.ok) throw new Error('Failed to fetch summary news! Try again');

					set({summaryNews: await res.json()})
				}  finally {
					set({summaryLoading: false})
				}
			},
			setSummaryPortfolioNews: async () => {
				set({summaryLoading: true})

				try{
					const res = await fetch("https://uxprototypes.org/ibkr/web-trader-dashboard/news-summary-portfolio.php?tickers=nvda,msft,meta,amzn,googl,nflx,intc,adbe,aapl,tsla")

					if(!res.ok) throw new Error('Failed to fetch summary news! Try again');

					set({summaryNews: await res.json()})
				}  finally {
					set({summaryLoading: false})
				}
			}
		})
	)
)


const chartUrl = 'https://script.google.com/macros/s/AKfycbxUh0f8wIouxgvOcGK3SyDy_Rcn3Bto0DZ2LblH0pkAWQvuxg8E0DypPoqRM6gHwNN8Dw/exec?sheets='

const initialChartData: IInitialChartData = {
	chartData: [],

	basisChartData: []
}


export const useChartStore = create(
	devtools(combine(
		initialChartData,
		(set) => ({
			setChartData: async (url: string) => {
				fetch(chartUrl + encodeURIComponent(url)).then(res => {
					if(!res.ok) throw new Error('Failed to fetch chart! Try again');
					return res.json()
				}).then(data => {
					set(() => ({chartData: data}))
				})
			},
			setBasisChartData: async (url: string) => {
				fetch(chartUrl + encodeURIComponent(url)).then(res => {
					if(!res.ok) throw new Error('Failed to fetch chart! Try again');
					return res.json()
				}).then(data => {
					set({basisChartData: data})
				})
			}
		})
	))
)




