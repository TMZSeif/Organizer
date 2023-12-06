import React, { useEffect, useState } from 'react'
import Navbar from 'react-bootstrap/Navbar'
import Container from 'react-bootstrap/Container';
import { Link } from 'react-router-dom';
import { Image, Nav } from 'react-bootstrap';
import Cookies from 'js-cookie';

const Header = props => {
  let [name, setName] = useState("")
  let [picture, setPicture] = useState("")
  let [teacher, setTeacher] = useState(false)

  useEffect(() => {
    getUser()
  }, [])

  const authLinks = () => {
    return (
      <>
        {teacher ? <Nav.Link className='header-text'><Link style={{color: "white", textDecoration: "none", fontSize: "20px"}} to="/chapters" >Edit Chapters</Link></Nav.Link>: undefined}
        <Nav.Link className='header-text'><Link style={{color: "white", textDecoration: "none", fontSize: "20px", marginLeft: "10px"}} to="/logout" >Logout</Link></Nav.Link>
      </>
    )
  }

  const guestLinks = () => {
    return (
      <>
        <Nav.Link className='header-text'><Link style={{color: "white", textDecoration: "none", fontSize: "20px"}} to="/register" >Sign Up</Link></Nav.Link>
        <Nav.Link className='header-text'><Link style={{color: "white", textDecoration: "none", fontSize: "20px", marginLeft: "10px"}} to="/login" >Login</Link></Nav.Link>
      </>
    )
  }

  const getUser = async () => {
    const response = await fetch("/accounts/user", {
      headers: {
        "Accept": "application/json",
        "X-CSRFToken": Cookies.get("csrftoken")
      }
    })
    const data = await response.json()
    if (response.status === 200) {
      setName(data.name)
      setPicture(data.picture)
      setTeacher(data.isTeacher)
    }
  }

  return (
    <Navbar expand="md" bg="success" data-bs-theme="dark">
      <Container fluid>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse className="justify-content-between">
          <div>
            <Link className='header-text' style={{textDecoration: "none"}} to="/"><Navbar.Brand><strong>Subject</strong></Navbar.Brand></Link>
            {props.authenticated ? authLinks() : guestLinks()}
          </div>
          <Navbar.Brand>
            {props.authenticated ? <Image className="header-picture" src={"http://127.0.0.1:8000"+picture} roundedCircle /> : <Image className="header-picture" src="src/assets/default.png" roundedCircle />}
            {props.authenticated ? <Link to="/user" style={{textDecoration: "none", color: "white"}}>{name}</Link> : "Anonymous"}
          </Navbar.Brand>
        </Navbar.Collapse>
        <Navbar.Brand className='chapter-name justify-content-center'>
          {props.chapter}
        </Navbar.Brand>
      </Container>
    </Navbar>
  )
}

export default Header