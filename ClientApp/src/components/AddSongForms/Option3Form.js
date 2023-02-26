import React, { useState, useRef}  from 'react'
import {v4 as uuidv4} from 'uuid';

function Option3Form() {
    // const [song, setSong] = useState({});
    const [link, setLink] = useState('');
    const [videoPath, setVideoPath] = useState('');

    const handleLinkChange = (e) => {
        setLink(e.target.value);
        let videoUUID = uuidv4();
        setVideoPath(`${videoUUID}.mp4`)
    }

    const onSubmit = (e) => {
        e.preventDefault();

        fetch('api/DownloadYoutubeVideo', 
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({videoPath, link})  
            })
        .then(response => console.log(response))
        .catch(error => {
            console.log(error);
        });
    }

    return (
        <div className="form-container">
            <form onSubmit={onSubmit}>
                <label htmlFor="link">Link</label>
                <input type="text" name="link" id="link" value={link} onChange={handleLinkChange} />
                <button type="submit" >Submit</button>
            </form>
        </div>
  )
}

export default Option3Form