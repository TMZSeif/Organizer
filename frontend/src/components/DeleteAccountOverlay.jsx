import React, { useState } from 'react'
import { Button, Modal } from 'react-bootstrap'
import VerificationForm from './VerificationForm'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'

const DeleteAccountOverlay = () => {
	let [show, setShow] = useState(false)
	const navigate = useNavigate()

	const handleShow = () => setShow(true)
	const handleClose = () => setShow(false)

	const deleteAccount = async () => {
		await fetch("/accounts/delete", {
			method: "DELETE",
			headers: {
				"Accept": "application/json",
				"X-CSRFToken": Cookies.get("csrftoken")
			}
		})
		handleClose()
		Cookies.remove("sessionid")
		navigate("/register")
	}

  return (
    <>
      <Button variant="danger" type="button" onClick={handleShow}>Delete Account</Button>
			<Modal show={show} onHide={handleClose} backdrop="static" keyboard="false">
				<Modal.Header>
					Please Verify by inputting your email and password
				</Modal.Header>
				<Modal.Body>
					<VerificationForm text={"Delete Account"} type={"danger"} callback={deleteAccount} handleClose={handleClose} />
				</Modal.Body>
			</Modal>
		</>
  )
}

export default DeleteAccountOverlay