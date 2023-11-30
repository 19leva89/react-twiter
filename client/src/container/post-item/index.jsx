import { useState, useEffect, Fragment } from "react"
import { Alert, Skeleton, LOAD_STATUS } from "../../components/load"
import { getDate } from "../../util/getDate"
import Box from "../../components/box"
import Grid from "../../components/grid"
import PostContent from "../../components/post-content"
import PostCreate from "../post-create"
import "./style.css"


const PostItem = ({ id, username, text, date }) => {
	const [data, setData] = useState({
		id,
		username,
		text,
		date,
		reply: null
	})

	const [status, setStatus] = useState(null)
	const [message, setMessage] = useState("")

	const getData = async () => {
		setStatus(LOAD_STATUS.PROGRESS)

		try {
			const res = await fetch(`http://localhost:4000/post-item?id=${data.id}`, {
				method: "GET"
			})

			const resData = await res.json()

			if (res.ok) {
				setData(convertData(resData))
				setStatus(LOAD_STATUS.SUCCESS)
			} else {
				setMessage(resData.message)
				setStatus(LOAD_STATUS.ERROR)
			}

		} catch (err) {
			setMessage(err.message)
			setStatus(LOAD_STATUS.ERROR)
		}
	}

	const convertData = (raw) => ({
		id: raw.post.id,
		username: raw.post.username,
		text: raw.post.text,
		date: raw.post.date,

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
					username={data.username}
					date={data.date}
					text={data.text}
				/>
			</div>

			{isOpen && (
				<div style={{ padding: "0 20px 20px 20px" }}>
					<Grid>
						<Box >
							<PostCreate
								placeholder="Post your reply!"
								button="Reply"
								id={data.id}
								onCreate={getData}
							/>
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

						{status === LOAD_STATUS.SUCCESS &&
							data.isEmpty === false &&
							data.reply.map((item) => (
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