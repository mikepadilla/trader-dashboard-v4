
import RightHeaderAnalytics from '../rightHeaderAnalytics/RightHeaderAnalytics'
import './style.css'


const RightHeader = () => {

	return (
		<div className="content__header">
			<ul className="content__header-list">
				<li className="content__header-item">
					<h4 className="content__header-title">My Portfolio</h4>
					<span className='content__header-value'>D1234567</span>
				</li>
				<li className="content__header-item">
					<h4 className="content__header-title">Daily P&L</h4>
					<RightHeaderAnalytics initialValue={11920.23}/>
				</li>
				<li className="content__header-item">
					<h4 className="content__header-title">Unrealized P&L</h4>
					<RightHeaderAnalytics initialValue={93981.34}/>
				</li>
				<li className="content__header-item">
					<h4 className="content__header-title">Realized P&L</h4>
					<RightHeaderAnalytics initialValue={28385.21}/>
				</li>
				<li className="content__header-item">
					<h4 className="content__header-title">Net Liquidation Value</h4>
					<span className='content__header-value'>712.5k</span>
				</li>
				<li className="content__header-item">
					<h4 className="content__header-title">Excess Liquidity</h4>
					<span className='content__header-value'>616.7k</span>
				</li>
				<li className="content__header-item">
					<h4 className="content__header-title">Net Liquidation Value</h4>
					<span className='content__header-value'>712.5k</span>
				</li>
				<li className="content__header-item">
					<h4 className="content__header-title">Maintenance Margin</h4>
					<span className='content__header-value'>95.7k</span>
				</li>
				<li className="content__header-item">
					<h4 className="content__header-title">Available Funds</h4>
					<span className='content__header-value'>616.5k</span>
				</li>
			</ul>
		</div>
	)
}

export default RightHeader