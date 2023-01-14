import React, {ChangeEvent, useState, useRef}  from 'react'
import { useHistory } from 'react-router'

function AddSong() {
    const imgSelected = useRef();
    const imgInput = useRef();

    const audioSelected = useRef();
    const audioInput = useRef();

    const history = useHistory();

    const [author, setAuthor] = useState('');
    const [title, setTitle] = useState('');
    const [img, setImg] = useState();
    const [imgPath, setimgPath] = useState();
    const [audio, setAudio] = useState();
    const [audioPath, setAudioPath] = useState('');

    const onSubmit = (e) => {
        e.preventDefault();
        console.log(img);

        const song = {author, title, imgPath, audioPath};
        let formData = new FormData();
        formData.append('img',img);
        // formData.append('imagePath',imgPath);
        formData.append('audio',audio);
        // formData.append('audioPath',audioPath);
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
                console.log(formData);
                fetch('api/UploadFile', {
                    method: 'POST',
                    body: formData
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
        console.log(e.target.files[0]);
        setImg(e.target.files[0]);
        setimgPath(e.target.files[0].name);
        imgSelected.current.innerHTML = e.target.files[0].name;
        console.log(imgSelected);
    }

    const handleAudioChange = (e) => {
        console.log(e.target.files[0]);
        setAudio(e.target.files[0]);
        setAudioPath(e.target.files[0].name);
        audioSelected.current.innerHTML = e.target.files[0].name;
    }

    return (
        <div className="form-container">
            <div className="form">
                <form onSubmit={onSubmit}>
                    <label htmlFor="author">Author</label>
                    <input type="text" name="author" id="author" value={author} onChange={(e) => setAuthor(e.target.value)} />
                    <label htmlFor="title">Title</label>
                    <input type="text" name="title" id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
                    <label className="file-label" htmlFor="img" onChange={handleImgChange}>
                        <p>Image</p>
                        <i className="fa-solid fa-file"></i>
                        <input ref={imgInput} type="file" name="img" id="img"  />
                        <p ref={imgSelected} className="selected-file"></p>
                    </label>

                    <label className="file-label" htmlFor="audio" onChange={handleAudioChange}>
                        <p>Audio</p>
                        <i className="fa-solid fa-headphones"></i>
                        <input ref={audioInput} type="file" name="audio" id="audio"  />
                        <p ref={audioSelected} className="selected-file"></p>
                    </label>
            
                    <button type="submit" >Submit</button>
                </form>
            </div>
    </div>
    )
}

export default AddSong