import Cookies from 'js-cookie'
import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Header from '../components/Header'
import CSRFToken from '../components/CSRFToken'

const VerifyPasswordChangePage = () => {
	let [authenticated, setAuthenticated] = useState(false)
	let [verified, setVerified] = useState(false)
	const {uidb64, token} = useParams()

	useEffect(() => {
		activateAccount()
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

	const activateAccount = async () => {
		const response = await fetch(`/accounts/verify/${uidb64}/${token}`, {
			headers: {
				"Accept": "application/json",
				"X-CSRFToken": Cookies.get("csrftoken")
			}
		})
		if (response.status === 200) {
			setVerified(true)
		}
	}

  return (
    <div>
        <Header authenticated={authenticated} />
				<CSRFToken />
				<div className="justify-content-center">
					{verified ? <p>Your password has been changed please close this tab</p> : <p>Your verification link was invalid. please request another one</p>}
				</div>
    </div>
  )
}

export default VerifyPasswordChangePage