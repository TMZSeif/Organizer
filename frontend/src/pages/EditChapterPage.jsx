import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import { Container, Row, Col } from 'react-bootstrap'
import { useParams } from 'react-router-dom'
import EditChapterForm from '../components/EditChapterForm'
import CSRFToken from '../components/CSRFToken'
import Cookies from 'js-cookie'

const EditChapterPage = () => {
	const {id} = useParams()
	let [chapter, setChapter] = useState({})
	let [authenticated, setAuthenticated] = useState(false)

	useEffect(() => {
		checkAuthenticated()
		getChapter()
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

	const getChapter = async () => {
		const response = await fetch(`/api/chapters/${id}`, {
			headers: {
				"Accept": "application/json",
				"X-CSRFToken": Cookies.get("csrftoken")
			}
		})
		const data = await response.json()
		setChapter(data)
	}

  return (
    <div>
		<Header authenticated={authenticated} />
		<CSRFToken />
		<Container>
			<Row className='align-items-center' style={{height: "80vh"}}>
				<Col className="form-container">
					<EditChapterForm chapter={chapter} />
				</Col>
			</Row>
		</Container>
    </div>
  )
}

export default EditChapterPage