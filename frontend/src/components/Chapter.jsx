import React from 'react'
import Card from 'react-bootstrap/Card'
import { useState } from 'react'
import { Link } from 'react-router-dom'

const Chapter = props => {
	let [hover, setHover] = useState(false)

	const toggleHover = () => {
		setHover(!hover)
	}

	function LightenDarkenColor(col, amt) {
		col = parseInt(col, 16);
		return (((col & 0x0000FF) + amt) | ((((col >> 8) & 0x00FF) + amt) << 8) | (((col >> 16) + amt) << 16)).toString(16);
	}

	let style;

	if (hover) {
		const darkerColor = "#" + LightenDarkenColor(props.color.slice(1), -40)
		style = {backgroundColor: darkerColor}
	} else {
		style = {backgroundColor: props.color}
	}

	return (
		<Link className="link" to={`/chapter/${props.id}`}>
			<Card onMouseEnter={toggleHover} onMouseLeave={toggleHover} style={style} className="chapter">
				<Card.Body>
					<Card.Title>{props.name}</Card.Title>
				</Card.Body>
			</Card>
		</Link>
	)
}

export default Chapter