import React, { useRef } from 'react'
import logo from "./../favicon.svg"
import { useHistory } from 'react-router';


function Navbar() {
  const history = useHistory();
  const nav = useRef();
  const home = useRef();
  const addSong = useRef();

  const barClick = () => {
    home.current.classList.toggle('hidden');
    addSong.current.classList.toggle('hidden');
    nav.current.classList.toggle('slim');
  }

  return (
    <nav ref={nav}>
      <div className="bar-container" onClick={barClick}>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </div>
        <ul>
            <li className="logo" onClick={() => history.push('/')}><img src={logo} alt="No logo" /></li>
            <li className="home" ref={home} onClick={() => history.push('/')}>Home</li>
            <li className="add-song" ref={addSong} onClick={() => history.push('/addsong')}>Add song</li>
        </ul>
  </nav>
  )
}

export default Navbar