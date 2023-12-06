import React, { useEffect, useState } from 'react'
import { ListGroup } from 'react-bootstrap'
import EditChapter from './EditChapter'
import Cookies from 'js-cookie'

const ChapterList = () => {
  
	let [chapters, setChapters] = useState([])

	useEffect(() => {
		getChapters()
	}, [])

	const getChapters = async () => {
		const response = await fetch("/api/chapters", {
			headers: {
				"Accept": "application/json",
				"X-CSRFToken": Cookies.get("csrftoken")
			}
		})
		const data = await response.json()
		setChapters(data)
	}

  return (
    <ListGroup gap={2}>
		{chapters.map((chapter, idx) => <EditChapter getChapters={getChapters} chapter={chapter} key={idx} />)}
	</ListGroup>
  )
}

export default ChapterList