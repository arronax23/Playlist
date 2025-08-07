import React, { useRef, useState }  from 'react'

function AddSongOptions({ setPickedOption }) {
    const option1Description = useRef();
    const option2Description = useRef();
    const option3Description = useRef();
    const optionDescription = useRef();

    const onOptionClick = (e) => {
        document.querySelectorAll(".option").forEach(option => option.classList.remove("active"));
        e.target.classList.add("active");

        if (e.target.classList.contains("option-1")){
            setPickedOption(1);
            option1Description.current.classList.remove("hide")
            option2Description.current.classList.add("hide")
            option3Description.current.classList.add("hide")
        }
        else if (e.target.classList.contains("option-2")){
            setPickedOption(2);
            option1Description.current.classList.add("hide")
            option2Description.current.classList.remove("hide")
            option3Description.current.classList.add("hide")
        }
        else if (e.target.classList.contains("option-3")){
            setPickedOption(3);
            option1Description.current.classList.add("hide")
            option2Description.current.classList.add("hide")
            option3Description.current.classList.remove("hide")
        }
    }

  return (
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
  )
}

export default AddSongOptions