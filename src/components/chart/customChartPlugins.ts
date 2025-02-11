
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
			const tickValue = "$" + activeLineYVal.toLocaleString("en-US");

			ctx.font = "12px Arial";
			const textWidth = ctx.measureText(tickValue).width;

			const rectWidth = textWidth + 20; 
			const rectHeight = 18;
			const triangleWidth = 7;
			const triangleHeight = 7;
			const startX = chartWidth - rectWidth - triangleWidth;

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

			ctx.fillStyle = "#fff";
			ctx.fillText(tickValue, startX + 10, yPosition + rectHeight / 1.5); 
		}
	},
})

export const hoverLine = () => ({
  id: 'hoverLine',
  afterDatasetsDraw: (chart) => {
    const activeLineY = chart.options.plugins.customPlugin.activeLineY;
    const { ctx, chartArea, scales: { y } } = chart;

    if (activeLineY !== null) {
      const cursorPos = y.getPixelForValue(activeLineY);

      ctx.save();
      ctx.beginPath();
      ctx.setLineDash([3, 3]);
      ctx.moveTo(chartArea.left, cursorPos);
      ctx.lineTo(chartArea.right, cursorPos);
      ctx.strokeStyle = '#146EB0';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();
    }
  } ,
	z: 1
});


export const drawEvents = () => ({
	id: "customPoints",
	beforeEvent: (chart) => {
		const chartData = chart.options.plugins.customPlugin.chartData
		const ctx = chart.ctx;
		const meta = chart.getDatasetMeta(0);

		meta.data.forEach((point, index) => {
			const x = point.x;
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

export const drawZeroLine =  {
	id: 'drawZeroLine',
	afterDraw: (chart) => {
		const ctx = chart.ctx;
		const yScale = chart.scales.y;

		if(yScale.min <= 0 && yScale.max >= 0) {
			const yPos = yScale.getPixelForValue(0);

			ctx.save();
			ctx.beginPath();
			ctx.setLineDash([3, 3]);
			ctx.moveTo(chart.chartArea.left, yPos);
			ctx.lineTo(chart.chartArea.right, yPos);
			ctx.strokeStyle = '#146EB0';
			ctx.lineWidth = 1;
			ctx.stroke();
			ctx.restore();
		}
	}
}

export const leaveEventPlugin = () => ({
	id: 'someEventCatcher',
	beforeEvent(chart, args) {
		if (args.event.type === 'mouseout') {
			chart.options.plugins.customPlugin.activeLineY = null
			chart.options.plugins.customPlugin.activeLineY = null
			chart.update();
		}
	}
})


export const DrawColorsLine = {
  id: 'customPlugin',
  beforeDraw: (chart) => {
    const ctx = chart.ctx;
    const meta = chart.getDatasetMeta(0);
    const yScale = chart.scales['y'];

    const zeroY = yScale.getPixelForValue(0); 

    ctx.save();
    ctx.lineWidth = 2;

    meta.data.forEach((point, index) => {
      const x = point.x;
      const y = point.y;

      if (index === 0) {
        ctx.beginPath();
        ctx.moveTo(x, y);
      } else {
        const prevX = meta.data[index - 1].x;
        const prevY = meta.data[index - 1].y;

        if ((prevY < zeroY && y >= zeroY) || (prevY >= zeroY && y < zeroY)) {
          const slope = (y - prevY) / (x - prevX);
          const intersectX = prevX + (zeroY - prevY) / slope;

          ctx.lineTo(intersectX, zeroY);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(intersectX, zeroY);
          ctx.lineTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      if (y > zeroY) {
        ctx.strokeStyle = 'red'; 
      } else {
        ctx.strokeStyle = 'green'; 
      }
    });

    ctx.stroke();
    ctx.restore();
  }
};
