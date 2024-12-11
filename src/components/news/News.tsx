
import { useEffect, useState } from 'react'
import Masonry from 'react-masonry-css'
import { getArticlesNews, getPortfolioNews } from '../../api/getTableData'
import setting from '../../assets/tab-settings.svg'
import useTableStore from '../../zustand/store'
import NewsSkeleton from '../newsSkeleton/NewsSkeleton'

import './style.css'
const News = () => {
	const {newsArticlesLoading, newsPortfolioLoading, setNewsArticlesLoading, setNewsPortfolioLoading} = useTableStore()

	const [newsArticles, setNewsArticles] = useState()
	const [newsPortfolio, setNewPortfolio] = useState()



	useEffect(() => {
		setNewsArticlesLoading(true)
		setNewsPortfolioLoading(true)
		getArticlesNews('').then((res) => {
			setNewsArticles(res)
			setNewsArticlesLoading(false)
		})
		getPortfolioNews().then(res => {
			setNewPortfolio(res.summary)
			setNewsPortfolioLoading(false)
		})
	}, [])

	const breakpointColumns = {
    default: 2, // Количество колонок по умолчанию
    1000: 1, // На маленьких экранах — одна колонка
  };

	return (
		<div className="news" style={{ width: '100%' }}>
			<div className="content__tabs ">
				<div className="content__tab summary__tab" >
					<div className="tab__buttons">
						<div className="buttons__wrapper">
							<button className="tab__button tab__button_active">Portfolio News Summary</button>
						</div>
						<div className="tab__settings">
							<img src={setting} alt="tab setting" />
						</div>
					</div>
					<div className="tabs__contents ">
						<div className="tab__contents">
							<div className="tab__content tab__content_active" id='portfolio-summary' style={{ whiteSpace: "pre-line" }}>

								{newsPortfolioLoading ? <NewsSkeleton /> : newsPortfolio ? newsPortfolio : null}
							</div>
						</div>
					</div>
				</div>
				<div className="content__tab articles__tab">
					<div className="tab__buttons">
						<div className="buttons__wrapper">
							<button className="tab__button tab__button_active">Portfolio News Articles</button>
						</div>
						<div className="tab__settings">
							<img src={setting} alt="tab setting" />
						</div>
					</div>
					<div className="tabs__contents">
						<div className="tab__contents">
							<div className="tab__content tab__content_active">
							<Masonry
									breakpointCols={breakpointColumns}
									className="my-masonry-grid"
									columnClassName="my-masonry-grid_column"
								>
									{newsArticlesLoading ? <NewsSkeleton /> :
										newsArticles != undefined ? (newsArticles.stories.map(((item, i) => {
											return <div className="articles__tab-item" key={i}>
												<h4 className='articles__tab-title'>{item.title}</h4>
												<p className='articles__tab-description'>{item.description}</p>
											</div>
										}))) : null
									}
								</Masonry>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default News