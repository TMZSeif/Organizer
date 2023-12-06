import React from 'react'
import Form from 'react-bootstrap/Form'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUpload } from '@fortawesome/free-solid-svg-icons'
import Cookies from 'js-cookie'

const PostListForm = props => {
  let [file, setFile] = useState()
  let [text, setText] = useState()
  let {id} = useParams()
  let form = new FormData()

  useEffect(() => {
    form.append("text", "")
    form.append("file", file)
    handleSubmit()
  }, [file])

  useEffect(() => {
    form.append("text", text)
    form.append("file", "")
  }, [text])

  const handleSubmit = async (e=undefined) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation();
    }
    if (!text && !file) {
      setFile(undefined)
      return
    }
    await fetch(`/api/chapters/${id}/post/`, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "X-CSRFToken": Cookies.get("csrftoken")
      },
      body: form
    })
    setFile(undefined)
    setText("")
    props.getPosts()
  }

  const handleChange = event => {
    if (event.target.files) {
      setFile(event.target.files[0])
    } else {
      setText(event.target.value)
    }
  }

  return (
    <Form onSubmit={handleSubmit} className="post-form">
        <input type="file" name="file" id="fileField" onChange={handleChange} style={{display: "none"}} />
        <button className="btn" type="button" value="Browse..." onClick={() => document.getElementById("fileField").click()}><FontAwesomeIcon size="lg" icon={faUpload} /></button>
        <Form.Control className="post-control" value={text} onChange={handleChange} type="text" />
    </Form>
  )
}

export default PostListForm