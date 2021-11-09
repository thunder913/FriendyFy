import { faImage, faUserFriends, faThumbtack  } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { useLoggedIn } from '../../contexts/LoggedInContext';
import FirstTimePopUp from '../FirstTimePopUp/FirstTimePopUp';
import './MakePostPopUp.css';
import Select from 'react-select'
import { TextareaAutosize } from '@mui/material';

const MakePostPopUp = ({hasImage}) =>{
    const { loggedIn } = useLoggedIn();

    return(
    <div className="make-post-popup">
        <div className="post-popup">
            <header className="make-post-header">
                <p className="make-post-title">Create a post</p>
                <button className="close-make-post">x</button>
            </header>
            <section className="make-post-underheader">
                <div className="image">
                    <img src={loggedIn.profilePhoto} alt="" />
                </div>
                <span>{loggedIn.firstName} {loggedIn.lastName}</span>
            <Select 
                       theme={(theme) => ({
                        ...theme,
                        colors: {
                          ...theme.colors,
                          primary25: '#595757',
                          primary: 'rgb(212, 212, 212)',
                          neutral0: '#3F3B3B',
                          neutral80: 'white',
                          neutral60: '#aaaaaa',
                          neutral10: '#595757',
                          dangerLight: '#523737',
                        }
                      })}
                      className="privacy-picker" 
                      options={[{value: 'friends', label:'Friends'},{value: 'everyone', label: 'Everyone'}]}
                      defaultValue={{value: 'friends', label:'Friends'}}
                      />
            </section>
            <TextareaAutosize placeholder="What's on your mind?" id="post-message" minRows={3}/>
            <div className="create-post-buttons">
                <FontAwesomeIcon 
                title="Add an image" 
                className={"post-button-icon " + (hasImage ? 'active' : '') } 
                icon={faImage}
                />

                <FontAwesomeIcon 
                title="Tag people" 
                className="post-button-icon" 
                icon={faUserFriends}
                />
                <FontAwesomeIcon 
                title="Add a location" 
                className="post-button-icon" 
                icon={faThumbtack}
                />
            </div>
            {hasImage ? 'Image' : ''}
            <button className="post">Post</button>
        </div>
    </div>)
}

export default MakePostPopUp;