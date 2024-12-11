

import screen from '../../assets/filter.svg'
import sell from '../../assets/minus.svg'
import buy from '../../assets/plus.svg'
import search from '../../assets/search.svg'

const LeftButtons = () => {

	return (
		<div className="left__buttons">
			<button className="left__button button__search">
				<img src={search} alt="search icon" />
				<span>Search</span>
			</button>
			<button className="left__button button__filter">
				<img src={screen} alt="filter icon" />
				<span>Screen</span>
			</button>
			<button className="left__button button__plus">
				<img src={buy} alt="plus icon" />
				<span>Buy</span>
			</button>
			<button className="left__button button__minus">
				<img src={sell} alt="minus icon" />
				<span>Sell</span>
			</button>
		</div>
	)
}

export default LeftButtons