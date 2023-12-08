import { useContext } from "react";
import { THEME_TYPE, ThemeContext } from "../../App";
import "./style.css"

const Box = ({ children, className = "", style = {} }) => {
	const theme = useContext(ThemeContext)

	return (
		<div style={{
			...style,
			background: theme.value === THEME_TYPE.DARK && "black"
		}}
			className={`box ${className}`}
		>
			{children}
		</div>
	);
}

export default Box;