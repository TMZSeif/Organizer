import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import Cookies from 'js-cookie'
import { Col, Container, Row } from 'react-bootstrap'
import ChangePasswordForm from '../components/ChangePasswordForm'

const ChangePasswordPage = () => {
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
    if (response.status === 200) {
      setAuthenticated(true)
    }
  }

  return (
    <div>
      <Header authenticated={authenticated} />
      <Container>
        <Row className="align-items-center" style={{height: "80vh"}}>
          <Col className="form-container">
            <ChangePasswordForm />
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default ChangePasswordPage