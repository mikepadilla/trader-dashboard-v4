
import './style.css'

import { useEffect, useState } from 'react'
import arrowUp from '../../assets/arrow-up.svg'
import check from '../../assets/check.svg'
import notification from '../../assets/din.svg'
import user from '../../assets/user.svg'
import HeaderAnalytics from '../HeaderAnalytics/HeaderAnalytics'



const Header = () => {

  const [number, setNumber] = useState("000000000");

  const addRandomNumber = () => {
    const randomIncrement = Math.floor(Math.random() * 5); 

    const updatedNumber = (parseInt(number, 10) + randomIncrement).toString().padStart(9, "0");

    setNumber(updatedNumber);
  };

  const formatNumberWithCommas = (numStr) => {
    return numStr.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  useEffect(() => {
    const interval = setInterval(addRandomNumber, 4000); 
    return () => clearInterval(interval); 
  }, [number]);

	return (
		<header className="header">
			<ul className="header__analytics">
				<HeaderAnalytics title='S&P 500' initialValue={5964.27} calculate={35.22} />
				<HeaderAnalytics title='NASDAQ' initialValue={19231.61} calculate={248.15} />
				<HeaderAnalytics title='DOW 30' initialValue={43721.63} calculate={-8.30} />
				<HeaderAnalytics title='RUSSELL 200' initialValue={2387.12} calculate={-5.80} />
				<HeaderAnalytics title='CRUDE OIL' initialValue={72.71} calculate={1.02} />
				<HeaderAnalytics title='GOLD' initialValue={2703.60} calculate={27.30} />

			</ul>
			<div className="header__checked">
				<div className="header__checked-content">
					<img src={arrowUp} alt="arrow up" /> 0
				</div>
				<div className="header__checked-content">
					<img src={check} alt="check" /> 1
				</div>
			</div>
			<ul className="header__changes">
				<li className="header__changes-item">
					<div className="header__changes-title">Net Liq.</div>
					<div className="header__changes-body">000,000,000</div>
				</li>
				<li className="header__changes-item">
					<div className="header__changes-title">Daily P&L</div>
					<div className="header__changes-body text_green header_daily">+{formatNumberWithCommas(number)}</div>
				</li>
			</ul>
			<div className="header__icons">
				<div className="notification__icon header__icon">
					<img src={notification} alt="notification" />
				</div>
				<div className="user__icon header__icon">
					<img src={user} alt="user" />
				</div>
			</div>
		</header>
	)
}


export default Header