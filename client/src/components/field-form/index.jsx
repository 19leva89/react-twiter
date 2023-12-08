import { memo, useContext, useState } from "react";
import { ThemeContext } from "../../App";
import "./style.css"

const FieldForm = ({ placeholder, button, onSubmit }) => {
	const [value, setValue] = useState("")

	const handleChange = (e) => setValue(e.target.value)

	const handleSubmit = () => {
		if (value.length === 0) {
			return null
		}

		if (onSubmit) {
			onSubmit(value)
		} else {
			throw new Error('onSubmit props is undefined')
		}

		setValue("")
	}

	const isDisabled = value.length === 0

	const theme = useContext(ThemeContext)

	return (
		<div className="field-form">
			<textarea
				onChange={handleChange}
				value={value}
				rows={2}
				placeholder={placeholder}
				className="field-form__field"
			></textarea>
			<button
				disabled={isDisabled}
				onClick={handleSubmit}
				className="field-form__button"
			>
				{button}
			</button>
			<button
				onClick={theme.toggle}
				className={`field-form__button`}
			>
				Change theme
			</button>
		</div>
	)
}

export default memo(FieldForm);