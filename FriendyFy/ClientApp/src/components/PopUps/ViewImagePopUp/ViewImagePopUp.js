import React from "react";
import '../PopUp.css';
import './ViewImagePopUp.css';
import ViewImagePopUpRightSide from "./ViewImagePopUpRightSide";
import PopUp from "../PopUp";
import OutsideClickHandler from "react-outside-click-handler";

const ViewImagePopUp = (props) => {

    return (
        <PopUp show={props.show} setShow={props.setShow} escClose={true}>
            <div className="popup-outer image-outer-popup">
                <OutsideClickHandler
                    onOutsideClick={() => {
                        props.setShow(false);
                    }}>
                    <div className="popup-inner image-popup">
                        <button onClick={() => props.setShow(false)} className="close-popup">x</button>
                        <div className={"picture " + (!props.showRightSection ? 'full-width' : '')}>
                            <img src={props.post ? props.post.postImage : ''} alt="" />
                        </div>
                        {props.showRightSection ? <ViewImagePopUpRightSide
                            post={props.post}
                            likes={props.likes}
                            comments={props.comments}
                            setComments={props.setComments}
                            setCommentsCount={props.setCommentsCount}
                            commentsCount={props.commentsCount}
                            setLikes={props.setLikes}
                            setIsLiked={props.setIsLiked}
                            isLiked={props.isLiked}
                            setShow={props.setShow}
                            setReposts={props.setReposts} /> : ''}
                    </div>
                </OutsideClickHandler>
            </div>
        </PopUp>)
}

export default ViewImagePopUp;