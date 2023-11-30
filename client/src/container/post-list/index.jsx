import { useState, useEffect, Fragment } from "react"
import { Alert, Skeleton, LOAD_STATUS } from "../../components/load"
import { getDate } from "../../util/getDate"
import Grid from "../../components/grid"
import Box from "../../components/box"
import Title from "../../components/title"
import PostCreate from "../post-create"
import PostItem from "../post-item"
import "./style.css"

const PostList = () => {
	const [status, setStatus] = useState(null)
	const [message, setMessage] = useState("")
	const [data, setData] = useState(null)

	const getData = async () => {
		setStatus(LOAD_STATUS.PROGRESS)

		try {
			const res = await fetch("http://localhost:4000/post-list", {
				method: "GET"
			})

			const data = await res.json()

			if (res.ok) {
				setData(convertData(data))
				setStatus(LOAD_STATUS.SUCCESS)
			} else {
				setMessage(data.message)
				setStatus(LOAD_STATUS.ERROR)
			}

		} catch (err) {
			setMessage(err.message)
			setStatus(LOAD_STATUS.ERROR)
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

		const intervalId = setInterval(() => getData(), 30000)

		return () => {
			clearInterval(intervalId)
		}
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

			{status === LOAD_STATUS.PROGRESS && (
				<Fragment>
					<Box>
						<Skeleton />
					</Box>
					<Box>
						<Skeleton />
					</Box>
				</Fragment>
			)}

			{status === LOAD_STATUS.ERROR && (
				<Alert status={status} message={message} />
			)}

			{status === LOAD_STATUS.SUCCESS && (
				<Fragment>
					{data.isEmpty ? (
						<Alert message="Список постів пустий" />
					) : (
						data.list.map((item) => (
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