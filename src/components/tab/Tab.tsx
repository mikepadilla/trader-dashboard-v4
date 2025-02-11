
import { FC, useState } from 'react'
import './style.css'


import setting from '../../assets/tab-settings.svg'

interface ITabData {
	title: string
	content: JSX.Element
}

interface tabProps {
	tabData: ITabData[]
}

const Tab: FC<tabProps> = ({ tabData }) => {

	const [activeTabIndex, setActiveTabIndex] = useState<number>(0)

	return (
		<div className="tab">
			<div className="tab__buttons">
				{tabData.map((item, i) => {
					if (activeTabIndex == i) {
						return <button className='tab__button tab__button_active' key={i}>{item.title}</button>
					}
					return <button className='tab__button' key={i} onClick={() => setActiveTabIndex(i)}>{item.title}</button>
				})}
										<div className="tab__settings">
							<img src={setting} alt="tab setting" />
						</div>
			</div>
			<div className="tab__contents">
				{tabData.map((item, i) => {
					if (activeTabIndex == i) {
						return <div className="tab__content tab__content_active" key={i}>{item.content}</div>
					}
					return <div className="tab__content" key={i}>{item.content}</div>
				})}
			</div>
		</div>
	)
}

export default Tab