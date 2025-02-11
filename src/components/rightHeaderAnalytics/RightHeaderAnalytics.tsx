import { FC, useEffect, useState } from "react"

interface RightHeaderAnalyticsProps {
	initialValue: number
}

const RightHeaderAnalytics: FC<RightHeaderAnalyticsProps> = ({initialValue}) => {

	const [value, setValue] = useState<number>(initialValue)
	const [isPositive, setIsPositive] = useState<boolean>(initialValue > 0)

	const getRandomTime = () => {
		return (Math.floor(Math.random() * 5) + 1) * 1000
	}

	useEffect(() => {
		setInterval(() => {
			setRandom()
		}, getRandomTime());
	}, [])

	const setRandom = () => {
		const random = parseFloat((Math.floor(Math.random() * 11) + -5).toFixed(2))

		if (0 < value) {
			setIsPositive(true)
		} else {
			setIsPositive(false)
		}

		setValue(prev => prev + random)
	}

	return <span className={`content__header-value content__header-value__realized ${isPositive ? 'text_green' : 'text_red'}`}>{value.toLocaleString('en-US')}</span>
}

export default RightHeaderAnalytics