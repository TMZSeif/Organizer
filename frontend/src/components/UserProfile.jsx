import Cookies from 'js-cookie'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Image, Stack } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen } from '@fortawesome/free-solid-svg-icons'
import DeleteAccountOverlay from './DeleteAccountOverlay'

const UserProfile = () => {
	let [user, setUser] = useState({})

	useEffect(() => {
		getUser()
	}, [])

	const getUser = async () => {
		const response = await fetch("/accounts/user", {
			"Accept": "application/json",
			"X-CSRFToken": Cookies.get("csrftoken")
		})
		const data = await response.json()
		if (response.status === 200) {
			setUser(data)
		}
	}

  return (
    <Stack className="align-items-center" gap={3}>
			<Image className="profile-picture" src={"http://127.0.0.1:8000"+user.picture} roundedCircle />
			<div className="profile-item-container">
				<h4>Name: </h4>
				<div>
					<h5 className="profile-item">{user.name}</h5>
					<Link to="/user/edit"><FontAwesomeIcon icon={faPen} /></Link>
				</div>
			</div>
			<div className="profile-item-container">
				<h4>Email: </h4>
				<div>
					<h5 className="profile-item">{user.email}</h5>
					<Link to="/user/edit"><FontAwesomeIcon icon={faPen} /></Link>
				</div>
			</div>
			<div className="profile-item-container">
				<h4>Role: </h4>
				<div>
					<h5 className="profile-item">{user.isTeacher ? "Teacher" : "Student"}</h5>
					<Link to="/user/edit"><FontAwesomeIcon icon={faPen} /></Link>
				</div>
			</div>
			<DeleteAccountOverlay />
		</Stack>
  )
}

export default UserProfile