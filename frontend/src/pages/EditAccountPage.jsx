import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import Cookies from 'js-cookie'
import EditAccountForm from '../components/EditAccountForm'
import { Alert, Col, Container, Row } from 'react-bootstrap'

const EditAccountPage = () => {
	let [authenticated, setAuthenticated] = useState(false)
	let [show, setShow] = useState(false)

	useEffect(() => {
		checkAuthenticated()
	}, [])

	const checkAuthenticated = async () => {
		const response = await fetch("/accounts/authenticated", {
			"Accept": "application/json",
			"X-CSRFToken": Cookies.get("csrftoken")
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
			<Alert variant="success" show={show} dismissible transition onClose={() => setShow(false)}>
				Your profile has been updated!
			</Alert>
			<Container>
				<Row className="align-items-center" style={{height: "80vh"}}>
					<Col className="form-container">
						<EditAccountForm setShow={setShow} />
					</Col>
				</Row>
			</Container>
    </div>
  )
}

export default EditAccountPage