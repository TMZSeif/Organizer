import Cookies from 'js-cookie'
import React, { useEffect, useState } from 'react'
import { Button, Form, Image } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import ChangeEmailOverlay from './ChangeEmailOverlay'
import ChangePasswordOverlay from './ChangePasswordOverlay'

const EditAccountForm = props => {
  let [user, setUser] = useState({})
  let [picture, setPicture] = useState()
  let [name, setName] = useState("")
  let [teacher, setTeacher] = useState()
  let [code, setCode] = useState("")
  let [errors, setErrors] = useState({})
  let form = new FormData()

  useEffect(() => {
    getUser()
  }, [])

  useEffect(() => {
    getPicture()
    setName(user.name)
    setTeacher(user.isTeacher)
    if (user.isTeacher) {
      setCode("ABCDEFt")
    } else {
      setCode("ABCDEF")
    }
  }, [user])

  const handlePictureChange = event => {
    setPicture(event.target.files[0])
  }

  const handleNameChange = event => {
    setName(event.target.value)
  }

  const handleTeacherChange = event => {
    setTeacher(!teacher)
  }

  const handleCodeChange = event => {
    setCode(event.target.value)
  }

  const getPicture = async () => {
    const response = await fetch("/accounts/picture", {
      headers: {
        "Accept": "application/json",
        "X-CSRFToken": Cookies.get("csrftoken")
      }
    })
    if (response.status !== 200) return
    const data = await response.blob()
    let fileName = user.picture.split("/")
    fileName = fileName[fileName.length - 1]
    let fileExtension = fileName.split(".")
    fileExtension = fileExtension[fileExtension.length - 1]
    const file = new File([data], fileName, {type: `image/${fileExtension}`, lastModified: new Date().getTime()}, "utf-8")
    const container = new DataTransfer()
    container.items.add(file)
    setPicture(file)
    document.getElementById("profile-picture").files = container.files
  }

  const getUser = async () => {
    const response = await fetch("/accounts/user", {
      headers: {
        "Accept": "application/json",
        "X-CSRFToken": Cookies.get("csrftoken")
      }
    })
    const data = await response.json()
    if (response.status === 200) {
      setUser(data)
    }
  }

  const validateServerSide = async () => {
		const response = await fetch("/accounts/update/", {
			method: "POST",
			headers: {
				"Accept": "application/json",
				"X-CSRFToken": Cookies.get("csrftoken")
			},
			body: form
		})
		const data = await response.json()
		if (response.status === 400) {
      console.log(data)
			if (data.error === "User already exists with that name") {
				return {name: data.error}
			} else if (data.error === "School code does not match") {
				return {code: data.error}
			}
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
		if (code.length > 10) {
			newErrors.code = "School code is incorrect"
		}
		return newErrors
	}

  const handleSubmit = async event => {
		form.append("picture", picture)
    form.append("name", name)
    form.append("teacher", teacher)
    form.append("code", code)
		const newErrors = validateClientSide()
		setErrors(newErrors)
		if (Object.keys(newErrors).length === 0) {
			event.preventDefault()
			event.stopPropagation()
			const serverErrors = await validateServerSide()
			setErrors(serverErrors)
			if (Object.keys(serverErrors).length === 0)  {
        getUser()
        props.setShow(true)
			}
		} else {
			event.preventDefault()
			event.stopPropagation()
		}
	}

  return (
    <Form noValidate onSubmit={handleSubmit}>
      <div>
        <h5>Preview</h5>
        <Image roundedCircle src={"http://127.0.0.1:8000"+user.picture} className="profile-picture" />
        <Image roundedCircle src={"http://127.0.0.1:8000"+user.picture} className="header-picture" />
      </div>
      <Form.Group>
        <Form.Label>Choose new profile picture</Form.Label>
        <Form.Control accept="image/*" onChange={handlePictureChange} id="profile-picture" type="file" />
      </Form.Group>
      <Form.Group>
        <Form.Label>Name</Form.Label>
        <Form.Control isInvalid={!!errors.name} onChange={handleNameChange} value={name} type="text" />
        <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
      </Form.Group>
      <Form.Check onChange={handleTeacherChange} checked={teacher} type="switch" label="isTeacher" />
      <Form.Group>
        <Form.Label>School Code</Form.Label>
        <Form.Control isInvalid={!!errors.code} onChange={handleCodeChange} type="text" value={code} placeholder="School code" />
        <Form.Control.Feedback type="invalid">{errors.code}</Form.Control.Feedback>
      </Form.Group>
      <ChangeEmailOverlay />
      <ChangePasswordOverlay />
      <Button variant="success" type="submit">Update Profile</Button>
    </Form>
  )
}

export default EditAccountForm