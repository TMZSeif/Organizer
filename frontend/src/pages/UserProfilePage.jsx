import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'
import UserProfile from '../components/UserProfile'
import { Col, Container, Row } from 'react-bootstrap'

const UserProfilePage = () => {
	let [authenticated, setAuthenticated] = useState(false)
  const navigate = useNavigate()

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
      navigate("/register")
    } else {
      setAuthenticated(true)
    }
  }

  return (
    <div>
      <Header authenticated={authenticated} />
      <Container>
        <Row className="align-items-center" style={{height: "80vh"}}>
          <Col className="form-container">
            <UserProfile />
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default UserProfilePage