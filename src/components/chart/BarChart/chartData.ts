const getColors = (data, yKey) => {
		const colorsArr = [];
		data.forEach((item, i) => {
			if (item[yKey] < 0) {
				colorsArr[i] = "red";
			} else {
				colorsArr[i] = "green";
			}
		});
		return colorsArr
	};

export const data = (chartData, yKey) => {
	return {
		labels: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь"],
		datasets: [
			{
				data: chartData.map((item) => {
					return { x: new Date(item['date']).getTime(), y: item[yKey] };
				}),
				borderWidth: 0,
				fill: "start",
				pointBackgroundColor: "transparent",
				pointBorderColor: "transparent",
				backgroundColor: getColors(chartData, yKey)
			},
		],
	}
}