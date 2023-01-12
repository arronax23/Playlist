import React from 'react'
import Card from './Card';
import useFetchGet from './../customHooks/useFetchGet'

function Cards() {
    const {data : songs, isPending, error, httpResposne} = useFetchGet('api/GetAllSongs');
    const author = "Coco & Breezy, Tara Carosielli";
    const title = "Just Say";
    const imageURL = "https://i.ytimg.com/vi/o0tfrCzuAAo/hq720.jpg?sqp=-oaymwE2COgCEMoBSFXyq4qpAygIARUAAIhCGAFwAcABBvABAfgB_gmAAtAFigIMCAAQARh_IEQoEzAP&rs=AOn4CLA1Hz1kdMFuflHmzB8wbWrGBSYMTA"
    
    const author2 = "Tiësto, Jonas Blue & Rita Ora";
    const title2 = "Ritual";
    const imageURL2 = "https://i.ytimg.com/vi/ontU9cOg354/hqdefault.jpg?sqp=-oaymwEXCNACELwBSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLDsSACqZaCqCpAzN_tURTI8rai60Q";
   
  return (
    <div className="cards-container">
    {songs && songs.map(song => <Card key={song._id.increment} imgPath={song.imgPath} author={song.author} title={song.title}/>)}
  </div>
  )
}

export default Cards