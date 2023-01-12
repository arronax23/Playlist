import React from 'react'

function Card({ imgPath, author, title }) {
    const handleClick = () => {
        alert('cliked on a card');
    }
  return (
    <div className="card" onClick={handleClick}>
        <div className="image">
            <img src={`./img/${imgPath}`} />
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