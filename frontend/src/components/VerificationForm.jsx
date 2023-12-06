import Cookies from 'js-cookie'
import React, { useState } from 'react'
import { Button, Form, Spinner } from 'react-bootstrap'

const VerificationForm = props => {
	let [email, setEmail] = useState("")
	let [password, setPassword] = useState("")
	let [errors, setErrors] = useState({})
	let [sent, setSent] = useState(false)

	const handleEmailChange = event => {
		setEmail(event.target.value)
	}

	const handlePasswordChange = event => {
		setPassword(event.target.value)
	}

	const validatePassword = () => {
		const regex = /^(?=.*\d)(?=.*[a-zA-Z])[a-zA-Z0-9!#$%&?*^@"]{8,}$/
		return regex.test(password)
	}

	const validateEmail = () => {
		const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
		return regex.test(email)
	}

	const validateServerSide = async () => {
		const response = await fetch("/accounts/login/", {
			method: "POST",
			headers: {
				"Accept": "application/json",
				"Content-Type": "application/json",
				"X-CSRFToken": Cookies.get("csrftoken")
			},
			body: JSON.stringify({
				email: email,
				password: password
			})
		})
		const data = await response.json()
		if (response.status === 400) {
			return {email: data.error, password: data.error}
		}
		if (response.status === 500) {
			return {server: data.error}
		}
		return {}
	}

	const validateClientSide = () => {
		let newErrors = {}
		if (email.length < 10) {
			newErrors.email = "Email must be greater than 10 characters"
		} else if (email.length > 255) {
			newErrors.email = "Email must be less than 255 characters"
		} else if (!validateEmail()) {
			newErrors.email = "Please enter a valid email address"
		}
		if (!validatePassword()) {
			newErrors.password = "Password must contain at least one letter and one number"
		}
		return newErrors
	}

	const handleSubmit = async event => {
		setSent(true)
		const newErrors = validateClientSide()
		setErrors(newErrors)
		if (Object.keys(newErrors).length === 0) {
			event.preventDefault()
			event.stopPropagation()
			const serverErrors = await validateServerSide()
			setErrors(serverErrors)
			if (Object.keys(serverErrors).length === 0)  {
				props.callback()
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
			<Form.Control.Feedback type="invalid">{errors.server}</Form.Control.Feedback>
      <Form.Group className="mb-3">
				<Form.Label>Email Address</Form.Label>
				<Form.Control isInvalid={!!errors.email} value={email} onChange={handleEmailChange} required type="email" placeholder="name@example.com" />
				<Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
			</Form.Group>
			<Form.Group className="mb-3">
				<Form.Label>Password</Form.Label>
				<Form.Control isInvalid={!!errors.password} value={password} onChange={handlePasswordChange} required type="password" />
				<Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
			</Form.Group>
			{sent ? <Spinner animation="border" /> : <Button variant={props.type} type="submit">{props.text}</Button>}
      <Button variant="secondary" onClick={props.handleClose} type="button">Close</Button>
    </Form>
  )
}

export default VerificationForm