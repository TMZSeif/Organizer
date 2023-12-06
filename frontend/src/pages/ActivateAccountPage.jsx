import Cookies from 'js-cookie'
import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Header from '../components/Header'

const ActivateAccountPage = () => {
	let [authenticated, setAuthenticated] = useState(false)
	let [activated, setActivated] = useState(false)
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
		const response = await fetch(`/accounts/activate/${uidb64}/${token}`, {
			headers: {
				"Accept": "application/json",
				"X-CSRFToken": Cookies.get("csrftoken")
			}
		})
		if (response.status === 200) {
			setActivated(true)
		}
	}

  return (
    <div>
        <Header authenticated={authenticated} />
				<div className="justify-content-center">
					{activated ? <p>Your account has been activated please close this tab</p> : <p>Your activation link was invalid. please request another one</p>}
				</div>
    </div>
  )
}

export default ActivateAccountPage