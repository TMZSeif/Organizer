import React from 'react'
import Card from 'react-bootstrap/Card'
import { Link } from 'react-router-dom'

const AddChapter = () => {
  return (
		<Card className="add-chapter">
			<Card.Body>
				<Card.Title><Link className="add" to="/create">+</Link></Card.Title>
			</Card.Body>
		</Card>
  )
}

export default AddChapter