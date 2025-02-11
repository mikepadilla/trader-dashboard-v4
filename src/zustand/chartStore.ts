import { create } from "zustand";
import { combine, devtools } from "zustand/middleware";
import { activeChartType, IInitialChartData } from "../types/types";

const chartUrl = 'https://script.google.com/macros/s/AKfycbxUh0f8wIouxgvOcGK3SyDy_Rcn3Bto0DZ2LblH0pkAWQvuxg8E0DypPoqRM6gHwNN8Dw/exec?sheets='

const initialChartData: IInitialChartData = {
	chartData: [],
	basisChartData: [],
	chartType: 'cumulative',
	tradingViewChart: 'AAPL',
	activeChart: 0
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
			},
			setTradingViewChart: (title: string) => {
				set(() => ({
					tradingViewChart: title
				}))
			},
			setChartType: (newType: activeChartType) => {
				set(() => ({
					chartType: newType
				}))
			},
			setActiveChart: (activeChart: number) => {
				set(() => ({
					activeChart
				}))
			}
		})
	))
)




