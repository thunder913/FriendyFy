import React, { useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import './RepostPopUp.css';
import PopUpHeader from "../PopUpHeader/PopUpHeader";
import PopUp from "../PopUp";
import { repost } from "../../../services/postService";
import OutsideClickHandler from "react-outside-click-handler";
import { NotificationManager } from 'react-notifications';

const RepostPopUp = ({ id, repostType, show, setShow, manyPopUps, setRepostsCount }) => {
    const [text, setText] = useState('');

    const onPostButtonClick = () => {
        repost(id, text, repostType)
            .then(async res => {
                if (res.status === 200) {
                    setRepostsCount((await res.json()).reposts);
                    setShow(false);
                    NotificationManager.success('Successfully reposted!', '', 2000);
                }else{
                    NotificationManager.error('There was an error reposting! Check if you are logged in!', '', 2000);
                }
            });
    }

    return (
        <PopUp show={show} setShow={setShow} escClose={true} manyPopUps={manyPopUps}>
            <div className="popup-outer repost-popup">
                <OutsideClickHandler
                    onOutsideClick={() => {
                        setShow(false);
                    }}>
                    <div className="popup-inner">
                        <PopUpHeader title="You may add a message, that will show in the repost!" closePopUp={() => setShow(false)} />
                        <TextareaAutosize
                            onChange={(e) => setText(e.target.value)}
                            placeholder="Add a message to the event repost."
                            id="repost-message" minRows={3} />
                        <button className="repost" onClick={onPostButtonClick}>Repost</button>

                    </div>
                </OutsideClickHandler>
            </div>
        </PopUp>)
}

export default RepostPopUp;