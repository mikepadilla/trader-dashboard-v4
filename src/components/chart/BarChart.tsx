import {
	BarElement,
	CategoryScale,
	Chart as ChartJS,
	Legend,
	LinearScale,
	Title,
	Tooltip,
} from 'chart.js';

// Регистрация компонентов Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

import { useEffect, useRef, useState } from "react";
import { Bar } from "react-chartjs-2";


import useTableStore from '../../zustand/store';
import { backgroundTicks, drawEvents, drawTickText, hoverLine } from './customChartPlugins';
import './style.css';

const BarChart = ({chartDataProp, yKey, events }) => {

	const [activeLineY, setActiveLineY] = useState<number | null>(null)
	const [activeLineYVal, setActiveLineYVal] = useState<number | null>(null)
	const [colors, setColor] = useState([])

	const {chartType} = useTableStore()


	const chartRef = useRef()

	const [chartData, setChartData] = useState(chartDataProp);


	useEffect(() => {
		findMinMax(chartData, yKey)
	}, [])

	useEffect(() => {
		setChartData(changeData(resetData(chartDataProp)))
	}, [chartType])

	function resetData(data) {
		const arr = []

		for (let i = 0; i < data.length; i++) {
			if (chartType == 'daily' && new Date(data[i]['date']).getTime() <= new Date(data[0]['date']).getTime() + 604800000 ||
			chartType == 'weekly' && new Date(data[i]['date']).getTime() <= new Date(data[0]['date']).getTime() + 6104800000 ||
			chartType == 'monthly' && new Date(data[i]['date']).getTime() <= new Date(data[0]['date']).getTime() + 18144000000 ) {
				arr.push({ ...data[i], [yKey]: data[i][yKey] })
			}
		}

		return arr
	}

	const findMinMax = (data, ticker) => {
    if (data.length < 1) {
      return [0, 0];
    }

    let max = data[0][ticker];

    for (let i = 0; i < data.length; i++) {
      if (0 > data[i][ticker] && data[i][ticker] * -1 > max) {
				max = data[i][ticker] * -1
      }
      if (max < data[i][ticker]) {
        max = data[i][ticker];
      }
    }

		return [0, max]
  };



	const changeData = (data) => {
		const colorsArr = []
    const resetData = data.map((item, i) => {
      if (item[yKey] < 0) {
				colorsArr[i] = 'red'
        return { ...item, [yKey]: item[yKey] * -1 }
      } else {

				colorsArr[i] = 'green'
        return item
      }
    })

		setColor(colorsArr)
    return resetData
  }

	const data = {
		labels: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь'],
		datasets: [
			{
				data: chartData.map((item, i) => {
					return { x: i, y: item[yKey] }
				}),
				borderWidth: 2,
				borderColor: colors.length > 1 ? colors:  '#146EB0',
				fill: "start",
				pointBackgroundColor: 'transparent',
				pointBorderColor: 'transparent',
			},
		],
	};



	const [min, max] = findMinMax(chartData, yKey)

	const options = {
		animation: false,
		layout: {
			padding: 0,
		},
		plugins: {
			legend: {
				display: false,
			},
			chartAreaBorder: {
				borderColor: "transparent",
				borderWidth: 2,
			},
			// backgroundTicksPlugin: this.backgroundTicksPlugin,
			tooltip: {
				enabled: events ? true : false,
				yAlign: 'bottom',
				callbacks: {
					title: (tooltipData) => {
						return `${chartData[tooltipData[0].dataIndex]['ticker'].toUpperCase()} $${chartData[tooltipData[0].dataIndex][yKey].toLocaleString('en-US')}`;
					},
					label: (tooltipData) => {
						return `${chartData[tooltipData.dataIndex]['shares']} Shares ${chartData[tooltipData.dataIndex]['cost basis']}`;
					},
					footer: (tooltipData) => {
						const date = new Date(chartData[tooltipData[0].dataIndex]['date'])
						const month = date.getUTCMonth()
						const day = date.getUTCDate()
						const year = date.getUTCFullYear()

						return `${month}/${day}/${year}`;
					},
				},
				backgroundColor: "#146EB0",
				titleColor: "#fff",
				bodyColor: "#fff",
				labelColor: '#fff',
				titleFont: { weight: "bold" },
				padding: 10,
				cornerRadius: 10,
				borderWidth: "0",
				displayColors: false
			},
			backgroundTicks: backgroundTicks(activeLineYVal),

			customPlugin: {
				activeLineY,
				activeLineYVal,
				chartData
			}

		},
		onHover: (event, elements, ctx) => {
			const chart = ChartJS.getChart(chartRef.current)
			const h = ctx.height - 12


			const y = Math.max(12, Math.min(h, event.y));
			const position = parseFloat(((((h) - (y)) / (h - 20)) * (max - min) + min).toFixed(2));

			setActiveLineY(position);
			setActiveLineYVal(position)

			if (chart) {
				chart.update()
			}
		},
		scales: {
			x: {
				min: 1,
				max: chartData.length,
				grid: {
					color: "transparent",
				},
				type: "linear",
				// adapters: {
				//   date: {
				//     locale: enUS,
				//   },
				// },
				position: "bottom",
				border: {
					display: false,
				},

				maxTicksLimit: 10,
				minTicksLimit: 10,
				ticks: {
					display: false,
				},
			},
			y: {
				min: 0,
				max: max + (max / 100),
				grid: {
					color: "#1F4C69",
					tickLength: 0,
				},
				position: "right",
				type: "linear",
				border: {
					dash: [3],
					display: false,
				},
				ticks: {
					color: "#146EB0",
					callback: (value) => {
						// if (this.yTicksType == 'market') {
						// 	return value.toFixed(2);
						// }
						// if (this.yTicksType == 'performance') {
						// 	return Math.floor(value) + '%'
						// }
						return Math.floor(value)
					},
					font: {
						size: 12,
						family: "Proxima nova, sans-serif",
					},
					padding: 10,
				},
			},
		},
	}




	const plugins = [
		hoverLine(),
		backgroundTicks(),
		drawTickText(),
	]

	if (events) {
		plugins.push(drawEvents())
	}

	return <Bar className='chart' ref={chartRef} data={data} options={options} plugins={plugins} />
}

export default BarChart