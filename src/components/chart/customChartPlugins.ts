export const backgroundTicks = () => ({
	id: "backgroundTicks",
	afterDraw: (chart) => {
		const activeLineYVal = chart.options.plugins.customPlugin.activeLineY;
		const {
			ctx,
			scales: { y },
		} = chart;

		const chartWidth = chart.width;

		if (activeLineYVal !== null) {
			const tickValue = "Avg. " + activeLineYVal;

			// Настраиваем стиль текста
			ctx.font = "12px Arial";
			const textWidth = ctx.measureText(tickValue).width;

			// Определяем размеры элементов
			const rectWidth = textWidth + 20; // Добавляем отступы
			const rectHeight = 18;
			const triangleWidth = 7;
			const triangleHeight = 7;
			const startX = chartWidth - rectWidth - triangleWidth;

			// Определяем позицию
			const yPosition = y.getPixelForValue(activeLineYVal) - rectHeight / 2;

			// Рисуем прямоугольник
			ctx.fillStyle = "#146EB0";
			ctx.beginPath();
			ctx.moveTo(startX, yPosition);
			ctx.lineTo(startX + rectWidth, yPosition);
			ctx.lineTo(startX + rectWidth, yPosition + rectHeight);
			ctx.lineTo(startX, yPosition + rectHeight);
			ctx.closePath();
			ctx.fill();

			// Рисуем треугольник
			ctx.beginPath();
			const triangleX = startX - triangleWidth;
			const triangleY = yPosition + rectHeight / 2;

			ctx.moveTo(triangleX, triangleY);
			ctx.lineTo(triangleX + triangleWidth, triangleY + triangleHeight);
			ctx.lineTo(triangleX + triangleWidth, triangleY - triangleHeight);
			ctx.closePath();
			ctx.fill();

			// Добавляем текст
			ctx.fillStyle = "#fff";
			ctx.fillText(tickValue, startX + 10, yPosition + rectHeight / 1.5); // Позиционируем текст с отступом
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