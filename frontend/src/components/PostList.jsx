import React, { useEffect, useState } from 'react'
import Container from 'react-bootstrap/Container'
import PostListForm from './PostListForm'
import PostItem from './PostItem'
import Cookies from 'js-cookie'

const PostList = props => {
	let [teacher, setTeacher] = useState()

	useEffect(() => {
		checkTeacher()
	}, [])

	const checkTeacher = async () => {
		const response = await fetch("/accounts/user?" + new URLSearchParams({
			data_requested: "is_teacher"
		}), {
			headers: {
				"Accept": "application/json",
				"X-CSRFToken": Cookies.get("csrftoken")
			}
		})
		const data = await response.json()
		if (response.status === 200) {
			setTeacher(data.isTeacher)
		}
	}

	return (
		<Container className="post-list">
			{
				props.posts.map((post, idx) => {
					return <PostItem post={post} key={idx} />
				})
			}
			{teacher ? <PostListForm getPosts={props.getPosts} /> : undefined}
		</Container>
	)
}

export default PostList