export const data = (chartData, yKey, pointEvents, pointColors) => {
	return {
		labels: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь"],
		datasets: [
			{
				label: "Продажи в 2024 году",
				data: chartData.map((item) => {
					return { x: new Date(item['date']).getTime(), y: item[yKey] };
				}),
				borderWidth: 2,
				pointRadius: pointEvents,
				pointHitRadius: pointEvents,
				pointBackgroundColor: pointColors,
				pointBorderColor: "transparent",     
				fill: {
					target: 'origin',
					above: 'rgba(0, 200,0, 0.2)',
					below: 'rgba(200, 0,0 , 0.2)',
				}
			},
		]
	};
}