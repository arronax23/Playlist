import React, {ChangeEvent, useState}  from 'react'
import { useHistory } from 'react-router'

function AddSong() {
    const history = useHistory();

    const [author, setAuthor] = useState('');
    const [title, setTitle] = useState('');
    const [img, setImg] = useState();
    const [imgPath, setImgPath] = useState('');
    const [audio, setAudio] = useState();
    const [audioPath, setAudioPath] = useState('');

    const onSubmit = (e) => {
        e.preventDefault();
        console.log(img);

        const song = {author, title, imgPath, audioPath};
        console.log(song);

        fetch('api/AddSong', 
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(song)  
            })
        .then(response => {
            if (!response.ok){
                alert('Error');
                throw new Error("Something went wrong!");
            }
            else{

                fetch('api/UploadFile', {
                    method: 'POST',
                    body: img,
                    // 👇 Set headers manually for single file upload
                    headers: {
                      'content-type': img.type,
                      'content-length': `${img.size}`, // 👈 Headers need to be a string
                    },
                  })
                  .then(response => {
                    if (!response.ok){
                        alert('Error');
                        throw new Error("Something went wrong!");
                    }
                    else {
                        history.push('/');
                    }
                });
                
       
            }
        })
        .catch(error => {
            console.log(error);
        });

    }

    const handleImgChange = (e) => {
        setImg(e.target.files[0]);
        console.log(e.target.files[0]);
        setImgPath(e.target.files[0].name);
    }

    const handleAudioChange = (e) => {
        setAudio(e.target.files[0]);
        setAudioPath(e.target.files[0].name);
    }

    return (
        <div className="form-container">
            <div className="form">
                <form onSubmit={onSubmit}>
                    <label htmlFor="author">Author</label>
                    <input type="text" name="author" id="author" value={author} onChange={(e) => setAuthor(e.target.value)} />
                    <label htmlFor="title">Title</label>
                    <input type="text" name="title" id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
                    <label htmlFor="imgPath">Image</label>
                    <input type="file" name="img" id="img" onChange={handleImgChange} />
                    <label htmlFor="audio">Audio</label>
                    <input type="file" name="audio" id="audio" onChange={handleAudioChange} />
                    <button type="submit" >Submit</button>
                </form>
            </div>
    </div>
    )
}

export default AddSong