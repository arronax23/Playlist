import React from 'react'

function Card({ imageURL, author, title }) {
    const handleClick = () => {
        alert('cliked on a card');
    }
  return (
    <div className="card" onClick={handleClick}>
        <div className="image">
            <img src={imageURL} />
        </div>
        <div className="author">
            {author}
        </div>
        <div className="title">
            {title}
        </div>
         
    </div>
  )
}

export default Card