import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import ChapterList from '../components/ChapterList'
import CSRFToken from '../components/CSRFToken'
import Cookies from 'js-cookie'

const EditChaptersPage = () => {
  let [authenticated, setAuthenticated] = useState(false)

	useEffect(() => {
		checkAuthenticated()
	})

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

  return (
    <div>
      <Header authenticated={authenticated} />
      <CSRFToken />
      <ChapterList />
    </div>
  )
}

export default EditChaptersPage