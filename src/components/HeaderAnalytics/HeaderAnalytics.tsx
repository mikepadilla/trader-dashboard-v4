import { FC, useEffect, useState } from "react"


interface headerAnalyticsProps {
	title: string,
	initialValue: number
	calculate: number
}


const HeaderAnalytics: FC<headerAnalyticsProps> = ({ title, initialValue, calculate }) => {

	const [value, setValue] = useState<number>(initialValue)
	const [calculateValue, setCalculateValue] = useState<number>(calculate)
	const [percent, setPercent] = useState<number>(0)
	const [isPositive, setIsPositive] = useState<boolean>((calculate > 0))


	const getRandomTime = () => {
		return (Math.floor(Math.random() * 5) + 1) * 1000
	}

	useEffect(() => {
		setPercent(parseFloat(((calculate * 100) / initialValue).toFixed(2)))
		setIsPositive((calculate > 0))
		setInterval(() => {
			setRandom()
		}, getRandomTime());
	}, [])



	const setRandom = () => {
		const random = parseFloat((Math.floor(Math.random() * 11) + -5).toFixed(2))
		const newCalculate = parseFloat((calculateValue + random).toFixed(2))
		if (0 < newCalculate) {
			setIsPositive(true)
		} else {
			setIsPositive(false)
		}

		setValue(prev => prev + random)

		setCalculateValue(newCalculate)

		const newPercent = parseFloat(((calculateValue * 100) / value).toFixed(2))
		setPercent(newPercent)
	}



	return (
		<li className="header__analytics-item">
			<div className="header__analytics-title">{title}</div>
			<div className="header__analytics-body">
				<span className='header__analytics-value'>{value.toLocaleString('en-US')}</span>
				<span className={`header__analytics-calculate ${isPositive ? 'text_green' : 'text_red'}`}>
					<span className="header__analytics-calculate__value">
						{isPositive ? '+' : ''}{calculateValue}
					</span>
					(<span className="header__analytics-calculate__percent">{isPositive ? '+' : ''}{percent}</span>%)
				</span>
			</div>
		</li>
	)
}

export default HeaderAnalytics