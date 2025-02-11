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

export const options = (events, chartData, yKey, min, max, activeLineY, setActiveLineY, activeLineYVal, setActiveLineYVal): NewChartOptionBar => {
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
					yAlign: "bottom",
					callbacks: {
						title: (tooltipData) => {
							return `${chartData[tooltipData[0].dataIndex][
								"ticker"
							].toUpperCase()} $${chartData[tooltipData[0].dataIndex][
								yKey
							].toLocaleString("en-US")}`;
						},
						label: (tooltipData) => {
							return `${chartData[tooltipData.dataIndex]["shares"]} Shares ${
								chartData[tooltipData.dataIndex]["cost basis"]
							}`;
						},
						footer: (tooltipData) => {
							const date = new Date(chartData[tooltipData[0].dataIndex]["date"]);
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
					padding: 0,
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
							return Math.floor(value);
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
