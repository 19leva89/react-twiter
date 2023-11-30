import "./style.css"

const Box = ({ children, className, style = {} }) => {
	return (
		<div style={style} className={`box ${className}`}>
			{children}
		</div>
	);
}

export default Box;