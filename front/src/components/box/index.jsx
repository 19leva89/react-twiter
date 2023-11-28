import "./index.css"

const Component = ({ children, className, style = {} }) => {
	return (
		<div style={style} className={`box ${className}`}>
			{children}
		</div>
	);
}

export default Component;