import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import SignUpForm from '../components/SignUpForm'
import { Col, Container, Row } from 'react-bootstrap'
import CSRFToken from '../components/CSRFToken'
import Cookies from 'js-cookie'

const SignUpPage = () => {
	let [authenticated, setAuthenticated] = useState(false)

	useEffect(() => {
		checkAuthenticated()
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
		} else {
			setAuthenticated(true)
		}
	}

  return (
    <div>
		<Header authenticated={authenticated} />
		<CSRFToken />
		<Container>
			<Row className="align-items-center" style={{height: "80vh"}}>
				<Col className="form-container">
					<SignUpForm />
				</Col>
			</Row>
		</Container>
    </div>
  )
}

export default SignUpPage