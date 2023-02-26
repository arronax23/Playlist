import React, { useState }  from 'react'
import Option1Form from "./AddSongForms/Option1Form"
import Option2Form from "./AddSongForms/Option2Form"
import Option3Form from "./AddSongForms/Option3Form"
import AddSongOptions from "./AddSongOptions"

function AddSong() {
    const [pickedOption, setPickedOption] = useState(1);
    return (
        <div className="add-song-container">
            <AddSongOptions setPickedOption={setPickedOption} />
            {
                pickedOption == 1 ? <Option1Form /> :
                pickedOption == 2 ? <Option2Form /> :
                pickedOption == 3 ? <Option3Form /> :
                null
            }
        </div>
    )
}

export default AddSong