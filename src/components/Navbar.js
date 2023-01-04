import React from 'react'
import logo from "./../favicon.svg"
import { useHistory } from 'react-router';


function Navbar() {
  const history = useHistory();
  return (
    <nav>
        <ul>
            <li className="logo" onClick={() => history.push('/')}><img src={logo} alt="No logo" /></li>
            <li className="home" onClick={() => history.push('/')}>Home</li>
            <li className="add-song" onClick={() => history.push('/addsong')}>Add song</li>
        </ul>
  </nav>
  )
}

export default Navbar