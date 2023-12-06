import React, { useState } from 'react'
import { Modal } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import ResetVerificationForm from './ResetVerificationForm'

const ResetPasswordOverlay = () => {
  let [show, setShow] = useState(false)
  const navigate = useNavigate()

  const handleShow = () => setShow(true)
  const handleClose = () => setShow(false)

  const handleVerification = async () => {
    navigate("/user/reset-password")
  }

  return (
    <>
      <p onClick={handleShow} className="change-email">Forgot password?</p>
      <Modal show={show} onHide={handleClose} backdrop="static" keyboard="false">
        <Modal.Header>
          Please input your email and new password
        </Modal.Header>
        <Modal.Body>
          <ResetVerificationForm text={"Reset password"} type={"primary"} callback={handleVerification} handleClose={handleClose} />
        </Modal.Body>
      </Modal>
    </>
  )
}

export default ResetPasswordOverlay