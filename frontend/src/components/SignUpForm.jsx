import React, { useState } from 'react'
import { Button, Form, Spinner } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'

const SignUpForm = () => {
	let [name, setName] = useState("")
	let [email, setEmail] = useState("")
	let [password, setPassword] = useState("")
	let [rePassword, setRePassword] = useState("")
	let [isTeacher, setIsTeacher] = useState(false)
	let [code, setCode] = useState("")
	let [errors, setErrors] = useState({})
	let [sent, setSent] = useState(false)
	const navigate = useNavigate()

	const handleNameChange = event => {
		setName(event.target.value)
	}

	const handleEmailChange = event => {
		setEmail(event.target.value)
	}

	const handlePasswordChange = event => {
		setPassword(event.target.value)
	}

	const handleRePasswordChange = event => {
		setRePassword(event.target.value)
	}

	const handleIsTeacherChange = event => {
		setIsTeacher(!isTeacher)
	}

	const handleCodeChange = event => {
		setCode(event.target.value)
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
		const response = await fetch("/accounts/register/", {
			method: "POST",
			headers: {
				"Accept": "application/json",
				"Content-Type": "application/json",
				"X-CSRFToken": Cookies.get("csrftoken")
			},
			body: JSON.stringify({
				name: name,
				email: email,
				password: password,
				re_password: rePassword,
				is_teacher: isTeacher,
				school_code: code
			})
		})
		const data = await response.json()
		if (response.status === 400) {
			if (data.error === "User already exists with that email") {
				return {email: data.error}
			} else if (data.error === "School code does not match") {
				return {code: data.error}
			} else if (data.error === "User already exists with that name") {
				return {name: data.error}
			}
		} else if (response.status === 500) {
			return {server: data.error}
		}
		return {}
	}

	const validateClientSide = () => {
		let newErrors = {}
		if (name.length < 3) {
			newErrors.name = "Name must be greater than 2 characters"
		} else if (name.length > 255) {
			newErrors.name = "Name must be less than 255 characters"
		}
		if (email.length < 10) {
			newErrors.email = "Email must be greater than 10 characters"
		} else if (email.length > 255) {
			newErrors.email = "Email must be less than 255 characters"
		}
		if (!validatePassword()) {
			newErrors.password = "Password must contain at least one letter and one number"
		}
		if (!validateEmail()) {
			newErrors.email = "Please enter a valid email address"
		}
		if (password !== rePassword) {
			newErrors.rePassword = "Passwords do not match"
		}
		if (code.length > 10) {
			newErrors.code = "School code is incorrect"
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
				navigate("/activate")
			}
		} else {
			event.preventDefault()
			event.stopPropagation()
		}
		setSent(false)
	}

  return (
    <Form noValidate onSubmit={handleSubmit}>
			<Form.Control.Feedback type="invalid">{errors.server}</Form.Control.Feedback>
      <Form.Group className="mb-3">
				<Form.Label>Name</Form.Label>
				<Form.Control isInvalid={!!errors.name} value={name} onChange={handleNameChange} required type="text" placeholder="John Smith" />
				<Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
			</Form.Group>
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
			<Form.Group className="mb-3">
				<Form.Label>Retype Password</Form.Label>
				<Form.Control isInvalid={!!errors.rePassword} value={rePassword} onChange={handleRePasswordChange} required type="password" />
				<Form.Control.Feedback type="invalid">{errors.rePassword}</Form.Control.Feedback>
			</Form.Group>
			<Form.Check checked={isTeacher} onChange={handleIsTeacherChange} type="switch" name="isTeacher" label="Is Teacher?" />
			<Form.Group className="mb-3">
				<Form.Label>School Code</Form.Label>
				<Form.Control isInvalid={!!errors.code} value={code} onChange={handleCodeChange} required type="text" />
				<Form.Control.Feedback type="invalid">{errors.code}</Form.Control.Feedback>
			</Form.Group>
			{sent ? <Spinner animation="border" /> : <Button variant="success" type="submit">Register</Button>}
    </Form>
  )
}

export default SignUpForm