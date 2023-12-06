import React from 'react'
import Header from '.././components/Header'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Chapter from '../components/Chapter'
import { useState, useEffect } from 'react'
import { chunk } from 'lodash'
import AddChapter from '../components/AddChapter'
import { useNavigate } from 'react-router-dom'
import CSRFToken from '../components/CSRFToken'
import Cookies from 'js-cookie'

const Home = () => {
	let [chapters, setChapters] = useState([])
	let [isAuthenticated, setAuthenticated] = useState(false)
	let [teacher, setTeacher] = useState(false)
	const navigate = useNavigate()

	useEffect(() => {
		checkAuthenticated()
		checkTeacher()
		getChapters()
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

	const checkTeacher = async () => {
		const response = await fetch("/accounts/user", {
			headers: {
				"Accept": "application/json",
				"X-CSRFToken": Cookies.get("csrftoken")
			}
		})
		const data = await response.json()
		if (response.status === 200) {
			setTeacher(data.isTeacher)
		}
	}

	const getChapters = async () => {
		let response = await fetch("/api/chapters")
		let data = await response.json()
		data = chunk(data, 4)
		setChapters(data)
	}

	const generate_random_color = () => {
		return '#'+Math.floor(Math.random()*16777215).toString(16);
	}

	const checkAddChapter = () => {
		if (chapters.length === 0) {
			if (teacher) {
				return <AddChapter />
			}
		}
	}

	return (
		<div>
			<Header authenticated={isAuthenticated} />
			<CSRFToken />
			<Container>
				{chapters.map((section, idx) => (
					<Row xs={1} sm={2} lg={4} key={idx}>
						{
							section.map((chapter, idx) => (
								<Col key={idx}>
									<Chapter id={chapter.id} color={generate_random_color()} name={chapter.name} />
								</Col>
							))
						}
						{
							idx == chapters.length-1 && teacher ? <AddChapter /> : undefined
						}
					</Row>
				))}
				{checkAddChapter()}
			</Container>
		</div>
	)
}

export default Home