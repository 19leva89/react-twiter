import { useReducer } from "react"
import { Alert, Loader } from "../../components/load"
import { requestInitialState, requestReducer, REQUEST_ACTION_TYPE } from "./../../util/request"
import Grid from "../../components/grid"
import FieldForm from "../../components/field-form"
import "./style.css"


const PostCreate = ({ onCreate, placeholder, button, id = null }) => {
	const [state, dispatch] = useReducer(requestReducer, requestInitialState)

	const handleSubmit = (value) => {
		return sendData({ value })
	}

	const sendData = async (dataToSend) => {
		dispatch({
			type: REQUEST_ACTION_TYPE.PROGRESS
		})

		try {
			const res = await fetch("http://localhost:4000/post-create", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: convertData(dataToSend)
			})

			const data = await res.json()

			if (res.ok) {
				dispatch({
					type: REQUEST_ACTION_TYPE.RESET
				})

				if (onCreate) {
					onCreate()
				} else {
					dispatch({
						type: REQUEST_ACTION_TYPE.ERROR,
						payload: data.message
					})
				}
			}

		} catch (err) {
			dispatch({
				type: REQUEST_ACTION_TYPE.ERROR,
				payload: err.message
			})
		}
	}

	const convertData = ({ value }) => {
		return JSON.stringify({
			text: value,
			username: "user",
			postId: id
		})
	}

	return (
		<Grid>
			<FieldForm
				placeholder={placeholder}
				button={button}
				onSubmit={handleSubmit}
			/>
			{state.status === REQUEST_ACTION_TYPE.ERROR && (<Alert status={state.status} message={state.message} />)}
			{state.status === REQUEST_ACTION_TYPE.PROGRESS && <Loader />}
		</Grid>
	);
}

export default PostCreate;