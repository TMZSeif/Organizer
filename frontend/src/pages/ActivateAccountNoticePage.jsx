import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import CSRFToken from '../components/CSRFToken'
import Cookies from 'js-cookie'
import { Button } from 'react-bootstrap'

const ActivateAccountNoticePage = () => {
	let [authenticated, setAuthenticated] = useState(false)

	useEffect(() => {
		checkAuthenticated()
	}, [])

	const checkAuthenticated = async () => {
		const response = await fetch("/accounts/authenticated", {
			headers: {
				"Accept": "application/json",
				"X-CSRFToken": Cookies.get("csrftoken")
			}
		})
		if (response.status === 403) {
			setAuthenticated(false)
			navigate("/register")
		}
		setAuthenticated(true)
	}

	const resendActivationLink = async () => {
		const response = await fetch("/accounts/resendActivationLink", {
			headers: {
				"Accept": "application/json",
				"X-CSRFToken": Cookies.get("csrftoken")
			}
		})
		if (response.status === 200) {
			window.location.reload()
		}
	}

  return (
    <div>
        <Header authenticated={authenticated} />
		<CSRFToken />
        <div className="justify-content-center">
            <h1>Please check your email to activate your account</h1>
            <p>If you cannot find it please check your spam folder</p>
			<Button variant="primary" onClick={resendActivationLink} type="button">Resend</Button>
        </div>
    </div>
  )
}

export default ActivateAccountNoticePage