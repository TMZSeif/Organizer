import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'
import CSRFToken from '../components/CSRFToken'

const LogoutPage = () => {
	let [loggedOut, setLoggedOut] = useState("")
	const navigate = useNavigate()

	useEffect(() => {
		logout()
	}, [])

	const logout = async () => {
		const response = await fetch("accounts/logout/", {
			method: "POST",
			headers: {
				"Accept": "application/json",
				"X-CSRFToken": Cookies.get("csrftoken")
			}
		})
		const data = await response.json()
		if (response.status === 200) {
			setLoggedOut(data.success)
			navigate("/")
		} else {
			setLoggedOut(data.error)
		}
	}

  return (
    <div>
        <Header />
		<CSRFToken />
		<div className="justify-content-center">
			<h1>{loggedOut ? "You have been logged out" : loggedOut}</h1>
		</div>
    </div>
  )
}

export default LogoutPage