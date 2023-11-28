import "./index.css"

const Component = ({ children }) => {
	return (
		<h1 className="title">
			{children}
		</h1>
	);
}

export default Component;