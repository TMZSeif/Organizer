import React, { useState } from 'react'
import { Modal } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import VerificationForm from './VerificationForm'

const ChangeEmailOverlay = () => {
  let [show, setShow] = useState(false)
  const navigate = useNavigate()

  const handleShow = () => setShow(true)
  const handleClose = () => setShow(false)

  const handleVerification = async () => {
    navigate("/user/change-email")
  }

  return (
    <>
      <p onClick={handleShow} className="change-email">Change your email address</p>
      <Modal show={show} onHide={handleClose} backdrop="static" keyboard="false">
        <Modal.Header>
          Please verify by inputting your email and password
        </Modal.Header>
        <Modal.Body>
          <VerificationForm text={"Change email"} type={"primary"} callback={handleVerification} handleClose={handleClose} />
        </Modal.Body>
      </Modal>
    </>
  )
}

export default ChangeEmailOverlay