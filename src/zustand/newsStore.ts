import { create } from "zustand";
import { INews } from "../types/types";
import { combine } from "zustand/middleware";

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
					const res = await fetch("https://deardollars.com/ibkr/news-summary.php?ticker=" + url)

					if(!res.ok) throw new Error('Failed to fetch summary news! Try again');

					set({summaryNews: await res.json()})
				}  finally {
					set({summaryLoading: false})
				}
			},
			setSummaryPortfolioNews: async () => {
				set({summaryLoading: true})

				try{
					const res = await fetch("https://deardollars.com/ibkr/news-summary-portfolio.php?tickers=nvda,msft,meta,amzn,googl,nflx,intc,adbe,aapl,tsla")

					if(!res.ok) throw new Error('Failed to fetch summary news! Try again');

					set({summaryNews: await res.json()})
				}  finally {
					set({summaryLoading: false})
				}
			}
		})
	)
)

