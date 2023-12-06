import React from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'

const CreateChapterForm = () => {
	let [validated, setValidated] = useState(false)
	const navigate = useNavigate()

	const createChapter = async name => {
		fetch("/api/chapters/create/", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Accept": "application/json",
				"X-CSRFToken": Cookies.get("csrftoken")
			},
			body: JSON.stringify({
				name: name
			})
		})
	}

	const handleSubmit = event => {
		const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    } else {
			createChapter(event.target.chapterName.value)
			navigate("/")
		}

    setValidated(true);
	}

	return (
		<Form noValidate validated={validated} onSubmit={handleSubmit}>
			<Form.Group className="mb-3">
				<Form.Label htmlFor="chapterNameForm">Chapter Name</Form.Label>
				<Form.Control name="chapterName" maxLength={50} required aria-describedby="formHelp" id="chapterNameForm" type="text" placeholder="Enter Chapter Name Here." />
				<Form.Control.Feedback type="invalid">Chapter Name must be under 50 characters</Form.Control.Feedback>
				<Form.Text id="formHelp">Must be under 50 characters</Form.Text>
			</Form.Group>
			<Button variant="success" type="submit">Submit</Button>
		</Form>
	)
}

export default CreateChapterForm