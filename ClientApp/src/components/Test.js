import { data } from 'jquery';
import React, { useEffect, useState } from 'react'

function Test() {
    const [song, setSong] = useState({
        author: '',
        title: ''
    });
    useEffect(() =>{
        fetch('/test')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            setSong(data);
        })
    }, []);
  return (
    <div>
        <div>{song.author}</div>
        <div>{song.title}</div>
    </div>
  )
}

export default Test