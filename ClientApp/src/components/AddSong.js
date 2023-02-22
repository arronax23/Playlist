import React, {ChangeEvent, useState, useRef}  from 'react'
import { useHistory } from 'react-router'
import {v4 as uuidv4} from 'uuid';

function AddSong() {
    const imgSelected = useRef();
    const imgInput = useRef();

    const audioSelected = useRef();
    const audioInput = useRef();

    const option1Description = useRef();
    const option2Description = useRef();
    const option3Description = useRef();
    const optionDescription = useRef();

    const history = useHistory();

    const [author, setAuthor] = useState('');
    const [title, setTitle] = useState('');
    const [img, setImg] = useState();
    const [imgPath, setimgPath] = useState();
    const [audio, setAudio] = useState();
    const [audioPath, setAudioPath] = useState('');


    const onOptionClick = (e) => {
        document.querySelectorAll(".option").forEach(option => option.classList.remove("active"));
        e.target.classList.add("active");

        if (e.target.classList.contains("option-1")){
            option1Description.current.classList.remove("hide")
            option2Description.current.classList.add("hide")
            option3Description.current.classList.add("hide")
        }
        else if (e.target.classList.contains("option-2")){
            option1Description.current.classList.add("hide")
            option2Description.current.classList.remove("hide")
            option3Description.current.classList.add("hide")
        }
        else if (e.target.classList.contains("option-3")){
            option1Description.current.classList.add("hide")
            option2Description.current.classList.add("hide")
            option3Description.current.classList.remove("hide")
        }
    }

    const onSubmit = (e) => {
        e.preventDefault();
        console.log(img);

        const song = {author, title, imgPath, audioPath};
        let formData = new FormData();
        formData.append('img',img);
        formData.append('imgPath',imgPath);
        formData.append('audio',audio);
        formData.append('audioPath',audioPath);
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
        imgSelected.current.innerHTML = e.target.files[0].name;
        let imgUUID = uuidv4();
        let imgNameArray = e.target.files[0].name.split('.');
        let extension = imgNameArray[imgNameArray.length - 1];
        let imgName = `${imgUUID}.${extension}`;

        console.log(e.target.files[0]);
        setImg(e.target.files[0]);
        setimgPath(imgName);
    }

    const handleAudioChange = (e) => {
        audioSelected.current.innerHTML = e.target.files[0].name;
        let audioUUID = uuidv4();
        let audioNameArray = e.target.files[0].name.split('.');
        let extension = audioNameArray[audioNameArray.length - 1];
        let audioName = `${audioUUID}.${extension}`;

        console.log(e.target.files[0]);
        setAudio(e.target.files[0]);
        setAudioPath(audioName);
    }

    return (
        <div className="add-song-container">
            <div className="options">
                <h1 className="options-header">Options</h1>
                <div className="options-list">
                    <div className="option option-1 active"onClick={onOptionClick}>1</div>
                    <div className="option option-2"  onClick={onOptionClick}>2</div>
                    <div className="option option-3" onClick={onOptionClick}>3</div>
                </div>
                <div className="option-description" ref={optionDescription}>
                    <p className="option-1-description"  ref={option1Description} >1. Upload audio file</p>
                    <p className="option-2-description hide" ref={option2Description} >2. Upload video file</p>
                    <p className="option-3-description hide"  ref={option3Description} >3. Upload from Youtube URL</p>
                </div>
            </div>
            <div className="option-1-form">
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