

const TableSkeleton = () => {

	return (
		<div className="o-media__body table--skeleton" style={{ marginTop: "12px" }}>
			<div className="o-vertical-spacing">
				<h3 className="blog-post__headline">
					<span className="skeleton-box" style={{ width: "100%", height: "40px" }}></span>
				</h3>
				<p style={{ marginTop: "7px" }}>
					<span className="skeleton-box" style={{ width: "100%", height: "300px" }}></span>
				</p>
			</div>
		</div>
	)
}


export default TableSkeleton