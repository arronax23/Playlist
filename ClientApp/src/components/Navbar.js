import React, { useRef } from 'react'
import logo from "./../favicon.svg"
import { useHistory } from 'react-router';


function Navbar() {
  const history = useHistory();

  const barClick = () => {
    document.querySelectorAll('.nav-item').forEach(item => item.classList.toggle('mobile-hidden'));
  }

  return (
    <nav>
      <div className="bar-container" onClick={barClick}>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </div>
        <ul>
            <li className="logo" onClick={() => history.push('/')}><img src={logo} alt="No logo" /></li>
            <li className="nav-item home mobile-hidden" onClick={() => history.push('/')}>Home</li>
            <li className="nav-item add-song mobile-hidden" onClick={() => history.push('/addsong')}>Add song</li>
        </ul>
  </nav>
  )
}

export default Navbar