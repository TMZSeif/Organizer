import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import CreateChapterForm from '../components/CreateChapterForm'
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import CSRFToken from '../components/CSRFToken'
import Cookies from 'js-cookie'

const CreateChapterPage = () => {
	let [authenticated, setAuthenticated] = useState(false)

	useEffect(() => {
		checkAuthenticated()
	})

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

  return (
    <div>
		<Header authenticated={authenticated} />
		<CSRFToken />
		<Container>
			<Row className='align-items-center' style={{height: "80vh"}}>
				<Col className="form-container">
					<CreateChapterForm />
				</Col>
			</Row>
		</Container>
    </div>
  )
}

export default CreateChapterPage