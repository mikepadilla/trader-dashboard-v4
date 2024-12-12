// export function hoverLinePlugin(activeLineY: null | number) {
// 	console.log(2)
// 	return {
// 		id: 'hoverLine',
// 		beforeDraw: (chart) => {
// 			const { ctx, chartArea, scales: { y } } = chart;


// 			if (activeLineY !== null) {
// 				ctx.save();
// 				ctx.beginPath();
// 				ctx.setLineDash([3, 3]); // Устанавливаем пунктирную линию
// 				ctx.moveTo(chartArea.left, y.getPixelForValue(activeLineY));
// 				ctx.lineTo(chartArea.right, y.getPixelForValue(activeLineY));
// 				ctx.strokeStyle = '#146EB0'; // Цвет линии
// 				ctx.lineWidth = 1;
// 				ctx.stroke();
// 				ctx.restore();
// 			}
// 		}
// 	}
// };

// // custom chart's plugin for create background right value 
// export const backgroundTicksPlugin = {
// 	id: "backgroundTicks",
// 	afterDraw: (chart) => {
// 		const {
// 			ctx,
// 			scales: { y },
// 		} = chart;
// 		const chartWidth = chart.width;

// 		const rectWidth = 66;
// 		const rectHeight = 18;
// 		const triangleWidth = 7;
// 		const triangleHeight = 7;
// 		const startX = chartWidth - rectWidth - triangleWidth;
// 		const yPosition = y.getPixelForValue(this.activeLineYVal) - rectHeight / 2;

// 		if (this.activeLineYVal !== null) {
// 			ctx.fillStyle = "#146EB0";
// 			ctx.beginPath();
// 			ctx.moveTo(startX, yPosition);
// 			ctx.lineTo(startX + rectWidth, yPosition);
// 			ctx.lineTo(startX + rectWidth, yPosition + rectHeight);
// 			ctx.lineTo(startX, yPosition + rectHeight);
// 			ctx.closePath();
// 			ctx.fill();

// 			ctx.beginPath();
// 			const triangleX = startX - triangleWidth;
// 			const triangleY = yPosition + rectHeight / 2;

// 			ctx.moveTo(triangleX, triangleY);
// 			ctx.lineTo(triangleX + triangleWidth, triangleY + triangleHeight);
// 			ctx.lineTo(triangleX + triangleWidth, triangleY - triangleHeight);
// 			ctx.closePath();
// 			ctx.fill();
// 		}
// 	}
// };

// // custom chart's plugin for create text right value 
// export const customTickPlugin = {
// 	afterDraw: (chart) => {
// 		const {
// 			ctx,
// 			scales: { y },
// 		} = chart;
// 		const chartWidth = chart.width;

// 		const rectWidth = 66;
// 		const triangleWidth = 8;
// 		const startX = chartWidth - rectWidth - triangleWidth + 5;

// 		const yPosition = y.getPixelForValue(this.activeLineYVal) + 4;
// 		if (this.activeLineYVal !== null) {
// 			let tickValue = "Avg. " + this.activeLineYVal

// 			ctx.fillStyle = "#fff";
// 			ctx.fillText(tickValue, startX, yPosition);
// 		}
// 	},
// };
// // custom chart's plugin for create event points
// export const  customPointsPlugin = {
// 	id: "customPoints",
// 	beforeDraw: (chart) => {
// 		const ctx = chart.ctx;
// 		const meta = chart.getDatasetMeta(0);

// 		meta.data.forEach((point, index) => {
// 			const x = point.x - 1;
// 			const y = point.y;
// 			const drawCircle = (
// 				widthOutside,
// 				widthInside,
// 				colorOutside,
// 				colorInside
// 			) => {
// 				ctx.beginPath();
// 				ctx.arc(x, y, widthOutside, 0, 2 * Math.PI);
// 				ctx.fillStyle = colorOutside;
// 				ctx.fill();
// 				ctx.restore();

// 				ctx.beginPath();
// 				ctx.arc(x, y, widthInside, 0, 2 * Math.PI);
// 				ctx.fillStyle = colorInside;
// 				ctx.fill();
// 				ctx.restore();
// 			};
// 			if (this.events) {
// 				if (this.events[index].trade == 'Buy') {
// 					drawCircle(2.5, 4, 'rgba(0, 128, 0, 0.5)', 'rgba(0, 128, 0, 0.5)')
// 				} else {
// 					drawCircle(2.5, 4, 'rgba(255, 0, 0, 0.5)', 'rgba(255, 0, 0, 0.5)')
// 				}
// 			}
// 		});
// 	},
// };

export const backgroundTicks = () => ({
	id: "backgroundTicks",
	beforeDraw: (chart) => {
		const activeLineYVal = chart.options.plugins.customPlugin.activeLineY
		const {
			ctx,
			scales: { y },
		} = chart;
		const chartWidth = chart.width;

		const rectWidth = 66;
		const rectHeight = 18;
		const triangleWidth = 7;
		const triangleHeight = 7;
		const startX = chartWidth - rectWidth - triangleWidth;

		if (activeLineYVal !== null) {
			const yPosition = y.getPixelForValue(activeLineYVal) - rectHeight / 2;
			ctx.fillStyle = "#146EB0";
			ctx.beginPath();
			ctx.moveTo(startX, yPosition);
			ctx.lineTo(startX + rectWidth, yPosition);
			ctx.lineTo(startX + rectWidth, yPosition + rectHeight);
			ctx.lineTo(startX, yPosition + rectHeight);
			ctx.closePath();
			ctx.fill();

			ctx.beginPath();
			const triangleX = startX - triangleWidth;
			const triangleY = yPosition + rectHeight / 2;

			ctx.moveTo(triangleX, triangleY);
			ctx.lineTo(triangleX + triangleWidth, triangleY + triangleHeight);
			ctx.lineTo(triangleX + triangleWidth, triangleY - triangleHeight);
			ctx.closePath();
			ctx.fill();
		}
	},
})

export const hoverLine = () => ({
	id: 'hoverLine',
	beforeDraw: (chart) => {
		const activeLineY = chart.options.plugins.customPlugin.activeLineY
		const { ctx, chartArea, scales: { y } } = chart;
		if (activeLineY !== null) {
			ctx.save();
			ctx.beginPath();
			ctx.setLineDash([3, 3]);
			ctx.moveTo(chartArea.left, y.getPixelForValue(activeLineY));
			ctx.lineTo(chartArea.right, y.getPixelForValue(activeLineY));
			ctx.strokeStyle = '#146EB0';
			ctx.lineWidth = 1;
			ctx.stroke();
			ctx.restore();
		}
	}
})


export const drawTickText = () => ({
	id: 'custom Tick plugin',
	afterDraw: (chart) => {
		const activeLineY = chart.options.plugins.customPlugin.activeLineY;
		const activeLineYVal = chart.options.plugins.customPlugin.activeLineYVal;
		const {
			ctx,
			scales: { y },
		} = chart;
		const chartWidth = chart.width;

		const rectWidth = 66;
		const triangleWidth = 8;
		const startX = chartWidth - rectWidth - triangleWidth + 5;

		if (activeLineYVal !== null) {
			const yPosition = y.getPixelForValue(activeLineY) + 4;
			const tickValue = "Avg. " + activeLineYVal

			ctx.fillStyle = "#fff";
			ctx.fillText(tickValue, startX, yPosition);
		}
	},
})

export const drawEvents = () => ({
	id: "customPoints",
	beforeDraw: (chart) => {
		const chartData = chart.options.plugins.customPlugin.chartData
		const ctx = chart.ctx;
		const meta = chart.getDatasetMeta(0);

		meta.data.forEach((point, index) => {
			const x = point.x - 1;
			const y = point.y;
			const drawCircle = (
				widthOutside,
				widthInside,
				colorOutside,
				colorInside
			) => {
				ctx.beginPath();
				ctx.arc(x, y, widthOutside, 0, 2 * Math.PI);
				ctx.fillStyle = colorOutside;
				ctx.fill();
				ctx.restore();

				ctx.beginPath();
				ctx.arc(x, y, widthInside, 0, 2 * Math.PI);
				ctx.fillStyle = colorInside;
				ctx.fill();
				ctx.restore();
			};
			if (chartData[index]) {
				if (chartData[index].trade == 'Buy') {
					drawCircle(2.5, 4, 'rgba(0, 128, 0, 0.5)', 'rgba(0, 128, 0, 0.5)')
				} else {
					drawCircle(2.5, 4, 'rgba(255, 0, 0, 0.5)', 'rgba(255, 0, 0, 0.5)')
				}
			}
		});
	},
})