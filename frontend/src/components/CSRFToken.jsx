import React, { useEffect, useState } from 'react'

const CSRFToken = () => {
	let [csrftoken, setCsrftoken] = useState("")

	function getCookie(name) {
		const value = `; ${document.cookie}`;
		const parts = value.split(`; ${name}=`);
		if (parts.length === 2) return parts.pop().split(';').shift();
	}

	useEffect(() => {
		const fetchData = async () => {
			await fetch("/accounts/csrf_cookie")
		}
		fetchData()
		setCsrftoken(getCookie("csrftoken"))
	}, [])
  
  return (
    <input type="hidden" id="csrf" value={csrftoken} />
  )
}

export default CSRFToken