import React from 'react'
import { Form, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import Cookies from 'js-cookie'

const EditChapterForm = props => {
	let [validated, setValidated] = useState(false)
	let navigate = useNavigate()

	const createChapter = async name => {
		fetch(`/api/chapters/${props.chapter.id}/update/`, {
			method: "PUT",
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
			<Form.Label htmlFor="chapterNameForm">Edit Chapter Name</Form.Label>
			<Form.Control defaultValue={props.chapter.name} name="chapterName" maxLength={50} required aria-describedby="formHelp" id="chapterNameForm" type="text" placeholder="Enter Chapter Name Here." />
			<Form.Control.Feedback type="invalid">Chapter Name must be under 50 characters</Form.Control.Feedback>
			<Form.Text id="formHelp">Must be under 50 characters</Form.Text>
		</Form.Group>
		<Button variant="success" type="submit">Submit</Button>
	</Form>
  )
}

export default EditChapterForm