import { useState, useEffect, Fragment, useReducer, useCallback } from "react"
import { Alert, Skeleton } from "../../components/load"
import { getDate } from "../../utils/getDate"
import { requestInitialState, requestReducer, REQUEST_ACTION_TYPE } from "../../utils/request"

import Box from "../../components/box"
import Grid from "../../components/grid"
import PostContent from "../../components/post-content"
import PostCreate from "../post-create"
import "./style.css"


const PostItem = ({ id, username, text, date }) => {
	const [state, dispatch] = useReducer(
		requestReducer,
		requestInitialState,
		(state) => ({ ...state, data: { id, username, text, date, reply: null } })
	)

	const getData = useCallback(async () => {
		dispatch({ type: REQUEST_ACTION_TYPE.PROGRESS })

		try {
			const res = await fetch(`http://localhost:4000/post-item?id=${state.data.id}`, {
				method: "GET"
			})

			const resData = await res.json()

			if (res.ok) {
				dispatch({
					type: REQUEST_ACTION_TYPE.SUCCESS,
					payload: convertData(resData)
				})
			} else {
				dispatch({
					type: REQUEST_ACTION_TYPE.ERROR,
					payload: resData.message
				})
			}

		} catch (err) {
			dispatch({
				type: REQUEST_ACTION_TYPE.ERROR,
				payload: err.message
			})
		}
	}, [state.data.id])

	const convertData = (raw) => ({
		id: raw.post.id,
		username: raw.post.username,
		text: raw.post.text,
		date: getDate(raw.post.date),

		reply: raw.post.reply.reverse().map(({ id, username, text, date }) => ({
			id,
			username,
			text,
			date: getDate(date)
		})),

		isEmpty: raw.post.reply.length === 0
	})

	const [isOpen, setOpen] = useState(false)

	const handleOpen = () => {
		setOpen(!isOpen)
	}

	useEffect(() => {
		if (isOpen === true) {
			getData()
		}
	}, [isOpen])

	return (
		<Box style={{ padding: "0" }}>
			<div
				style={{
					padding: "20px",
					cursor: "pointer"
				}}
				onClick={handleOpen}
			>
				<PostContent
					username={state.data.username}
					date={state.data.date}
					text={state.data.text}
				/>
			</div>

			{isOpen && (
				<div style={{ padding: "0 20px 20px 20px" }}>
					<Grid>
						<Box >
							<PostCreate
								placeholder="Post your reply!"
								button="Reply"
								id={state.data.id}
								onCreate={getData}
							/>
						</Box>

						{state.status === REQUEST_ACTION_TYPE.PROGRESS && (
							<Fragment>
								<Box>
									<Skeleton />
								</Box>
								<Box>
									<Skeleton />
								</Box>
							</Fragment>
						)}

						{state.status === REQUEST_ACTION_TYPE.ERROR && (
							<Alert status={state.status} message={state.message} />
						)}

						{state.status === REQUEST_ACTION_TYPE.SUCCESS &&
							state.data.isEmpty === false &&
							state.data.reply.map((item) => (
								<Fragment key={item.id}>
									<Box>
										<PostContent {...item} />
									</Box>
								</Fragment>
							))
						}

					</Grid>
				</div>
			)}

		</Box>
	);
}

export default PostItem;