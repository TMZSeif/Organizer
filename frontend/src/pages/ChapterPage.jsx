import React from 'react'
import Header from '../components/Header'
import PostList from '../components/PostList'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import CSRFToken from '../components/CSRFToken'
import Cookies from 'js-cookie'

const ChapterPage = () => {
	const {id} = useParams()
	let [chapter, setChapter] = useState({});
	let [posts, setPosts] = useState([])
	let [authenticated, setAuthenticated] = useState(false)

	useEffect(() => {
		checkAuthenticated()
		getChapter()
		getPosts()
	}, [])

	const checkAuthenticated = async () => {
		const response = await fetch("/accounts/authenticated", {
			headers: {
				"Accept": "application/json",
				"X-CSRFToken": Cookies.get("csrftoken")
			}
		})
		if (response.status === 403) {
			setAuthenticated(false)
			navigate("/register")
		}
		setAuthenticated(true)
	}

	const getPosts = async () => {
		let response = await fetch(`/api/chapters/${id}/posts`, {
			headers: {
				"Accept": "application/json",
				"X-CSRFToken": Cookies.get("csrftoken")
			}
		})
		let data = await response.json()
		setPosts(data)
	}

	const getChapter = async () => {
		let response = await fetch(`/api/chapters/${id}`, {
			headers: {
				"Accept": "application/json",
				"X-CSRFToken": Cookies.get("csrftoken")
			}
		})
		let data = await response.json()
		setChapter(data)
	}

	document.documentElement.style.setProperty("--post-number", posts.length)

	return (
		<>
			<Header authenticated={authenticated} chapter={chapter.name} />
			<CSRFToken />
			<PostList getPosts={getPosts} posts={posts} />
		</>
	)
}

export default ChapterPage