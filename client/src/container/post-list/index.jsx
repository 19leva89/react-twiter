import { useEffect, Fragment, useReducer } from "react"
import { Alert, Skeleton } from "../../components/load"
import { getDate } from "../../utils/getDate"
import { requestInitialState, requestReducer, REQUEST_ACTION_TYPE } from "../../utils/request"
import Grid from "../../components/grid"
import Box from "../../components/box"
import Title from "../../components/title"
import PostCreate from "../post-create"
import PostItem from "../post-item"
import "./style.css"


const PostList = () => {
	const [state, dispatch] = useReducer(requestReducer, requestInitialState)

	const getData = async () => {
		dispatch({
			type: REQUEST_ACTION_TYPE.PROGRESS
		})

		try {
			const res = await fetch("http://localhost:4000/post-list", {
				method: "GET"
			})

			const data = await res.json()

			if (res.ok) {
				dispatch({
					type: REQUEST_ACTION_TYPE.SUCCESS,
					payload: convertData(data)
				})
			} else {
				dispatch({
					type: REQUEST_ACTION_TYPE.ERROR,
					payload: data.message
				})
			}

		} catch (err) {
			dispatch({
				type: REQUEST_ACTION_TYPE.ERROR,
				payload: err.message
			})
		}
	}

	const convertData = (raw) => ({
		list: raw.list.reverse().map(({ id, username, text, date }) => ({
			id,
			username,
			text,
			date: getDate(date)
		})),

		isEmpty: raw.list.length === 0
	})

	useEffect(() => {
		getData();

		// const intervalId = setInterval(() => getData(), 30000)

		// return () => {
		// 	clearInterval(intervalId)
		// }
	}, [])


	return (
		<Grid>
			<Box>
				<Grid>
					<Title>Home</Title>
					<PostCreate
						onCreate={getData}
						placeholder="What is Happening?!"
						button="Post"
					/>
				</Grid>
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

			{state.status === REQUEST_ACTION_TYPE.SUCCESS && (
				<Fragment>
					{state.data.isEmpty ? (
						<Alert message="Список постів пустий" />
					) : (
						state.data.list.map((item) => (
							<Fragment key={item.id}>
								<PostItem {...item} />
							</Fragment>
						))
					)}
				</Fragment>
			)}

		</Grid>
	);
}

export default PostList;