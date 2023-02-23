import React, { useRef } from 'react'
import { useHistory } from 'react-router-dom'

function Card({id, author, title, audioOrVideo, customImg, imgPath, videoPath }) {
    const history = useHistory();
    const card = useRef();
    const cardDelete = useRef();
    const cardListen = useRef();
    const cardDeleteConfirmation = useRef();

    const handleListenClick = () => {
        console.log(id);
        if (audioOrVideo == "audio"){
            history.push(`audiocard/${id}`)
        }
        else if (audioOrVideo == "video"){
            history.push(`videocard/${id}`)
        }
    }

    const handleDeleteClick = () => {
        cardDelete.current.classList.add('hide');
        cardDeleteConfirmation.current.classList.remove('hide')
        cardListen.current.classList.add('card-listen-small');
        cardDeleteConfirmation.current.classList.add('card-delete-confirmation-active');
    }

    const handleDeleteConfirmedClick = () => {
        card.current.classList.add('card-disappear')

        setTimeout(() => {
            card.current.style.position = 'absolute';

            let apiURL = "";
            if (audioOrVideo == "audio" ){
                apiURL = "api/DeleteSong/";
            }
            else if (audioOrVideo == "video"){
                apiURL = "api/DeleteVideoSong/";
            }

            fetch(apiURL+id, 
            {
                method: 'DELETE'
            })
            .then(resp => {
                console.log("resp:"+resp);
                if (!resp.ok){
                    throw new Error('Failed deleting.');
                }
            })
            .catch(err => console.log("err:"+err.message))

        }, 300)
        
    }

    const handleDeleteCanceledClick = () => {
        cardDelete.current.classList.remove('hide');
        cardListen.current.classList.remove('card-listen-small');
        cardDeleteConfirmation.current.classList.add('hide')
    }

  return (
    <div className="card" ref={card}>
        <div className="card-listen" onClick={handleListenClick} ref={cardListen}>Listen</div>
        <div className="card-delete" onClick={handleDeleteClick} ref={cardDelete}>Delete</div>
        <div className="card-delete-confirmation"  ref={cardDeleteConfirmation}>
            <div>Are you sure?</div>
            <div className="delete-buttons">
                <div className="yes" onClick={handleDeleteConfirmedClick}>Yes</div>
                <div className="no" onClick={handleDeleteCanceledClick}>No</div>
            </div>
        </div>
        { audioOrVideo == "audio" || customImg == true ? 
        (
            <div className="card-image" >
                <img src={`/img/${imgPath}`} />
            </div>
        )
        :
        audioOrVideo == "video" && customImg == false ? 
        (
            <div className="card-image" >
                <video src={`/video/${videoPath}`}></video>
            </div>
        )
        : 
        null
        }

        <div className="card-author">
            {author}
        </div>
        <div className="card-title">
            {title}

        </div>
        { audioOrVideo == "audio" ? 
        (
            <div className="card-icon">
            <i className="fa-solid fa-headphones" title='Audio'></i>
            </div>
        )
        :
        audioOrVideo == "video" ? 
        (
            <div className="card-icon">
            <i className="fa-solid fa-film" title='Video'></i>
            </div>
        )
        : 
        null
        }

    </div>
  )
}

export default Card