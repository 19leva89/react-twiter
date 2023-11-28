import "./index.css"

const Component = ({ children }) => {
	return (
		<div className='grid'>
			{children}
		</div>
	);
}

export default Component;