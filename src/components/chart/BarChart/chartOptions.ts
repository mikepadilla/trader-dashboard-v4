import { NewChartOptionBar } from "../../../types/types";


const findMinMaxDay = (data): [number, number] => {  
	if(data[0]) {
	 let min: number = new Date(data[0]['date']).getTime();
	 let max: number = new Date(data[0]['date']).getTime();

	 for (let i = 0; i < data.length; i++) {
		 if (max < new Date(data[i]['date']).getTime()) {
			 max = new Date(data[i]['date']).getTime();
		 }
		 if (min > new Date(data[i]['date']).getTime()) {
			 min = new Date(data[i]['date']).getTime();
		 }
	 }
	 return [min, max]
	}
	return [0, 0]
 }


 const someFunc = (chartData, basisChartData) => {
	const arr = []

	let j = 0

	for (let i = 0; i < chartData.length; i++) {
		if(chartData[i]['daily buy sell'] !== 0) {
			arr.push(basisChartData[j])
			j++
		} else {
			arr.push(0)
		}
	}
	return arr
 }

export const options = (events, chartData, min, max, activeLineY, setActiveLineY, activeLineYVal, setActiveLineYVal, tradingViewChart, basisChartData, yKey): NewChartOptionBar => {
	return {
			maintainAspectRatio: true,
			aspectRatio: 2.75,     
			animation: false,
			layout: {
				padding: 0,
			},
			plugins: {
				legend: {
					display: false,
				},
				tooltip: {
					enabled: events ? true : false,

					callbacks: {
						title: (tooltipData) => {
							const data = chartData[tooltipData[0].dataIndex] 
							if(yKey == 'daily performance') {
								return `${Intl.NumberFormat('en-US', 
									{ style: 'currency', currency: 'USD', currencySign: 'standard' })
									.format(data['daily performance'])}`;
							}
							if(data && !data['share amount']) {
	
								return `${data['daily buy sell'] < 0 ? 'SELL' : 'BUY'} ${tradingViewChart} ${
									Intl.NumberFormat('en-US', 
										{ style: 'currency', currency: 'USD', currencySign: 'standard' })
										.format(data['daily buy sell'])}`;
							
							} else {
								return `${data['trade'].toUpperCase()} ${data[
									"ticker"
								].toUpperCase()} $${data[
									'cost basis'
								].toLocaleString("en-US")}`;
							}
						},
						label: (tooltipData) => {
							const data = chartData[tooltipData.dataIndex]
							const eventData = someFunc(chartData, basisChartData)[tooltipData.dataIndex]
							if(data['amzn'] || yKey == 'daily performance') {
								return null
							}
							console.log(data)
							if(data && !data['share amount']) {
								if(data.price) {
									const shares = (data["daily buy sell"] / data['price']).toLocaleString('en-US')
									return `${shares} Shares @ $${
										data["price"].toLocaleString('en-US')
									}`;
								} else {
									if(eventData != 0){
										const shares = (eventData['shares'] ).toLocaleString('en-US')
										return `${shares} Shares @ $${
											eventData["share amount"].toLocaleString('en-US')
										}`;
									}
								}
							} else {
								const shares = data['shares'] 
								return `${shares} Shares @ $${
									data["share amount"].toLocaleString('en-US')
								}`;
							}
						},
						footer: (tooltipData) => {
							const data = chartData[tooltipData[0].dataIndex]
	
							const date = new Date(data["date"]);
							const month = date.getUTCMonth();
							const day = date.getUTCDate();
							const year = date.getUTCFullYear();
		
							return `${month}/${day}/${year}`;
						},
					},
					backgroundColor: "#146EB0",
					titleColor: "#fff",
					bodyColor: "#fff",
					titleFont: { weight: "bold" },
					padding: 10,
					cornerRadius: 10,
					borderWidth: 0,
					displayColors: false,
				},

				customPlugin: {
					activeLineY,
					activeLineYVal,
					chartData,
				},
			},
			onHover: (event, _, ctx) => {
				const { scales: { y } } = ctx;
				const canvas = ctx.canvas;
				const rect = canvas.getBoundingClientRect();
				const native = event.native as MouseEvent;
				const mouseY = native.clientY - rect.top;

				const yValue = y.getValueForPixel(mouseY);
				setActiveLineY(yValue);
				setActiveLineYVal(yValue);
			},
			scales: {

				x: {
					min: findMinMaxDay(chartData)[0],
					max: findMinMaxDay(chartData)[1],
					grid: {
						color: "transparent",
					},
					type: "linear",
					position: "bottom",
					border: {
						display: false,
					},
					offset: false,

					ticks: {
						color: "#146EB0",
						align: 'inner',
						count: 11,
						callback: (val) => {
							return new Date(val).toLocaleDateString('en-GB', {
									month: "short",
									year: "numeric"
							});
						},
					},
				},
				y: {
					min: min,
					max: max,
					grid: {
						color: "#1F4C69",
						tickLength: 0,
					},
					position: "right",
					type: "linear",
					border: {
						dash:  (context) => {
						return context.tick.value === min ? [] : [3]; 
					},
						display: false,
					},
					ticks: {
						color: "#146EB0",
						callback: (value: number) => {
							return Math.floor(value).toLocaleString('en-US');
						},
						font: {
							size: 12,
							family: "Proxima nova, sans-serif",
						},
						padding: 0,
						count: 8
					},
				},
			},
		}
	}
