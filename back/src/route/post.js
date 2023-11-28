// Підключаємо роутер до бек-енду
const express = require('express')
const router = express.Router()

const { Post } = require('../class/post')

// ==============================================================

router.post('/post-create', function (req, res) {
	try {
		const { username, text, postId } = req.body

		if (!username || !text) {
			return res.status(400).json({
				message: 'Потрібно передати всі дані для створення поста'
			})
		}

		let post = null

		console.log(postId, 'postId')

		if (postId) {
			post = Post.getById(Number(postId))
			console.log(post, 'post')

			if (!post) {
				return res.status(400).json({
					message: 'Пост з таким ID не існує'
				})
			}
		}

		const newPost = Post.create(username, text, post)

		return res.status(200).json({
			post: {
				id: newPost.id,
				text: newPost.text,
				username: newPost.username,
				date: newPost.date
			}
		})

	} catch (err) {
		return res.status(400).json({
			message: err.message
		})
	}
})

router.get('/post-list', function (req, res) {
	try {
		const list = Post.getList()

		if (list.length === 0) {
			return res.status(200).json({
				list: []
			})
		}

		return res.status(200).json({
			list: list.map(({ id, username, text, date }) => ({
				id,
				username,
				text,
				date
			})),
		})

	} catch (err) {
		return res.status(400).json({
			message: err.message
		})
	}
})

// Експортуємо глобальний роутер
module.exports = router