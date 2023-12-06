import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import CSRFToken from '../components/CSRFToken'
import Cookies from 'js-cookie'
import LoginForm from '../components/LoginForm'
import { Col, Container, Row } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

const LoginPage = () => {
	let [authenticated, setAuthenticated] = useState(false)
	let navigate = useNavigate()

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
		} else if (response.status === 200) {
			setAuthenticated(true)
			navigate("/")
		}
	}

  return (
    <div>
        <Header authenticated={authenticated} />
				<CSRFToken />
				<Container>
					<Row className="align-items-center" style={{height: "80vh"}}>
						<Col className="form-container">
							<LoginForm />
						</Col>
					</Row>
				</Container>
    </div>
  )
}

export default LoginPage