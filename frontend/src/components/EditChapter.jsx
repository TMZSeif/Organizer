import Cookies from 'js-cookie'
import React from 'react'
import { ListGroup } from 'react-bootstrap'
import { Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

const EditChapter = props => {
  
  const navigate = useNavigate()

  const handleDelete = async () => {
    fetch(`/api/chapters/${props.chapter.id}/delete`, {
      method: "DELETE",
      headers: {
        "X-CSRFtoken": Cookies.get("csrftoken")
      }
    })
    props.getChapters()
  }

  const handleUpdate = () => {
    navigate(`/chapters/${props.chapter.id}/update`)
  }

  return (
    <ListGroup.Item className="edit-chapter">
      <span className="edit-chapter-name">{props.chapter.name}</span>
      <div>
        <Button onClick={handleUpdate} variant="secondary">Edit</Button>
        <div className="vr" />
        <Button onClick={handleDelete} variant="outline-danger">Delete</Button>
      </div>
    </ListGroup.Item>
  )
}

export default EditChapter