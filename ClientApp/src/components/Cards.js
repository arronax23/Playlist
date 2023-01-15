import React from 'react'
import Card from './Card';
import useFetchGet from './../customHooks/useFetchGet'

function Cards() {
    const {data : songs, isPending, error, httpResposne} = useFetchGet('api/GetAllSongs');

  return (
    <div className="cards-container">
    {songs && songs.map(song => 
    <Card 
      key={song.id} 
      id = {song.id}
      timestamp={song.id} 
      imgPath={song.imgPath} 
      author={song.author} 
      title={song.title}
    />)}
  </div>
  )
}

export default Cards