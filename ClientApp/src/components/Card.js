import React from 'react'
import { useHistory } from 'react-router-dom'

function Card({id, imgPath, author, title }) {
    const history = useHistory();
    const handleClick = () => {
        console.log(id);
        history.push(`audiocard/${id}`)
    }
  return (
    <div className="card" onClick={handleClick}>
        <div className="card-image">
            <img src={`/img/${imgPath}`} />
        </div>
        <div className="card-author">
            {author}
        </div>
        <div className="card-title">
            {title}
        </div>
    </div>
  )
}

export default Card