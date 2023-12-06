import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDownload } from '@fortawesome/free-solid-svg-icons'
import Cookies from 'js-cookie'

const PostItem = props => {

	const handlePost = post => {
		if (post.text) {
			return post.text
		} else if (post.file) {
			return post.file.split("/").at(-1)
		}
	}

	const downloadFile = async () => {
		const response = await fetch(`/api/download?url=${props.post.file}`, {
			headers: {
				"X-CSRFToken": Cookies.get("csrftoken")
			}
		})
		if (response.status !== 200) return
		const data = await response.blob()
		const url = window.URL.createObjectURL(data)
		let anchor = document.createElement("a")
		anchor.href = url
		anchor.download = props.post.file.split("/").at(-1)
		anchor.click()
		window.URL.revokeObjectURL(url)
		document.removeEl(anchor)
	}

	return (
		<div className="post-container">
			<span className="post-date">{props.post.date}</span>
			<span className="post-text">{handlePost(props.post)}{props.post.file ? <span onClick={downloadFile} className="post-download"><FontAwesomeIcon size="lg" icon={faDownload} /></span> : undefined}</span>
		</div>
	)
}

export default PostItem