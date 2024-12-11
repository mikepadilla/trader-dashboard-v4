
const url = 'https://script.google.com/macros/s/AKfycbxUh0f8wIouxgvOcGK3SyDy_Rcn3Bto0DZ2LblH0pkAWQvuxg8E0DypPoqRM6gHwNN8Dw/exec'
const newsUrl = 'https://uxprototypes.org/ibkr/web-trader-dashboard/news-summary.php?ticker='
const portfolioNewsUrl = 'https://uxprototypes.org/ibkr/web-trader-dashboard/news-summary-portfolio.php?tickers=nvda,msft,meta,amzn,googl,nflx,intc,adbe,aapl,tsla'
const newsArticlesUrl = 'https://api.tickertick.com/feed?q=z:aapl'
export const getTableData = (dataName: string) => {
	const response = fetch((url + "?sheets=" + encodeURIComponent(dataName))).then(res => (res.json())).then(data => {
		return data
	}).catch((e) => {
		console.log("ERROR", e)
	})
	return response
}


export const getChartData = (dataUrl: string) => {
	const response = fetch((url + "?sheets=" + dataUrl)).then((res) => res.json())
		.then((data) => {
			return data
		}).catch((e) => {
			console.log("CHART ERROR", e)
		})
	return response
}

export const getMarketChartData = (dataUrl: string) => {
	const response = fetch((url + "?sheets=" + dataUrl)).then((res) => res.json())
		.then((data) => {
			return data
		}).catch((e) => {
			console.log("MARKET DATA ERROR", e)
		})
		console.log('getData')
	return response
}


export const getNews = (dataUrl: string) => {
	const response = fetch((newsUrl + dataUrl)).then((res) => res.json())
		.then((data) => {
			return data
		}).catch((e) => {
			console.log("MARKET DATA ERROR", e)
		})
	return response
}

export const getPortfolioNews = () => {
	const response = fetch((portfolioNewsUrl)).then((res) => res.json())
		.then((data) => {
			return data
		}).catch((e) => {
			console.log("MARKET DATA ERROR", e)
		})
	return response
}

export const getArticlesNews = (dataUrl: string) => {
	const response = fetch((newsArticlesUrl + dataUrl + '&n=10')).then((res) => res.json())
		.then((data) => {
			return data
		}).catch((e) => {
			console.log("MARKET DATA ERROR", e)
		})
	return response
}