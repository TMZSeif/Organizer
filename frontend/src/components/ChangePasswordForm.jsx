import React, { useState } from 'react'
import { Button, Form, Spinner } from 'react-bootstrap'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'

const ChangePasswordForm = () => {
  let [password, setPassword] = useState("")
  let [rePassword, setRePassword] = useState("")
  let [error, setError] = useState({})
  let [sent, setSent] = useState(false)
  const navigate = useNavigate()

  const handlePasswordChange = event => {
    setPassword(event.target.value)
  }

  const handleRePasswordChange = event => {
    setRePassword(event.target.value)
  }

	const validatePassword = () => {
		const regex = /^(?=.*\d)(?=.*[a-zA-Z])[a-zA-Z0-9!#$%&?*^@"]{8,}$/
		return regex.test(password)
	}

	const validateServerSide = async () => {
		const response = await fetch("/accounts/change-password/", {
			method: "POST",
			headers: {
				"Accept": "application/json",
				"Content-Type": "application/json",
				"X-CSRFToken": Cookies.get("csrftoken")
			},
			body: JSON.stringify({
				password: password,
				rePassword: rePassword
			})
		})
		const data = await response.json()
		if (response.status === 400) {
			return {rePassword: data.error}
		}
		return {}
	}

	const validateClientSide = () => {
		let newError = {}
		if (!validatePassword()) {
			newError.password = "Password must contain at least one letter and one number"
		}
		return newError
	}

	const handleSubmit = async event => {
    setSent(true)
		const newError = validateClientSide()
		setError(newError)
		if (Object.keys(newError).length === 0) {
			event.preventDefault()
			event.stopPropagation()
			const serverError = await validateServerSide()
			setError(serverError)
			if (Object.keys(serverError).length === 0)  {
				navigate("/verify")
			}
      setSent(false)
		} else {
			event.preventDefault()
			event.stopPropagation()
      setSent(false)
		}
	}

  return (
    <Form noValidate onSubmit={handleSubmit}>
      <Form.Group>
        <Form.Label>Password</Form.Label>
        <Form.Control isInvalid={!!error.password} value={password} onChange={handlePasswordChange} type="password" />
        <Form.Control.Feedback type="invalid">{error.password}</Form.Control.Feedback>
      </Form.Group>
      <Form.Group>
        <Form.Label>Retype Password</Form.Label>
        <Form.Control isInvalid={!!error.rePassword} value={rePassword} onChange={handleRePasswordChange} type="password" />
        <Form.Control.Feedback type="invalid">{error.rePassword}</Form.Control.Feedback>
      </Form.Group>
      {sent ? <Spinner animation="border" /> : <Button type="submit" variant="success">Change Password</Button>}
    </Form>
  )
}

export default ChangePasswordForm