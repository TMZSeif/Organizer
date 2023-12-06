import React, { useState } from 'react'
import { Button, Form, Spinner } from 'react-bootstrap'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'

const ChangeEmailForm = () => {
  let [email, setEmail] = useState("")
  let [error, setError] = useState("")
  let [sent, setSent] = useState(false)
  const navigate = useNavigate()

  const handleEmailChange = event => {
    setEmail(event.target.value)
  }

	const validateEmail = () => {
		const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
		return regex.test(email)
	}

	const validateServerSide = async () => {
		const response = await fetch("/accounts/change-email/", {
			method: "POST",
			headers: {
				"Accept": "application/json",
				"Content-Type": "application/json",
				"X-CSRFToken": Cookies.get("csrftoken")
			},
			body: JSON.stringify({
				email: email
			})
		})
		const data = await response.json()
		if (response.status === 400) {
			return data.error
		}
		return null
	}

	const validateClientSide = () => {
		let newError = ""
		if (email.length < 10) {
			newError = "Email must be greater than 10 characters"
		} else if (email.length > 255) {
			newError = "Email must be less than 255 characters"
		}
		if (!validateEmail()) {
			newError = "Please enter a valid email address"
		}
		return newError
	}

	const handleSubmit = async event => {
    setSent(true)
		const newError = validateClientSide()
		setError(newError)
		if (newError === "") {
			event.preventDefault()
			event.stopPropagation()
			const serverError = await validateServerSide()
      console.log("hello")
			setError(serverError)
			if (!serverError)  {
				navigate("/activate")
			}
      setSent(false)
      print("Sent", sent)
		} else {
			event.preventDefault()
			event.stopPropagation()
      setSent(false)
		}
	}

  return (
    <Form noValidate onSubmit={handleSubmit}>
      <Form.Group>
        <Form.Label>Email Address</Form.Label>
        <Form.Control isInvalid={!!error} value={email} onChange={handleEmailChange} type="email" />
        <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
      </Form.Group>
      {sent ? <Spinner animation="border" /> : <Button type="submit" variant="success">Change Email</Button>}
    </Form>
  )
}

export default ChangeEmailForm