import React from 'react'
import logo from "./../favicon.svg"


function Navbar() {
  return (
    <nav>
        <ul>
            <li className="logo"><img src={logo} alt="No logo" /></li>
            <li className="home">Home</li>
            <li className="add-song">Add song</li>
        </ul>
  </nav>
  )
}

export default Navbar