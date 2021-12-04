import React, {useEffect, useState} from "react";
import TextareaAutosize from "react-textarea-autosize";
import '../PopUp.css';
import './RepostPopUp.css';
import useScrollBlock from "../../../hooks/useScrollBlock";
import PopUpHeader from "../PopUpHeader/PopUpHeader";
import { repost } from "../../../services/postService";
const RepostPopUp = ({id, repostType, closePopUp}) => {
    const [text, setText] = useState('');
    const [blockScroll, allowScroll] = useScrollBlock();
    const closePopUpEvent = () => {
        allowScroll();
        closePopUp();
    }

    const escPressed = (e) => {
        if(e.keyCode === 27){
            closePopUpEvent();
        }
    }

    const onPostButtonClick = () => {
        repost(id, text, repostType)
            .then(res => {
                if(res.status === 200){
                    closePopUpEvent();
                }
            });
    }

    useEffect(() => {
        blockScroll();
        window.addEventListener("keydown", escPressed, false);
        return () => {
            window.removeEventListener("keydown", escPressed, false);
          };
    }, [])

    return(<div className="popup-outer repost-popup">
    <div className="popup-inner">
        <PopUpHeader title="You may add a message, that will show in the repost!" closePopUp={closePopUp}/>
        <TextareaAutosize 
                onChange={(e) => setText(e.target.value)} 
                placeholder="Add a message to the event repost." 
                id="repost-message" minRows={3}/>
        <button className="repost" onClick={onPostButtonClick}>Repost</button>

    </div>
</div>)
}

export default RepostPopUp;