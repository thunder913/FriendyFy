import React, { useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import './RepostPopUp.css';
import PopUpHeader from "../PopUpHeader/PopUpHeader";
import PopUp from "../PopUp";
import { repost } from "../../../services/postService";
import '../PopUp.css'
const RepostPopUp = ({ id, repostType, show, setShow }) => {
    const [text, setText] = useState('');

    const onPostButtonClick = () => {
        repost(id, text, repostType)
            .then(res => {
                if (res.status === 200) {
                    setShow(false);
                }
            });
    }

    return (
    <PopUp show={show} setShow={setShow} escClose={true}>
        <div className="popup-outer repost-popup">
        <div className="popup-inner">
            <PopUpHeader title="You may add a message, that will show in the repost!" closePopUp={() => setShow(false)} />
            <TextareaAutosize
                onChange={(e) => setText(e.target.value)}
                placeholder="Add a message to the event repost."
                id="repost-message" minRows={3} />
            <button className="repost" onClick={onPostButtonClick}>Repost</button>

        </div>
    </div>
    </PopUp>)
}

export default RepostPopUp;