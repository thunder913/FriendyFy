import React, {useState} from "react";
import { CSSTransition } from 'react-transition-group';
import OutsideClickHandler from 'react-outside-click-handler';
import './FeedHeaderOptions.css'
import { deletePost } from "../../services/postService";

const FeedHeaderOptions = ({showOptions, setShowOptions, postId, postType, setIsDeleted, setHasError}) => {

    const onDeleteButtonClicked = () => {
        deletePost(postId, postType)
            .then(res => {
                if(res.status == 200){
                    setHasError(false);
                }else{
                    setHasError(true);
                }
                setIsDeleted(true);
            })
    }

    return(
        <OutsideClickHandler
        onOutsideClick={() => {
          setShowOptions(false);
        }}>
        <CSSTransition 
            in={showOptions} 
            timeout={200} 
            classNames="animation-options" 
            unmountOnExit
            onEnter={() => setShowOptions(true)}
            onExited={() => setShowOptions(false)}>
            <div className="header-options">
                <div className="inner-options">
                    <button className="delete-button" onClick={onDeleteButtonClicked}>Delete</button>
                </div>
            </div>
        </CSSTransition>
        </OutsideClickHandler>
    )
}

export default FeedHeaderOptions;